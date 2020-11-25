<template>
  <v-select
    v-model="model"
    v-bind="$attrs"
    flat
    outlined
    rounded
    :rules="validate"
  />
</template>

<script>
export default {
  name: "CVIInput",
  props: {
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Number, String],
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
