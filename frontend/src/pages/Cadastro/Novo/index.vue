<template>
  <v-row>
    <v-col cols="12" v-text="$route.name" class="grey--text text-h2" />
    <v-col cols="12" class="px-0">
      <v-col cols="12">
        <CPTInput
          v-model="enrollment"
          v-maska="'###########'"
          autofocus
          label="Matrícula*"
          counter="11"
          @input="onInputEnrollment"
          @keydown.enter="isValidEnrollment && getStudent(enrollment)"
          type="number"
        />
      </v-col>
      <v-col cols="12 d-flex justify-end">
        <CPTBtn
          label="Buscar"
          icon="mdi-magnify"
          :disabled="!isValidEnrollment"
          :loading="loading"
          @click="getStudent(enrollment)"
        />
      </v-col>

      <v-skeleton-loader
        v-if="loading"
        :types="{ sections: 'heading, list-item-two-line@4' }"
        type="sections@2"
        class="mt-5"
      />

      <v-form
        v-else-if="student"
        @submit.prevent="onSubmit"
        ref="form"
        lazy-validation
        class="d-flex flex-wrap"
      >
        <!-- Student data -->
        <v-col cols="12">
          <CPTSubtitle label="Dados do aluno" />
        </v-col>

        <v-col cols="12">
          <CPTInput v-model="student.nome" label="Nome*" disabled required />
        </v-col>

        <v-col cols="auto" class="py-0">
          <v-switch
            v-model="isProcessoJudicial"
            @click="processoJudicial = null"
            label="Cadastro no Fila Única com processo judicial"
          />
        </v-col>
        <v-col v-if="isProcessoJudicial" class="py-0">
          <CPTInput
            v-model="processoJudicial"
            label="Número do processo*"
            required
          />
        </v-col>

        <v-col cols="12" class="d-flex">
          <v-col cols="auto" class="pa-0">
            <v-switch
              v-model="vulnerabilidadeSocial"
              label="Criança em vulnerabilidade social"
            />
          </v-col>
        </v-col>

        <v-col cols="12">
          <CPTSelect
            v-model="transporteProprio"
            :items="MEIOS_TRANSPORTE"
            item-text="text"
            item-value="value"
            required
            label="Família possui meio de transporte próprio*"
          />
        </v-col>

        <v-col cols="12" class="d-flex flex-wrap">
          <v-col cols="12">
            <CPTSubtitle label="Endereço" />
          </v-col>

          <v-col cols="2">
            <CPTInput
              v-model="student.endereco.cep"
              label="CEP*"
              required
              v-maska="'#####-###'"
            />
          </v-col>
          <v-col cols="4">
            <CPTInput v-model="student.endereco.rua" label="Rua*" required />
          </v-col>
          <v-col cols="2">
            <CPTInput v-model="student.endereco.numero" label="Número" />
          </v-col>
          <v-col cols="4">
            <CPTInput
              v-model="student.endereco.bairro"
              label="Bairro*"
              required
            />
          </v-col>
          <v-col cols="6">
            <CPTAutocomplete
              v-model="state"
              label="Estado*"
              @change="getCities(true)"
              :items="states"
              noDataText="Estado não encontrado"
              item-text="nome"
              clearable
              return-object
              required
            />
          </v-col>
          <v-col cols="6">
            <CPTAutocomplete
              v-model="student.endereco.cidade"
              label="Cidade*"
              :items="cities"
              item-text="nome"
              noDataText="Cidade não encontrada"
              return-object
              clearable
              required
            />
          </v-col>
          <v-col cols="12">
            <CPTInput
              v-model="student.endereco.complemento"
              label="Complemento"
            />
          </v-col>
          <!-- /student data -->

          <v-col cols="12">
            <CPTSubtitle label="Membros da Família" />
          </v-col>

          <CPTFormMemberFamily v-model="father" />

          <CPTSubtitle />

          <CPTFormMemberFamily
            v-if="mother"
            v-model="mother"
            removeButton
            @remove="mother = null"
          />

          <template v-for="(member, index) in members">
            <v-col cols="12" :key="`${member.nome}_${member.kinship}_divider`">
              <CPTSubtitle />
            </v-col>

            <CPTFormMemberFamily
              v-model="members[index]"
              removeButton
              @remove="members.splice(index, 1)"
              :key="`${member.nome}_${member.kinship}`"
            />
          </template>

          <template v-if="newFamilyMember">
            <v-col cols="12">
              <CPTSubtitle />
            </v-col>
            <CPTFormMemberFamily
              v-model="newFamilyMember"
              removeButton
              @remove="newFamilyMember = null"
            />
          </template>

          <v-col class="d-flex justify-center" cols="12">
            <CPTBtn
              label="Adicionar Membro"
              icon="mdi-plus"
              :disabled="
                father.isEmpty() ||
                  (mother && mother.isEmpty()) ||
                  (newFamilyMember && newFamilyMember.isEmpty())
              "
              @click="addFamilyMember"
            />
          </v-col>

          <template v-if="family.length">
            <v-col cols="12">
              <CPTSubtitle label="Renda Familiar" />
            </v-col>

            <v-col cols="12" class="d-flex justify-center py-0">
              <v-data-table
                hide-default-footer
                :headers="[
                  { sortable: false, value: 'number' },
                  {
                    text: 'Parentesco',
                    sortable: false
                  },
                  {
                    text: 'Nome',
                    sortable: false
                  },
                  {
                    text: 'Renda Mensal',
                    sortable: false
                  }
                ]"
                :items="family"
              >
                <template v-slot:item="{ item: member, index }">
                  <tr v-if="index === 0">
                    <td>
                      <span class="text-subtitle-1" v-text="index + 1" />
                    </td>

                    <td />

                    <td>
                      <span class="text-subtitle-1" v-text="student.nome" />
                    </td>

                    <td>
                      R$ 0,00
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span class="text-subtitle-1" v-text="index + 2" />
                    </td>
                    <td>
                      <span
                        class="text-subtitle-1"
                        v-text="member.kinship.nome"
                      />
                    </td>
                    <td>
                      <span class="text-subtitle-1" v-text="member.nome" />
                    </td>
                    <td>
                      <v-text-field
                        v-model="member.income"
                        prefix="R$"
                        @input="
                          income => {
                            if (income)
                              member.income = income.replace('.', ',');
                          }
                        "
                        class="text-subtitle-1"
                        v-maska="'#*,##'"
                      />
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </template>
        </v-col>

        <v-col cols="12 d-flex justify-end">
          <CPTBtn
            label="Salvar"
            :loading="saving"
            icon="mdi-content-save"
            type="submit"
          />
        </v-col>
      </v-form>
    </v-col>

    <v-dialog v-model="dialog" width="750">
      <v-card color="grey lighten-5">
        <v-card-title
          class="headline primary white--text"
          v-text="'Renda percapta zerada'"
        />

        <v-card-text class="pt-3">
          Não foi atribuída renda para nenhum membro do grupo familiar. Deseja
          continuar?
        </v-card-text>

        <v-divider />

        <v-card-actions class="d-flex justify-end py-3">
          <CPTBtn label="Não" @click="dialog = false" />
          <CPTBtn
            label="Sim"
            @click="criarInscricao(inscricao), (dialog = false)"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTSelect from "@/components/Select";
