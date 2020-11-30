<template>
  <v-row class="ma-0">
    <v-col v-if="removeButton" cols="12" class="d-flex justify-end">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon color="error" :disabled="disableRemoveButton">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <span>
          Remover Membro
        </span>
      </v-tooltip>
    </v-col>
    <v-col cols="6">
      <CPTSelect
        v-model="member.kinship"
        label="Grau de Parentesco*"
        :items="kinshipDegrees"
        item-text="nome"
        return-object
        :required="!!(member.nome || member.workplace.name)"
      />
    </v-col>
    <v-col cols="6">
      <CPTInput
        v-model="member.nome"
        label="Nome*"
        :required="!!(member.kinship || member.workplace.name)"
      />
    </v-col>

    <v-col cols="4">
      <CPTInput v-model="member.workplace.name" label="Local de Trabalho" />
    </v-col>
    <v-col cols="4">
      <CPTInput
        v-model="member.workplace.phone"
        label="Telefone da empresa"
        :validator="[
          t => !t || t.length === 15 || t.length === 14 || 'Telefone inválido'
        ]"
        validate-on-blur
        :disabled="!member.workplace.name"
        v-maska="['(##) #####-####', '(##) ####-####']"
      />
    </v-col>
    <v-col cols="2">
      <CPTInput
        v-model="member.workplace.start"
        label="Entrada"
        v-maska="'##:##'"
        :disabled="!member.workplace.name"
        :validator="[time => validateTime(time) || 'Horário inválida']"
      />
    </v-col>
    <v-col cols="2">
      <CPTInput
        v-model="member.workplace.end"
        :disabled="!member.workplace.name"
        label="Saída"
        v-maska="'##:##'"
        :validator="[time => validateTime(time) || 'Horário inválida']"
      />
    </v-col>

    <v-col cols="12" class="d-flex">
      <v-col cols="auto" class="pa-0">
        <v-switch
          v-model="showAddressForm"
          label="Membro possui endereço diferente do aluno"
          @click="member.endereco.clear()"
        />
      </v-col>
    </v-col>

    <template v-if="showAddressForm">
      <v-col cols="6">
        <CPTInput v-model="member.endereco.rua" label="Rua*" required />
      </v-col>
      <v-col cols="6">
        <CPTInput v-model="member.endereco.numero" label="Número" />
      </v-col>
      <v-col cols="6">
        <CPTInput v-model="member.endereco.bairro" label="Bairro*" required />
      </v-col>
      <v-col cols="6">
        <CPTInput
          v-model="member.endereco.cidade.nome"
          label="Cidade*"
          required
        />
      </v-col>
      <v-col cols="12">
        <CPTInput v-model="member.endereco.complemento" label="Complemento" />
      </v-col>
    </template>
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTSelect from "@/components/Select";
// import CPTBtn from "@/components/Btn";

import validateTime from "@/utils/validateTime";

import FamilyMember from "@/models/FamilyMember.js";

export default {
  name: "form-member-family",
  components: {
    CPTInput,
    CPTSelect
    // CPTBtn
  },
  props: {
    disableRemoveButton: {
      type: Boolean,
      default: false
    },
    removeButton: {
      type: Boolean,
      default: false
    },
    value: {
      type: FamilyMember,
      default: new FamilyMember()
    }
  },
  mounted() {
    this.showAddressForm = !this.member.endereco.isEmpty();
    this.getKinshipDegrees();
  },
  data: () => ({
    showAddressForm: false,
    kinshipDegrees: []
  }),
  computed: {
    member: {
      get() {
        return this.value;
      },
      set(member) {
        this.$emit("input", member);
      }
    }
  },
  methods: {
    getKinshipDegrees() {
      this.$http
        .get("parentesco")
        .then(({ data }) => (this.kinshipDegrees = data));
    },
    validateTime
  }
};
</script>
