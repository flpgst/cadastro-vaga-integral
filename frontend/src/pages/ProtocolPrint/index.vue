<template>
  <v-row class="px-12" v-if="inscricao">
    <template v-for="protocolo in 2">
      <v-col
        class="pa-0 d-flex flex-wrap"
        cols="12"
        :key="`${protocolo}_protocolo`"
      >
        <v-col cols="12">
          Protocolo:
          <span class="font-weight-medium">{{ inscricao.protocolo }}</span>
        </v-col>

        <v-col cols="12" class="text-justify">
          Declaro que estou de acordo com todos os dados inseridos no
          requerimento para o período Integral. Na falta de algum documento
          solicitado, implicará na desclassificação automática para a vaga
          pretendida.
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
          Data:
          {{ format(parseISO(inscricao.data_cadastro), "dd/MM/yyyy HH:mm") }}
        </v-col>

        <v-col
          v-if="protocolo === 1"
          cols="12"
          class="d-flex flex-wrap align-center pa-0"
        >
          <v-col cols="auto">
            <v-icon>
              mdi-content-cut
            </v-icon>
          </v-col>

          <v-col>
            <v-divider />
          </v-col>
        </v-col>
      </v-col>
    </template>
    <v-fab-transition style="border: solid 1px black">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            id="cvi-print-btn"
            v-on="on"
            class="mr-8 mb-8"
            @click="print"
            color="primary"
            fab
            large
            dark
            bottom
            fixed
            right
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </template>
        Imprimir Protocolo
      </v-tooltip>
    </v-fab-transition>
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
      this.inscricao = await this.$http
        .get(`inscricao/${this.id}`)
        .error(error => this.showMessage(error, "error"));

      if (!this.inscricao) return;

      setTimeout(this.print, 100);
    },
    format,
    parseISO,
    print() {
      const appbar = document.querySelector("#app-bar");
      const printBtn = document.querySelector("#cvi-print-btn");

      window.addEventListener("beforeprint", () => {
        appbar.style.display = "none";
        printBtn.style.display = "none";
      });

      window.addEventListener("afterprint", () => {
        appbar.style.display = "inline";
        printBtn.style.display = "inline";
      });

      window.print();
    }
  }
};
</script>
