<template>
  <v-autocomplete
    v-model="model"
    v-bind="$attrs"
    flat
    outlined
    rounded
    @change="$emit('change', $event)"
    :rules="validate"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ noDataText }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "Autocomplete",
  props: {
    noDataText: {
      type: String,
      default: "Nenhum registro encontrado"
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: null
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      }
    },
    validate() {
      const rules = this.required
        ? [...this.rules, v => !!v || "Este campo é obrigatório"]
        : [...this.rules];

      return rules;
    }
  }
};
</script>
