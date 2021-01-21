<template>
  <v-dialog @click:outside="$emit('close')" :value="true" width="750">
    <v-toolbar color="primary" dark flat class="cvi-dialog-toolbar">
      <v-toolbar-title class="d-flex flex-column justify-center">
        <span class="title" v-text="inscricao.matricula.pessoa.nome" />

        <span
          class="caption"
          v-text="`Matrícula: ${inscricao.matricula.codigo}`"
        />
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="$emit('close')">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-card color="grey lighten-5">
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            class="title py-5"
            v-text="`Protocolo: ${inscricao.protocolo}`"
          />

          <v-col cols="6" class="pa-0 d-flex">
            <v-col cols="auto" class="d-flex pa-0">
              <CPTInput
                v-model="inscricao.posicao"
                :disabled="!inscricao.editing"
                :clearable="false"
                label="Posição"
              />
            </v-col>

            <v-col v-if="inscricao.editing" cols="auto">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-text="'mdi-close'"
                    color="red"
                    v-on="on"
                    @click="
                      (inscricao.posicao = inscricaoOriginal.posicao),
                        (inscricao.editing = !inscricao.editing)
                    "
                  />
                </template>
                Cancelar
              </v-tooltip>
            </v-col>

            <v-col cols="auto" v-if="false">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    v-text="
                      inscricao.editing ? 'mdi-content-save' : 'mdi-pencil'
                    "
                    color="primary"
                    @click="
                      inscricao.editing
                        ? onSaveInscricao()
                        : (inscricao.editing = true)
                    "
                  />
                </template>
                {{ inscricao.editing ? "Salvar" : "Editar" }}
              </v-tooltip>
            </v-col>
          </v-col>

          <v-col cols="6" class="pa-0">
            <CPTSelect
              v-model="inscricao.deferido"
              label="Situação"
              disabled
              :items="[
                { value: true, text: 'Deferido' },
                { value: false, text: 'Indeferido' }
              ]"
              @input="onSaveInscricao"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <CPTFormSubtitle />
          </v-col>

          <v-col cols="6">
            Criança em vulnerabilidade social:
            {{ inscricao.vulnerabilidade_social ? "Sim" : "Não" }}
          </v-col>

          <v-col v-if="inscricao.processo_judicial" cols="6">
            Número do processo judicial:
            {{ inscricao.processo_judicial }}
          </v-col>

          <v-col cols="6">
            Meio de transporte próprio:
            <span>
              {{ inscricao.transporte_proprio.replace("_", " ") }}
            </span>
          </v-col>

          <v-col cols="6">
            Renda per capta: R$ {{ inscricao.renda_percapta }}
          </v-col>

          <v-col cols="12">
            <CPTFormSubtitle label="Endereço" />
          </v-col>

          <v-col
            cols="12"
            v-text="
              `${endereco.logradouro}, ${endereco.bairro}, ${endereco.numero ||
                'S/N'} - ${endereco.cidade.nome}/${
                endereco.cidade.estado.sigla
              }`
            "
            class="pb-0 text-uppercase"
          />
          <v-col
            v-if="endereco.complemento"
            v-text="`Complemento: ${endereco.complemento}`"
            cols="12"
            class="pt-0"
          />

          <v-col cols="12">
            <CPTFormSubtitle label="Membros Familiares" />
          </v-col>

          <v-col cols="12">
            <v-data-table
              hide-default-footer
              show-expand
              class="grey lighten-5"
              single-expand
              :items="
                inscricao.membroFamilia.map((membro, index) => ({
                  ...membro,
                  index,
                  onhover: 'cvi-table-row'
                }))
              "
              :headers="[
                {
                  sortable: false,
                  text: 'Parentesco',
                  value: 'parentesco.nome'
                },
                { sortable: false, text: 'Nome', value: 'nome' },
                { sortable: false, text: 'CPF', value: 'cpf' },
                {
                  sortable: false,
                  text: 'Certidão de Nascimento',
                  value: 'certidao_nascimento'
                }
              ]"
              @click:row="(item, { expand, isExpanded }) => expand(!isExpanded)"
              item-class="onhover"
            >
              <template v-slot:[`item.cpf`]="{ item }">
                {{ item.cpf && stringToCpf(item.cpf) }}
              </template>

              <template v-slot:expanded-item="{ headers, item: membro }">
                <td :colspan="headers.length" class="grey lighten-4">
                  <v-row>
                    <v-col cols="auto">
                      Local de trabalho:
                      {{ membro.local_trabalho || "Não informado" }}
                    </v-col>

                    <v-col
                      v-if="membro.local_trabalho"
                      cols="auto"
                      class="py-0"
                    >
                      <v-col cols="auto" class="pb-0 text-end">
                        Horário de entrada:
                        {{ membro.horario_trabalho_inicio || "Não informado" }}
                      </v-col>
                      <v-col cols="auto" class="pt-0 text-end">
                        Horário de saída:
                        {{ membro.horario_trabalho_fim || "Não informado" }}
                      </v-col>
                    </v-col>

                    <v-col cols="12">
                      Renda mensal: R$ {{ membro.renda }}
                    </v-col>
                  </v-row>

                  <v-row v-if="membro.endereco.id !== endereco.id">
                    <v-col cols="12" class="pb-0">
                      Endereço:
                      {{
                        `${endereco.logradouro}, ${
                          endereco.bairro
                        }, ${endereco.numero || "S/N"} - ${
                          endereco.cidade.nome
                        }/${endereco.cidade.estado.sigla} `
                      }}
                    </v-col>
                    <v-col
                      v-if="membro.endereco.complemento"
                      cols="12"
                      class="pt-0"
                    >
                      Complemento: {{ membro.endereco.complemento }}
                    </v-col>
                  </v-row>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTSelect from "@/components/Select";
import CPTFormSubtitle from "@/components/FormSubtitle";

import stringToCpf from "@/utils/stringToCpf";

export default {
  name: "dialog-inscricao",
  components: {
    CPTInput,
    CPTSelect,
    CPTFormSubtitle
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    this.endereco = this.inscricao.matricula.pessoa.endereco;
    this.inscricaoOriginal = { ...this.inscricao };
  },
  data: () => ({
    endereco: null,
    inscricaoOriginal: null
  }),
  computed: {
    inscricao: {
      get() {
        return this.value;
      },
      set(inscricao) {
        this.$emit("input", inscricao);
      }
    }
  },
  methods: {
    onSaveInscricao() {
      this.inscricao.editing = false;
      this.inscricaoOriginal = { ...this.inscricao };
      this.$emit("save");
    },
    stringToCpf
  }
};
</script>

<style scoped>
.cvi-dialog-toolbar {
  z-index: 1;
  margin: 0;
  top: 0;
  position: sticky;
  padding: 0;
}
</style>
