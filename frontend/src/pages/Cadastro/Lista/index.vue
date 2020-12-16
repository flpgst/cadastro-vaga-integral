<template>
  <v-row>
    <v-col cols="12" v-text="$route.name" class="grey--text text-h2" />

    <v-col cols="4">
      <CPTInput
        v-model="protocolo"
        v-maska="'###########'"
        label="Protocolo"
        counter="11"
      />
    </v-col>
    <v-col cols="4">
      <CPTInput
        v-model="matricula"
        v-maska="'###########'"
        label="Matrícula"
        counter="11"
      />
    </v-col>

    <v-col cols="4">
      <CPTInput v-model="aluno" label="Aluno" />
    </v-col>

    <v-col cols="12">
      <v-data-table
        disable-sort
        :items-per-page="50"
        no-results-text="Nenhuma inscrição encontrada"
        :headers="headers"
        :items="inscricoes"
        :footer-props="{
          'items-per-page-options': [10, 25, 50]
        }"
      >
        <template v-slot:item="{ item: inscricao }">
          <tr
            class="cvi-table-row"
            :key="inscricao.id"
            @click="onClickInscricao(inscricao)"
          >
            <td>
              {{ inscricao.posicao }}
            </td>

            <td>
              {{ inscricao.protocolo }}
            </td>

            <td>
              {{ inscricao.matricula.codigo }}
            </td>

            <td>
              {{ inscricao.matricula.pessoa.nome }}
            </td>

            <td class="d-flex align-center justify-start">
              <v-icon
                v-text="inscricao.deferido ? 'mdi-check' : 'mdi-close'"
                :color="inscricao.deferido ? 'green' : 'red'"
              />
            </td>

            <td
              v-if="isAdmin()"
              @click="showDialogExclusao(inscricao), $event.stopPropagation()"
            >
              <v-icon
                color="red"
                @click="showDialogExclusao(inscricao), $event.stopPropagation()"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>

    <DialogInscricao
      v-if="dialog"
      v-model="inscricaoVisualizando"
      @save="onSaveInscricao"
      @close="dialog = false"
    />

    <v-dialog v-if="inscricaoExcluir" v-model="dialogExclusao" width="750">
      <v-card>
        <v-card-title class="primary title white--text">
          Excluir inscrição? Esta ação não poderá ser desfeita.
        </v-card-title>

        <v-card-text class="py-3">
          <v-row>
            <v-col cols="12">
              Protocolo: {{ inscricaoExcluir.protocolo }}
            </v-col>
            <v-col cols="12">
              Aluno:
              {{ inscricaoExcluir.matricula.pessoa.nome }}
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="d-flex justify-end">
          <CPTBtn
            label="Não"
            @click="(inscricaoExcluir = null), (dialogExclusao = false)"
          />
          <CPTBtn label="Sim" @click="excluirInscricao(inscricaoExcluir)" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CPTBtn from "@/components/Btn";
import CPTInput from "@/components/Input";
import DialogInscricao from "@/pages/Cadastro/Lista/components/DialogInscricao";

import { isAdmin } from "@/plugins/security";
import { first } from "lodash";

export default {
  name: "lista-cadastros",

  components: {
    CPTBtn,
    CPTInput,
    DialogInscricao
  },

  mounted() {
    this.getInscricoes();
  },

  data: () => ({
    protocolo: "",
    matricula: "",
    aluno: "",

    dialog: false,
    dialogExclusao: true,
    inscricaoVisualizando: null,
    inscricaoExcluir: null,
    inscricoes: []
  }),

  computed: {
    headers() {
      const headers = [
        { text: "Posição" },
        {
          text: "Protocolo",
          value: "protocolo",
          filter: protocolo =>
            !this.protocolo || protocolo.includes(this.protocolo)
        },
        {
          text: "Matrícula",
          value: "matricula.codigo",
          filter: matricula =>
            !this.matricula || matricula.includes(this.matricula)
        },
        {
          text: "Aluno",
          value: "matricula.pessoa.nome",
          filter: aluno => !this.aluno || aluno.includes(this.aluno)
        },
        { text: "Deferido" }
      ];

      return this.isAdmin()
        ? [...headers, { text: "Cancelar Inscrição" }]
        : headers;
    }
  },

  methods: {
    excluirInscricao({ id }) {
      this.$http
        .delete(`inscricao/${id}`)
        .then(({ message }) => {
          const inscricoes = this.inscricoes.filter(
            inscricao => inscricao.id !== id
          );

          this.inscricoes = first(inscricoes).posicao
            ? inscricoes
            : inscricoes.map((inscricao, index) => ({
                ...inscricao,
                posicao: index + 1
              }));

          this.dialogExclusao = false;
          this.inscricaoExcluir = false;

          this.showMessage(message, "success");
        })
        .catch(error => this.showMessage(error, "error"));
    },
    getInscricoes() {
      this.$http
        .get("inscricao")
        .then(inscricoes => {
          this.inscricoes = first(inscricoes).posicao
            ? inscricoes
            : inscricoes.map((inscricao, index) => ({
                ...inscricao,
                posicao: index + 1
              }));
        })
        .catch(error => this.showMessage(error, "error"));
    },
    isAdmin,
    onClickInscricao(inscricao) {
      this.inscricaoOriginal = {
        ...inscricao
      };

      this.inscricaoVisualizando = {
        ...inscricao,
        editing: false
      };

      this.dialog = true;
    },
    onSaveInscricao() {
      this.$http
        .put(
          `inscricao/${this.inscricaoVisualizando.id}`,
          this.inscricaoVisualizando
        )
        .then(() => {
          this.showMessage("Inscrição atualizada com sucesso", "success");
        })
        .catch(error => this.showMessage(error, "error"));
    },
    showDialogExclusao(inscricao) {
      this.inscricaoExcluir = inscricao;
      this.dialogExclusao = true;
    }
  }
};
</script>

<style>
.cvi-table-row {
  cursor: pointer;
}
</style>
