<template>
  <v-row class="px-12" v-if="inscricao">
    <v-col cols="12">
      Protocolo:
      <span class="font-weight-medium">{{ inscricao.protocolo }}</span>
    </v-col>

    <v-col cols="12" class="text-justify">
      Declaro que estou de acordo com todos os dados inseridos no requerimento
      para o período Integral. Na falta de algum documento solicitado, implicará
      na desclassificação automática para a vaga pretendida.
    </v-col>

    <v-col cols="12" class="my-5">
      Unidade de ensino: {{ inscricao.matricula.unidadeEnsino.pessoa.nome }}
    </v-col>

    <v-col cols="6" class="my-5">
      <v-col cols="12" class="text-center">
        ____________________________________
      </v-col>
      <v-col cols="12" class="text-center">
        Assinatura do responsável
      </v-col>
    </v-col>
    <v-col cols="6" class="my-5">
      <v-col cols="12" class="text-center">
        ____________________________________
      </v-col>
      <v-col cols="12" class="text-center">
        Assinatura do diretor/secretário
      </v-col>
    </v-col>

    <v-col cols="12" class="text-end">
      Data: {{ format(parseISO(inscricao.data_cadastro), "dd/MM/yyyy HH:mm") }}
    </v-col>
  </v-row>
</template>

<script>
import { format, parseISO } from "date-fns";

export default {
  name: "protocol-print",
  props: {
    id: [Number, String]
  },
  data: () => ({
    inscricao: null
  }),
  mounted() {
    this.getInscricao();
  },
  methods: {
    async getInscricao() {
      const { data } = await this.$http.get(`inscricao/${this.id}`);

      this.inscricao = data;

      setTimeout(this.print, 100);
    },
    format,
    parseISO,
    print() {
      const appbar = document.querySelector("#app-bar");

      window.addEventListener("beforeprint", () => {
        appbar.style.display = "none";
      });

      window.addEventListener("afterprint", () => {
        appbar.style.display = "inline";
      });

      window.print();
    }
  }
};
</script>
