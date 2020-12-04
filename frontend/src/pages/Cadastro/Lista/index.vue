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
          { sortable: false, text: 'Posicão' },
          { sortable: false, text: 'Protocolo' },
          { sortable: false, text: 'Matrícula' },
          { sortable: false, text: 'Aluno' },
          { sortable: false, text: 'Deferido' }
        ]"
        :items="handleInscricoes"
      >
        <template v-slot:item="{ item: inscricao, index }">
          <tr>
            <td>
              {{ inscricao.posicao || index + 11 }}
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
              <v-checkbox v-model="inscricao.deferido" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import CPTInput from "@/components/Input";

export default {
  name: "lista-cadastro",

  components: {
    CPTInput
  },

  mounted() {
    this.getInscricoes();
  },

  data: () => ({
    protocol: null,
    inscricoes: []
  }),

  methods: {
    async getInscricoes() {
      const { data: inscricoes } = await this.$http
        .get("inscricao ")
        .catch(error => this.showMessage(error, "error"));

      this.inscricoes = inscricoes;
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
