<template>
  <v-row>
    <v-col
      :cols="isAdmin() ? 10 : 12"
      v-text="$route.name"
      class="grey--text text-h2"
    />
    <v-col v-if="isAdmin()" cols="2" class="text-end">
      <v-tooltip>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            depressed
            small
            :loading="atualizandoInscricoes"
            v-on="on"
            color="primary"
            @click="ordenarInscricoes"
          >
            <v-icon>
              mdi-sort-numeric-ascending
            </v-icon>
          </v-btn>
        </template>
        Ordenar Inscrições
      </v-tooltip>
    </v-col>
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

    <v-col v-if="!inscricoes.length || !showList" cols="12">
      <v-skeleton-loader type="list-item@15" />
    </v-col>

    <v-col cols="12" v-else>
      <v-data-table
        :footer-props="{
          'items-per-page-options': [10, 25, 50]
        }"
        :headers="headers"
        :items-per-page="50"
        :items="inscricoes"
        :page="tablePage"
        disable-sort
        no-results-text="Nenhuma inscrição encontrada"
        @pagination="({ page }) => (tablePage = page)"
      >
        <template v-slot:item="{ item: inscricao }">
          <tr
            class="cvi-table-row"
            :key="inscricao.id"
            @click="onClickInscricao(inscricao)"
          >
            <td>
              <span class="d-flex align-center justify-center">
                {{ inscricao.posicao }}
              </span>
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

            <td>
              <span
                class="ma-0 d-flex justify-center"
                v-text="inscricao.vulnerabilidade_social ? 'SIM' : 'NÃO'"
              />
            </td>

            <td>
              <span
                class="ma-0 d-flex justify-center"
                v-text="inscricao.processo_judicial ? 'SIM' : 'NÃO'"
              />
            </td>

            <td class="d-flex align-center justify-center">
              <v-icon
                v-text="getStatusConfig(inscricao.status).icon"
                :color="getStatusConfig(inscricao.status).color"
              />
            </td>

            <td
              v-if="isAdmin()"
              @click="showDialogExclusao(inscricao), $event.stopPropagation()"
            >
              <span class="d-flex align-center justify-center">
                <v-icon
                  color="red"
                  @click="
                    showDialogExclusao(inscricao), $event.stopPropagation()
                  "
                >
                  mdi-delete
                </v-icon>
              </span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>

    <DialogInscricao
      v-if="dialog"
      v-model="inscricaoVisualizando"
      @save="
        (parametro, callback) =>
          parametro === 'posicao'
            ? alterarPosicao(callback)
            : atualizarInscricao(callback)
      "
      @close="dialog = false"
      @update="atualizarInscricao"
    />

    <v-dialog v-if="inscricaoExcluir" v-model="dialogExclusao" width="750">
      <v-card>
        <v-card-title class="primary text-h6 white--text">
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
    aluno: "",
    atualizandoInscricoes: false,
    dialog: false,
    dialogExclusao: true,
    inscricaoExcluir: null,
    inscricaoVisualizando: null,
    inscricoes: [],
    matricula: "",
    protocolo: "",
    showList: true,
    tablePage: 1
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
        { text: "Vulnerabilidade Social" },
        { text: "Processo Judicial" },
        { text: "Status" }
      ];

      return this.isAdmin()
        ? [...headers, { text: "Cancelar Inscrição" }]
        : headers;
    }
  },

  methods: {
    isAdmin,

    atualizarInscricao(callback) {
      const {
        id,
        processo_judicial,
        status,
        transporte_proprio,
        vulnerabilidade_social
      } = this.inscricaoVisualizando;

      this.showList = false;

      this.$http
        .put(`/inscricao/${id}`, {
          processo_judicial,
          status,
          transporte_proprio,
          vulnerabilidade_social
        })
        .then(inscricoes => {
          this.inscricoes = inscricoes;
          this.showMessage("Inscrição atualizada com sucesso", "success");
          callback();
          this.showList = true;
        })
        .catch(error => {
          this.showMessage(error, "error");
          this.showList = true;
        });
    },

    excluirInscricao({ id }) {
      this.showList = false;
      this.$http
        .delete(`inscricao/${id}`)
        .then(({ message }) => {
          this.inscricoes = this.inscricoes.filter(
            inscricao => inscricao.id !== id
          );

          this.showList = true;
          this.dialogExclusao = false;
          this.inscricaoExcluir = false;

          this.showMessage(message, "success");
        })
        .catch(error => {
          this.showMessage(error, "error");
          this.showList = true;
        });
    },

    getInscricoes() {
      this.$http
        .get("inscricao")
        .then(inscricoes => {
          this.inscricoes = inscricoes;
        })
        .catch(error => this.showMessage(error, "error"));
    },

    getStatusConfig(status) {
      switch (status) {
        case "DEFERIDO":
          return { color: "green", icon: "mdi-check" };
        case "INDEFERIDO":
          return { color: "red", icon: "mdi-close" };
        case "PENDENTE":
          return {
            icon: "mdi-minus"
          };
        case "DESISTENTE":
          return {
            icon: "mdi-account-off",
            color: "red"
          };
      }
    },

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

    ordenarInscricoes() {
      this.atualizandoInscricoes = true;
      this.showList = false;
      this.$http
        .put("ordenar-inscricoes")
        .then(inscricoes => {
          this.inscricoes = inscricoes;
          this.showMessage("Inscrições ordenadas com sucesso", "success");
          this.atualizandoInscricoes = false;
          this.showList = true;
        })
        .catch(error => {
          this.showMessage(error, "error");
          this.atualizandoInscricoes = false;
          this.showList = true;
        });
    },

    alterarPosicao(callback) {
      const { id, posicao } = this.inscricaoVisualizando;

      this.showList = false;

      this.$http
        .put(`alterar-posicao/${id}`, { posicao })
        .then(inscricoes => {
          this.inscricoes = inscricoes;

          this.showMessage("Posição atualizada com sucesso", "success");
          callback();
          this.showList = true;
        })
        .catch(error => {
          this.showMessage(error, "error");
          this.showList = true;
          callback();
        });
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
