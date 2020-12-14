<template>
  <v-dialog :value="true" width="750" persistent>
    <v-card color="grey lighten-5">
      <v-card-title
        class="headline primary white--text d-flex flex-column align-start"
      >
        <span v-text="inscricao.matricula.pessoa.nome" />
        <span v-text="inscricao.protocolo" />
      </v-card-title>

      <v-card-text class="pt-5">
        <v-row>
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

            <v-col cols="auto">
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
              label="Deferido"
              :items="[
                { value: true, label: 'Sim' },
                { value: false, label: 'Não' }
              ]"
              item-text="label"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <CPTFormSubtitle />
          </v-col>

          <v-col cols="6">
            Criança em vulnerabilidade social:
            {{ inscricao.vulnerabilidade ? "Sim" : "Não" }}
          </v-col>

          <v-col cols="6" class="pa-0">
            <v-col cols="12" :class="inscricao.processo_judicial && 'py-0'">
              Cadastro no Fila Única com processo judicial:
              {{ inscricao.processo_judicial ? "Sim" : "Não" }}
            </v-col>
            <v-col v-if="inscricao.processo_judicial" class="py-0" cols="12">
              Número do processo:
              {{ inscricao.processo_judicial }}
            </v-col>
          </v-col>

          <v-col cols="12">
            Família possio meio de transporte próprio:
            {{ inscricao.transporte_proprio }}
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
              } ${endereco.complemento ? '(' + endereco.complemento + ')' : ''}`
            "
            class="pb-0 text-uppercase"
          />
          <v-col
            v-if="endereco.complemento"
            v-text="endereco.complemento"
            cols="12"
            class="pt-0 caption"
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

                    <v-col v-if="membro.local_trabalho" class="pa-0">
                      <v-col cols="12" class="py-0">
                        Horário de entrada:
                        {{ membro.horario_trabalho_inicio || "Não informado" }}
                      </v-col>
                      <v-col cols="12" class="py-0">
                        Horário de saída:
                        {{ membro.horario_trabalho_fim || "Não informado" }}
                      </v-col>
                    </v-col>
                  </v-row>

                  <v-row v-if="membro.endereco.id === endereco.id">
                    <v-col>
                      Endereço:
                      {{
                        `${endereco.logradouro}, ${
                          endereco.bairro
                        }, ${endereco.numero || "S/N"} - ${
                          endereco.cidade.nome
                        }/${endereco.cidade.estado.sigla} ${
                          endereco.complemento
                            ? "(" + endereco.complemento + ")"
                            : ""
                        }`
                      }}
                    </v-col>
                  </v-row>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex justify-end py-3">
        <CPTBtn label="Cancelar" @click="$emit('close')" />
        <CPTBtn label="Salvar" @click="onSaveInscricao()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CPTBtn from "@/components/Btn";
import CPTInput from "@/components/Input";
import CPTSelect from "@/components/Select";
import CPTFormSubtitle from "@/components/FormSubtitle";

import stringToCpf from "@/utils/stringToCpf";

export default {
  name: "dialog-inscricao",
  components: {
    CPTBtn,
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