import CPTAutocomplete from "@/components/Autocomplete";
import CPTSubtitle from "@/components/FormSubtitle";
import CPTBtn from "@/components/Btn";
import CPTFormMemberFamily from "@/pages/Cadastro/components/FormMemberFamily";

import FamilyMember from "@/models/FamilyMember";
import Student from "@/models/Student";
import Inscricao from "@/models/Inscricao";

import validateTime from "@/utils/validateTime";

const MEIOS_TRANSPORTE = [
  { text: "Escolha uma opção", value: null },
  { text: "Não possui", value: "NAO_POSSUI" },
  { text: "Carro", value: "CARRO" },
  { text: "Moto", value: "MOTO" }
];

export default {
  name: "novo-cadastro",
  components: {
    CPTInput,
    CPTSelect,
    CPTAutocomplete,
    CPTBtn,
    CPTSubtitle,
    CPTFormMemberFamily
  },

  mounted() {
    this.getStates();
  },

  data: () => ({
    MEIOS_TRANSPORTE,
    enrollment: null,
    loading: false,
    saving: false,
    dialog: false,

    isProcessoJudicial: false,
    processoJudicial: null,
    vulnerabilidadeSocial: false,
    transporteProprio: null,
    inscricao: null,

    student: null,
    state: null,
    cities: [],
    father: new FamilyMember(),
    mother: new FamilyMember(),
    newFamilyMember: null,
    members: []
  }),

  computed: {
    states() {
      return this.$store.state.address.states;
    },

    isValidEnrollment() {
      return this.enrollment?.toString()?.length === 11;
    },
    family() {
      let family = [];

      !this.father.isEmpty() && family.push(this.father);

      this.mother instanceof FamilyMember &&
        !this.mother.isEmpty() &&
        family.push(this.mother);

      family.push(...this.members);

      this.newFamilyMember instanceof FamilyMember &&
        !this.newFamilyMember.isEmpty() &&
        family.push(this.newFamilyMember);

      return family.filter(member => member.nome && member.kinship);
    }
  },

  methods: {
    addFamilyMember() {
      this.newFamilyMember && this.members.push(this.newFamilyMember);

      this.newFamilyMember = new FamilyMember();

      this.$refs.form.resetValidation();
    },
    criarInscricao(inscricao) {
      this.saving = true;

      this.$http
        .post("inscricao", inscricao)
        .then(inscricao => {
          this.$router.push(`/protocolo/${inscricao.id}`);
        })
        .catch(error => {
          this.showMessage(error, "error");
          this.saving = false;
        });
    },
    async getCities(clearStudentCity) {
      if (clearStudentCity) {
        this.student.endereco.cidade = null;
        this.$refs.form.resetValidation();
      }

      if (!this.state) return;

      this.cities = await this.$http.get(`cidade?estado_id=${this.state.id}`);
    },
    getStates() {
      if (!this.states) this.$store.dispatch("address/getStates");
    },
    getStudent(codigo) {
      this.loading = true;
      this.$http
        .get("matricula", { params: { codigo } })
        .then(student => {
          this.student = new Student(student);

          this.getStates();
          this.state = this.student.endereco.cidade.estado;

          this.getCities();
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.showMessage(error, "error");
        });
    },
    handleRendaPerCaptaZerada(inscricao) {
      this.inscricao = inscricao;

      this.dialog = true;
    },
    onInputEnrollment() {
      this.student = null;
      this.mother?.clear();
      this.father?.clear();
      this.newFamilyMember?.clear();
      this.members = [];
    },
    onSubmit() {
      if (!this.$refs.form.validate())
        return this.showMessage(
          "Verifique as informações inseridas e tente novamente",
          "error"
        );

      if (!this.family.length)
        return this.showMessage(
          "O grupo familiar deve possuir ao menos um membro além do aluno",
          "error"
        );

      const family = this.family.map(member => ({
        ...member,
        income: Number(member.income?.replace(",", ".")) || 0,
        endereco: member.endereco.isEmpty() ? null : member.endereco
      }));

      const inscricao = new Inscricao(
        this.student.matricula.id,
        this.student.endereco,
        family,
        this.transporteProprio,
        this.vulnerabilidadeSocial,
        this.processoJudicial
      );

      if (!this.rendaPerCapta())
        return this.handleRendaPerCaptaZerada(inscricao);

      this.criarInscricao(inscricao);
    },
    rendaPerCapta() {
      const rendaPerCapta =
        this.family.reduce(
          (renda, member) => (renda += this.stringToCash(member.income)),
          0
        ) /
        (this.family.length + 1);

      return rendaPerCapta;
    },
    stringToCash(string) {
      if (typeof string === "number") return string;

      return string ? Number(string.replace(",", ".")) : 0;
    },
    validateTime
  }
};
</script>
