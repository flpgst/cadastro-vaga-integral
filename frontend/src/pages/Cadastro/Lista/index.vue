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
        hide-default-footer
        disable-sort
        no-results-text="Nenhuma inscrição encontrada"
        :headers="headers"
        :items="inscricoes"
      >
        <template v-slot:item="{ item: inscricao, index }">
          <tr
            class="cvi-table-row"
            :key="inscricao.id"
            @click="onClickInscricao(inscricao, index + 1)"
          >
            <td>
              {{ inscricao.posicao || index + 1 }}
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
          this.inscricoes = this.inscricoes.filter(
            inscricao => inscricao.id !== id
          );

          this.dialogExclusao = false;
          this.inscricaoExcluir = false;

          this.showMessage(message, "success");
        })
        .catch(error => this.showMessage(error, "error"));
    },
    async getInscricoes() {
      this.inscricoes = await this.$http
        .get("inscricao")
        .catch(error => this.showMessage(error, "error"));
    },
    isAdmin,
    onClickInscricao(inscricao, index) {
      this.inscricaoOriginal = {
        inscricao,
        posicao: inscricao.posicao || index
      };

      this.inscricaoVisualizando = {
        ...inscricao,
        index,
        editing: false,
        posicao: inscricao.posicao || index
      };

      this.dialog = true;
    },
    onSaveInscricao() {
      const index = this.inscricoes.findIndex(
        inscricao => inscricao.id === this.inscricaoVisualizando.id
      );

      this.inscricoes.splice(index, 1, this.inscricaoVisualizando);

      this.dialog = false;
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
