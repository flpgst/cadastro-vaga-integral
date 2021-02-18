<template>
  <v-dialog @click:outside="$emit('close')" :value="true" width="750">
    <v-toolbar color="primary" dark flat class="cvi-dialog-toolbar">
      <v-toolbar-title class="d-flex flex-column justify-center">
        <span class="title" v-text="inscricao.matricula.pessoa.nome" />

        <span
          class="caption"
          v-text="
            `Matrícula: ${inscricao.matricula.codigo} | ${inscricao.matricula.unidadeEnsino.nomeCompleto}`
          "
        />
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon @click="$emit('close')">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-card color="grey lighten-5" :loading="loading">
      <template slot="progress">
        <v-progress-linear color="primary" height="5" indeterminate />
      </template>
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

            <v-col v-if="inscricao.editing" cols="auto" class="px-0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon
                      v-text="'mdi-close'"
                      color="red"
                      @click="
                        (inscricao.posicao = inscricaoOriginal.posicao),
                          (inscricao.editing = false)
                      "
                    />
                  </v-btn>
                </template>
                Cancelar
              </v-tooltip>
            </v-col>

            <v-col cols="auto" class="px-0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    icon
                    :disabled="
                      inscricao.status !== DEFERIDO || loading || alunoEnturmado
                    "
                    color="primary"
                  >
                    <v-icon
                      v-text="
                        inscricao.editing ? 'mdi-content-save' : 'mdi-pencil'
                      "
                      color="primary"
                      @click="
                        inscricao.editing
                          ? onSaveInscricao('posicao')
                          : (inscricao.editing = true)
                      "
                    />
                  </v-btn>
                </template>
                {{ inscricao.editing ? "Salvar" : "Editar" }}
              </v-tooltip>
            </v-col>
          </v-col>

          <v-col cols="6" class="pa-0">
            <CPTSelect
              v-model="inscricao.status"
              label="Status"
              :items="status"
              :disabled="loading || alunoEnturmado"
              @input="
                onSaveInscricao('status'),
                  inscricao.status === DEFERIDO && getUnidadesEnsino()
              "
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

          <v-col cols="12">
            <CPTFormSubtitle label="Unidade de Ensino" />
          </v-col>

          <v-col
            v-if="inscricao.status !== DEFERIDO"
            cols="12"
            v-text="'É necessário deferir a inscrição antes de alocar o aluno'"
          />

          <template v-else-if="loading">
            <v-col cols="6">
              <v-skeleton-loader type="text" />
            </v-col>
            <v-col cols="6">
              <v-skeleton-loader type="text" />
            </v-col>
          </template>

          <template v-else-if="!alunoEnturmado">
            <v-col cols="6">
              <CPTAutocomplete
                v-model="unidadeEnsino"
                :items="unidadesEnsino"
                itemText="nomeCompleto"
                label="Unidade de Ensino"
                noDataText="Nenhuma unidade encontrada"
                return-object
                @change="getTurmas()"
              />
            </v-col>
            <v-col cols="6">
              <CPTAutocomplete
                v-model="turma"
                :disabled="!unidadeEnsino"
                :items="turmas"
                itemText="nomeCompleto"
                :hint="
                  turma
                    ? `${turma.quantidadeAlunos}/${turma.limiteAlunos}`
                    : null
                "
                persistent-hint
                :rules="[
                  () =>
                    !turma ||
                    turma.quantidadeAlunos < turma.limiteAlunos ||
                    'Nenhuma vaga disponível nesta turma'
                ]"
                label="Turma"
                noDataText="Nenhuma turma encontrada"
                return-object
              />
            </v-col>

            <v-col cols="12" class="d-flex justify-end">
              <CPTBtn
                label="Salvar"
                icon="mdi-content-save"
                @click="
                  unidadeEnsino.id === inscricao.matricula.unidadeEnsino.id
                    ? enturmar()
                    : transferir()
                "
                :disabled="
                  !unidadeEnsino ||
                    !turma ||
                    turma.quantidadeAlunos >= turma.limiteAlunos
                "
                :loading="loading"
              />
            </v-col>
          </template>

          <v-col
            v-else
            v-text="
              `${inscricao.matricula.pessoa.nome} ENTURMADO NA TURMA ${turma.nomeCompleto} - ${turma.unidadeEnsino.nomeCompleto}`
            "
            class="text-uppercase"
          />
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import CPTInput from "@/components/Input";
import CPTBtn from "@/components/Btn";
import CPTAutocomplete from "@/components/Autocomplete";
import CPTSelect from "@/components/Select";
import CPTFormSubtitle from "@/components/FormSubtitle";

