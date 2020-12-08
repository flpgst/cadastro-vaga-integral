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
        :headers="[
          { sortable: false, text: 'Posição' },
          { sortable: false, text: 'Protocolo' },
          { sortable: false, text: 'Matrícula' },
          { sortable: false, text: 'Aluno' },
          { sortable: false, text: 'Deferido' }
        ]"
        :items="handleInscricoes"
      >
        <template v-slot:item="{ item: inscricao, index }">
          <tr
            id="cvi-table-row"
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
              <v-col cols="auto" class="pa-0">
                <v-checkbox
                  v-model="inscricao.deferido"
                  @click="event => event.stopPropagation()"
                />
              </v-col>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>

    <v-dialog v-if="inscricaoVisualizando" v-model="dialog" width="750">
      <v-card color="grey lighten-5">
        <v-card-title
          class="headline primary white--text d-flex flex-column align-start"
        >
          <span v-text="inscricaoVisualizando.matricula.pessoa.nome" />
          <span v-text="inscricaoVisualizando.protocolo" />
        </v-card-title>

        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="auto" class="d-flex pa-0">
              <CPTInput
                v-model="inscricaoVisualizando.posicao"
                :disabled="!inscricaoVisualizando.editing"
                :clearable="false"
                label="Posição"
              />
            </v-col>

            <v-col v-if="inscricaoVisualizando.editing" cols="auto">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-text="'mdi-close'"
                    color="red"
                    v-on="on"
                    @click="
                      (inscricaoVisualizando.posicao =
                        inscricaoOriginal.posicao),
                        (inscricaoVisualizando.editing = !inscricaoVisualizando.editing)
                    "
                  />
                </template>
                Cancelar
              </v-tooltip>
            </v-col>
            <v-col cols="auto">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    v-text="
                      inscricaoVisualizando.editing
                        ? 'mdi-content-save'
                        : 'mdi-pencil'
                    "
                    color="primary"
                    @click="onSaveInscricao"
                  />
                </template>
                {{ inscricaoVisualizando.editing ? "Salvar" : "Editar" }}
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="d-flex justify-end py-3">
          <CPTBtn label="Cancelar" @click="dialog = false" />
          <CPTBtn label="Salvar" @click="dialog = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import CPTBtn from "@/components/Btn";
import CPTInput from "@/components/Input";

export default {
  name: "lista-cadastro",

  components: {
    CPTBtn,
    CPTInput
  },

  mounted() {
    this.getInscricoes();
  },

  data: () => ({
    protocol: null,
    dialog: false,
    inscricaoVisualizando: null,
    inscricaoOriginal: null,
    inscricoes: []
  }),

  methods: {
    async getInscricoes() {
      const { data: inscricoes } = await this.$http
        .get("inscricao ")
        .catch(error => this.showMessage(error, "error"));

      this.inscricoes = inscricoes;
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
      this.inscricaoVisualizando.editing = !this.inscricaoVisualizando.editing;
    }
  },

  computed: {
    handleInscricoes() {
      return this.protocol
        ? this.inscricoes.filter(inscricao =>
            inscricao.protocolo?.includes(this.protocol)
          )
        : this.inscricoes;
    }
  }
};
</script>
