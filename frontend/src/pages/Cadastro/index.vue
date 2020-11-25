<template>
  <v-row>
    <v-col cols="12" v-text="$route.name" class="grey--text text-h2" />
    <v-col cols="12" class="px-0">
      <v-col cols="12">
        <CPTInput
          v-model="enrollment"
          v-maska="'##########'"
          label="Matrícula*"
          counter="10"
          required
          type="number"
          @input="onInputEnrollment($event)"
        />
      </v-col>
      <v-col cols="12 d-flex justify-end">
        <CPTBtn
          label="Buscar"
          icon="mdi-magnify"
          :disabled="disableSearchButton"
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
        <v-col cols="6">
          <CPTInput v-model="student.nome" label="Nome*" disabled required />
        </v-col>

        <v-col cols="6">
          <CPTInput
            v-model="student.dataNascimento"
            label="Data de Nascimento*"
            disabled
            required
          />
        </v-col>

        <v-col :cols="isProcessoJudicial ? 4 : 6">
          <v-switch
            v-model="student.isVulneravel"
            label="Criança em vulnerabilidade social"
          />
        </v-col>
        <v-col :cols="isProcessoJudicial ? 3 : 6">
          <v-switch
            v-model="isProcessoJudicial"
            @click="student.processoJudicial = null"
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
              v-model="student.endereco.cidade"
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
            <v-col cols="12" :key="`${member.name}_${Math.random() * 10000}`">
              <CPTSubtitle />
            </v-col>

            <CPTFormMemberFamily
              v-model="members[index]"
              :key="`${member.name}_${Math.random() * 10000}`"
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
                    sortable: false,
                    value: 'kinship'
                  },
                  {
                    text: 'Nome',
                    sortable: false,
                    value: 'nome'
                  },
                  {
                    text: 'Renda Mensal (R$)',
                    sortable: false,
                    value: 'income'
                  }
                ]"
                :items="
                  family.map((member, index) => ({
                    ...member,
                    number: index + 1
                  }))
                "
              >
                <template v-slot:item="{ item: member }">
                  <tr>
                    <td>
                      <span class="text-subtitle-1" v-text="member.number" />
                    </td>
                    <td>
                      <span class="text-subtitle-1" v-text="member.kinship" />
                    </td>
                    <td>
                      <span class="text-subtitle-1" v-text="member.nome" />
                    </td>
                    <td>
                      <v-text-field
                        class="text-subtitle-1"
                        v-model="member.income"
                      />
                    </td>
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

    <CPTSnackbar />
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTSelect from "@/components/Select";
import CPTSubtitle from "@/components/FormSubtitle";
import CPTBtn from "@/components/Btn";
import CPTFormMemberFamily from "@/pages/Cadastro/components/FormMemberFamily";
import CPTSnackbar from "@/components/Snackbar";

import FamilyMember from "@/models/FamilyMember.js";
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
    CPTFormMemberFamily,
    CPTSnackbar
  },
  data: () => ({
    MEIOS_TRANSPORTE,
    enrollment: null,
    isProcessoJudicial: false,
    processoJudicial: null,
    meioTransporteProprio: null,
    student: null,
    incomeSlot: "income",
    father: new FamilyMember(),
    mother: new FamilyMember(),
    newFamilyMember: null,
    members: []
  }),

  computed: {
    disableSearchButton() {
      return this.enrollment?.toString()?.length !== 10;
    },
    family() {
      let family = [...this.members];

      !this.father.isEmpty() && family.push(this.father);
      !this.mother.isEmpty() && family.push(this.mother);

      this.newFamilyMember instanceof FamilyMember &&
        !this.newFamilyMember.isEmpty() &&
        family.push(this.newFamilyMember);

      return family
        .map(member => (member.nome && member.kinship ? member : null))
        .filter(member => !!member);
    }
  },

  mounted() {
    this.getStudent();
  },

  methods: {
    addFamilyMember() {
      this.newFamilyMember && this.members.push(this.newFamilyMember);

      this.newFamilyMember = new FamilyMember();

      this.$refs.form.resetValidation();
    },
    getStudent(/*enrollment*/) {
      setTimeout(() => {
        this.student = new Student();
      }, 1);
    },
    onInputEnrollment(enrollment) {
      this.student = null;

      if (enrollment?.toString()?.length !== 10) return;

      this.getStudent(enrollment);
    },
    onSubmit() {
      if (!this.$refs.form.validate())
        return this.showMessage("Verifique as informações", "error");

      // if (!this.members.length)
      //   return this.showMessage("Verifique as informações", "error");

      console.log("deu bom");

      // this.newFamilyMember instanceof FamilyMember &&
      //   this.newFamilyMember.isEmpty() &&
      //   this.members.push(this.newFamilyMember);
    },
    validateTime
  }
};
</script>