import stringToCpf from "@/utils/stringToCpf";

const DEFERIDO = "DEFERIDO";
const INDEFERIDO = "INDEFERIDO";
const PENDENTE = "PENDENTE";

const status = [DEFERIDO, INDEFERIDO, PENDENTE];

export default {
  name: "dialog-inscricao",
  components: {
    CPTInput,
    CPTBtn,
    CPTAutocomplete,
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
  mounted() {
    if (this.inscricao.status === DEFERIDO) {
      this.getUnidadesEnsino();
      this.getEnturmacao();
    }
  },
  data: () => ({
    DEFERIDO,
    INDEFERIDO,
    PENDENTE,
    alunoEnturmado: false,
    endereco: null,
    inscricaoOriginal: null,
    loading: false,
    status,
    turma: null,
    turmas: [],
    unidadeEnsino: null,
    unidadesEnsino: []
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
    enturmar() {
      this.$erudio
        .post("enturmacoes", {
          matricula: { id: this.inscricao.matricula.id },
          turma: { id: this.turma.id }
        })
        .then(() => {
          this.showMessage(
            `${this.inscricao.matricula.pessoa.nome} enturmado na turma ${this.turma.nomeCompleto}`,
            "success"
          );

          this.$emit("close");
        })
        .catch(error => this.showMessage(error, "error"));
    },
    getEnturmacao() {
      this.loading = true;
      this.$erudio
        .get("enturmacoes", {
          params: {
            matricula: this.inscricao.matricula.id,
            emAndamento: 1
          }
        })
        .then(enturmacoes => {
          this.loading = false;

          if (!enturmacoes.length) return;

          this.turma = enturmacoes
            .map(({ turma }) => turma)
            .find(({ apelido }) => apelido.toUpperCase() === "VIN");

          this.alunoEnturmado = !!this.turma;
        });
    },
    async getTurmas() {
      const { id: unidadeEnsino } = this.unidadeEnsino;
      this.turmas = await this.$erudio
        .get("turmas", {
          params: { unidadeEnsino, apelido: "VIN", view: "DETAILS" }
        })
        .catch(error => this.showMessage(error, "error"));
    },
    async getUnidadesEnsino() {
      this.unidadesEnsino = await this.$erudio
        .get("unidades-ensino", { params: { tipo_sigla: "UC" } })
        .catch(error => this.showMessage(error, "error"));

      this.unidadeEnsino =
        this.unidadesEnsino.find(
          ({ id }) => this.inscricao.matricula.unidadeEnsino.id === id
        ) || null;

      if (this.unidadeEnsino) this.getTurmas();
    },
    onSaveInscricao(parametro) {
      this.loading = true;
      this.inscricao.editing = false;
      this.inscricaoOriginal = { ...this.inscricao };
      this.$emit("save", parametro, () => {
        this.loading = false;
      });
    },
    stringToCpf,
    transferir() {
      this.$erudio
        .post("transferencias", {
          justificativa: "DEFERIDO NO CADASTRO DE VAGA INTEGRAL",
          matricula: { id: this.inscricao.matricula.id },
          unidadeEnsinoDestino: { id: this.unidadeEnsino.id },
          unidadeEnsinoOrigem: { id: this.inscricao.matricula.unidadeEnsino.id }
        })
        .then(({ id }) => {
          this.$erudio
            .put(`transferencias/${id}`, {
              id,
              status: "ACEITO"
            })
            .then(() => this.enturmar())
            .catch(error => this.showMessage(error, "error"));
        })
        .catch(error => this.showMessage(error, "error"));
    }
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
