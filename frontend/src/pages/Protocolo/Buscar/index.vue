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
          @keydown.enter="isValidEnrollment && getInscricao()"
          type="number"
        />
      </v-col>
      <v-col cols="12 d-flex justify-end">
        <CPTBtn
          label="Imprimir"
          icon="mdi-printer"
          :disabled="!isValidEnrollment"
          @click="getInscricao()"
        />
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTBtn from "@/components/Btn";

export default {
  name: "search-protocol",
  components: {
    CPTInput,
    CPTBtn
  },
  data: () => ({
    enrollment: null
  }),
  computed: {
    isValidEnrollment() {
      return this.enrollment?.length === 11;
    }
  },
  methods: {
    getInscricao() {
      this.$http
        .get(`matricula/${this.enrollment}/inscricao`)
        .then(inscricao => {
          if (!inscricao)
            return this.showMessage(
              "Não existe inscrição para essa matrícula",
              "error"
            );

          this.showMessage();

          this.$router.push(`/protocolo/${inscricao.id}`);
        })
        .catch(error => this.showMessage(error, "error"));
    }
  }
};
</script>
