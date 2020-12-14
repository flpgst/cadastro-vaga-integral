<template>
  <v-select
    v-model="model"
    v-bind="$attrs"
    flat
    outlined
    rounded
    :rules="rules"
  />
</template>

<script>
export default {
  name: "CVISelect",
  props: {
    required: {
      type: Boolean,
      default: false
    },
    validator: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Number, String, Object, Boolean],
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
    rules() {
      const rules = this.required
        ? [...this.validator, v => !!v || "Este campo é obrigatório"]
        : [...this.validator];

      return rules;
    }
  }
};
</script>
