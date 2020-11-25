<template>
  <v-text-field
    v-model="model"
    v-bind="$attrs"
    :counter="counter"
    :disabled="disabled"
    :rules="rules"
    clearable
    flat
    outlined
    rounded
  />
</template>

<script>
export default {
  name: "CVIInput",
  props: {
    counter: {
      type: [Boolean, Number, String],
      default: null,
      validator: v => !typeof v === "number" || v > 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    validator: {
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
    rules() {
      const rules = [...this.validator];

      if (this.required) rules.push(v => !!v || "Este campo é obrigatório");

      return rules;
    }
  }
};
</script>
