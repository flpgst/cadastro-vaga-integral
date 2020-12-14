<template>
  <v-row>
    <v-col cols="12" v-text="$route.name" class="grey--text text-h2" />

    <v-col cols="12">
      <CPTInput
        v-model="protocol"
        v-maska="'###########'"
        label="Protocolo"
        counter="11"
      />
    </v-col>

    <v-col cols="12">
      <v-data-table
        hide-default-footer
        :search="protocol"
        item-key="protocolo"
        no-results-text="Nenhuma inscrição encontrada com esse protocolo"
        :headers="[
          { sortable: false, text: 'Posição' },
          { sortable: false, text: 'Protocolo', value: 'protocolo' },
          { sortable: false, text: 'Matrícula' },
          { sortable: false, text: 'Aluno' },
          { sortable: false, text: 'Deferido' }
        ]"
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
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";
import DialogInscricao from "@/pages/Cadastro/Lista/components/DialogInscricao";

export default {
  name: "lista-cadastros",

  components: {
    CPTInput,
    DialogInscricao
  },

  mounted() {
    this.getInscricoes();
  },

  data: () => ({
    protocol: null,
    dialog: false,
    inscricaoVisualizando: null,
    inscricoes: []
  }),

  methods: {
    async getInscricoes() {
      this.inscricoes = await this.$http
        .get("inscricao")
        .catch(error => this.showMessage(error, "error"));
    },
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
    }
  }
};
</script>

<style>
.cvi-table-row {
  cursor: pointer;
}
</style>
