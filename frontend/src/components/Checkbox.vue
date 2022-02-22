<template>
  <v-checkbox
    v-model="model"
    :color="color"
    :disabled="disabled"
    :label="label"
  ></v-checkbox>
</template>

<script>
export default {
  name: "CPTCheckbox",
  props: {
    color: {
      type: String,
      default: "primary"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: undefined
    },
    value: {
      type: Boolean,
      default: false
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
    }
  }
};
</script>
