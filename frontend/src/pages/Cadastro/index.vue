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
          @input="student = null"
          @keydown.enter="isValidEnrollment && getStudent(enrollment)"
          required
          type="number"
        />
      </v-col>
      <v-col cols="12 d-flex justify-end">
        <CPTBtn
          label="Buscar"
          icon="mdi-magnify"
          :disabled="!isValidEnrollment"
          @click="getStudent(enrollment)"
        />
      </v-col>
      <v-form
        v-if="student"
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

        <v-col :cols="isProcessoJudicial ? 4 : 6">
          <v-switch
            v-model="vulnerabilidadeSocial"
            label="Criança em vulnerabilidade social"
          />
        </v-col>
        <v-col :cols="isProcessoJudicial ? 3 : 6">
          <v-switch
            v-model="isProcessoJudicial"
            @click="processoJudicial = null"
            label="Cadastro por processo judicial"
          />
        </v-col>

        <v-col v-if="isProcessoJudicial" cols="5">
          <CPTInput
            v-model="processoJudicial"
            label="Número do processo*"
            required
          />
        </v-col>

        <v-col cols="12">
          <CPTSelect
            v-model="meioTransporteProprio"
            :items="MEIOS_TRANSPORTE"
            item-text="text"
            item-value="value"
            label="Família possui meio de transporte próprio*"
          />
        </v-col>

        <v-col cols="12" class="d-flex flex-wrap">
          <v-col cols="12">
            <CPTSubtitle label="Endereço" />
          </v-col>
          <v-col cols="6">
            <CPTInput v-model="student.endereco.rua" label="Rua*" required />
          </v-col>
          <v-col cols="6">
            <CPTInput v-model="student.endereco.numero" label="Número" />
          </v-col>
          <v-col cols="6">
            <CPTInput
              v-model="student.endereco.bairro"
              label="Bairro*"
              required
            />
          </v-col>
          <v-col cols="6">
            <CPTInput
              v-model="student.endereco.cidade.nome"
              label="Cidade*"
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
            v-model="mother"
            removeButton
            :disableRemoveButton="mother.isEmpty()"
          />

          <template v-for="(member, index) in members">
            <v-col cols="12" :key="`${member.name}_${member.kinship}_divider`">
              <CPTSubtitle />
            </v-col>

            <CPTFormMemberFamily
              v-model="members[index]"
              :key="`${member.name}_${member.kinship}`"
            />
          </template>

          <template v-if="newFamilyMember">
            <v-col cols="12">
              <CPTSubtitle />
            </v-col>
            <CPTFormMemberFamily v-model="newFamilyMember" />
          </template>

          <v-col class="d-flex justify-center">
            <CPTBtn
              label="Adicionar Membro"
              icon="mdi-plus"
              :disabled="
                father.isEmpty() ||
                  mother.isEmpty() ||
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
                  <tr v-if="index === family.length - 1">
                    <td />
                    <td />

                    <td class="caption font-weight-medium">
                      Renda per capta:
                    </td>
                    <td
                      v-text="`R$ ${rendaPerCapta}`"
                      class="text-subtitle-1"
                    />
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </template>
        </v-col>

        <v-col cols="12 d-flex justify-end">
          <CPTBtn label="Salvar" icon="mdi-content-save" type="submit" />
        </v-col>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTSelect from "@/components/Select";
import CPTSubtitle from "@/components/FormSubtitle";
import CPTBtn from "@/components/Btn";
import CPTFormMemberFamily from "@/pages/Cadastro/components/FormMemberFamily";

import FamilyMember from "@/models/FamilyMember";
import Student from "@/models/Student";

import validateTime from "@/utils/validateTime";

const MEIOS_TRANSPORTE = [
  { text: "Não possui", value: null },
  { text: "Carro", value: "CARRO" },
  { text: "Moto", value: "MOTO" }
];

export default {
  name: "novo-cadastro",
  components: {
    CPTInput,
    CPTSelect,
    CPTBtn,
    CPTSubtitle,
    CPTFormMemberFamily
  },
  data: () => ({
    MEIOS_TRANSPORTE,
    enrollment: null,

    isProcessoJudicial: false,
    processoJudicial: null,
    vulnerabilidadeSocial: false,
    meioTransporteProprio: null,

    student: null,
    father: new FamilyMember(),
    mother: new FamilyMember(),
    newFamilyMember: null,
    members: []
  }),

  computed: {
    isValidEnrollment() {
      return this.enrollment?.toString()?.length === 11;
    },
    family() {
      let family = [...this.members];

      !this.father.isEmpty() && family.push(this.father);
      !this.mother.isEmpty() && family.push(this.mother);

      this.newFamilyMember instanceof FamilyMember &&
        !this.newFamilyMember.isEmpty() &&
        family.push(this.newFamilyMember);

      return family.filter(member => member.nome && member.kinship);
    },
    rendaPerCapta() {
      const rendaPerCapta =
        this.family.reduce(
          (renda, member) => (renda += this.stringToCash(member.income)),
          0
        ) /
        (this.family.length + 1);

      return (
        rendaPerCapta
          ?.toFixed("2")
          ?.toString()
          ?.replace(".", ",") || "0"
      );
    }
  },

  methods: {
    addFamilyMember() {
      this.newFamilyMember && this.members.push(this.newFamilyMember);

      this.newFamilyMember = new FamilyMember();

      this.$refs.form.resetValidation();
    },
    getStudent(codigo) {
      this.$http
        .get("matricula", { params: { codigo } })
        .then(({ data: student }) => {
          this.student = new Student(student);
        })
        .catch(error => {
          console.log(JSON.stringify(error));
          this.showMessage(error, "error");
        });
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
        income: Number(member.income?.replace(",", "."))
      }));

      console.log(family);
    },
    stringToCash(string) {
      if (typeof string === "number") return string;

      return string ? Number(string.replace(",", ".")) : 0;
    },
    validateTime
  }
};
</script>
