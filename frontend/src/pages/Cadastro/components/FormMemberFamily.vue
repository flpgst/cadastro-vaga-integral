<template>
  <v-row class="ma-0">
    <v-col cols="6">
      <CPTSelect
        v-model="member.kinship"
        label="Grau de parentesco*"
        :items="kinshipDegrees"
        item-text="nome"
        return-object
        :required="!member.isEmpty()"
        :validator="[
          v => member.isEmpty() || !isEmpty(v) || 'Este campo é obrigatório'
        ]"
      />
    </v-col>
    <v-col cols="6">
      <CPTInput
        v-model="member.nome"
        label="Nome completo*"
        :required="!member.isEmpty()"
      />
    </v-col>

    <v-col cols="4">
      <CPTSelect
        v-model="documentType"
        label="Documento"
        :items="['CPF', 'Certidão de Nascimento']"
        @input="member.cpf = member.certidaoNascimento = null"
      />
    </v-col>

    <v-col cols="4">
      <CPTInput
        v-if="documentType === 'CPF'"
        v-model="member.cpf"
        label="CPF*"
        :required="!member.isEmpty()"
        key="cpf"
        validate-on-blur
        :validator="[
          cpf => member.isEmpty() || isValidCPF(cpf) || 'CPF inválido'
        ]"
        v-maska="'###.###.###-##'"
      />
      <CPTInput
        v-else
        v-model="member.certidaoNascimento"
        label="Certidão de nascimento*"
        :required="!member.isEmpty()"
        key="certidao_nascimento"
        validate-on-blur
        counter="32"
        :validator="[
          certidao =>
            member.isEmpty() ||
            !certidao ||
            certidao.length === 32 ||
            'Certidão de nascimento inválida'
        ]"
        v-maska="'################################'"
      />
    </v-col>

    <v-col cols="4">
      <CPTInput v-model="member.pisPasep" label="PIS/PASEP" counter />
    </v-col>

    <v-col cols="3">
      <CPTInput v-model="member.workplace.name" label="Local de trabalho" />
    </v-col>
    <v-col cols="3">
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
    <v-col cols="3">
      <CPTInput
        v-model="member.workplace.start"
        label="Horário de entrada"
        v-maska="'##:##'"
        :disabled="!member.workplace.name"
        :validator="[time => validateTime(time) || 'Horário inválida']"
      />
    </v-col>
    <v-col cols="3">
      <CPTInput
        v-model="member.workplace.end"
        :disabled="!member.workplace.name"
        label="Horário de saída"
        v-maska="'##:##'"
        :validator="[time => validateTime(time) || 'Horário inválida']"
      />
    </v-col>

    <v-col :cols="removeButton ? 6 : 12" class="d-flex">
      <v-col cols="auto" class="pa-0">
        <v-switch
          v-model="showAddressForm"
          label="Membro possui endereço diferente do aluno"
          @click="
            member.endereco.clear(), showAddressForm && setDefaultAddress()
          "
        />
      </v-col>
    </v-col>

    <v-col v-if="removeButton" cols="6" class="d-flex justify-end">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon color="red" @click="onClickRemoveButton">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>
          Excluir Membro
        </span>
      </v-tooltip>
    </v-col>

    <template v-if="showAddressForm">
      <v-col cols="2">
        <CPTInput
          v-model="member.endereco.cep"
          label="CEP*"
          required
          v-maska="'#####-###'"
        />
      </v-col>
      <v-col cols="4">
        <CPTInput v-model="member.endereco.rua" label="Rua*" required />
      </v-col>
      <v-col cols="2">
        <CPTInput v-model="member.endereco.numero" label="Número" />
      </v-col>
      <v-col cols="4">
        <CPTInput v-model="member.endereco.bairro" label="Bairro*" required />
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
          v-model="member.endereco.cidade"
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
        <CPTInput v-model="member.endereco.complemento" label="Complemento" />
      </v-col>
    </template>

    <v-dialog v-model="dialogExclusao" width="750">
      <v-card color="grey lighten-5">
        <v-card-title
          class="headline primary white--text"
          v-text="
            `Dejesa excluir ${member.nome || 'esse membro'} do grupo familiar?`
          "
        />

        <v-card-text class="pt-3">
          Essa ação não poderá ser desfeita
        </v-card-text>

        <v-divider />

        <v-card-actions class="d-flex justify-end py-3">
          <CPTBtn label="Não" @click="dialogExclusao = false" />
          <CPTBtn
            label="Sim"
            @click="$emit('remove'), (dialogExclusao = false)"
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

import CPTBtn from "@/components/Btn";

import validateTime from "@/utils/validateTime";

import FamilyMember from "@/models/FamilyMember.js";

import { isEmpty } from "lodash";
import { cpf } from "cpf-cnpj-validator";

export default {
  name: "form-member-family",
  components: {
    CPTInput,
    CPTSelect,
    CPTAutocomplete,
    CPTBtn
  },
  props: {
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

    this.documentType =
      (this.member.cpf && "CPF") ||
      (this.member.certidaoNascimento && "Certidão de Nascimento") ||
      "CPF";

    this.getKinshipDegrees();
  },
  data: () => ({
    dialogExclusao: false,
    kinshipDegrees: [],
    showAddressForm: false,
    documentType: null,

    cities: [],
    state: null
  }),
  computed: {
    member: {
      get() {
        return this.value;
      },
      set(member) {
        this.$emit("input", member);
      }
    },
    states() {
      return this.$store.state.address.states;
    }
  },
  methods: {
    async getCities(clearMemberCity) {
      if (clearMemberCity) this.member.endereco.cidade = null;

      if (!this.state) return;

      this.cities = await this.$http.get(`cidade?estado_id=${this.state.id}`);
    },
    async getKinshipDegrees() {
      this.kinshipDegrees = await this.$http
        .get("parentesco")
        .catch(error => this.showMessage(error, "error"));
    },
    getStates() {
      if (!this.states) this.$store.dispatch("address/getStates");
    },
    isEmpty,
    isValidCPF: cpf.isValid,
    onClickRemoveButton() {
      if (this.member.isEmpty()) return this.$emit("remove");

      this.dialogExclusao = true;
    },
    setDefaultAddress() {
      this.getStates();
      this.state = this.$store.state.address.estadoDefault;

      this.getCities();
      this.member.endereco.cidade = this.$store.state.address.cidadeDefault;
    },
    validateTime
  },
  watch: {
    member() {
      this.showAddressForm = !this.member.endereco.isEmpty();
      this.documentType =
        (this.member.cpf && "CPF") ||
        (this.member.certidaoNascimento && "Certidão de Nascimento") ||
        "CPF";
    }
  }
};
</script>
