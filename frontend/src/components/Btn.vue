<template>
  <v-btn
    v-bind="$attrs"
    :icon="!!icon && !label"
    :label="label"
    :color="color"
    :outlined="icon && !!label"
    :text="!icon"
    @click="$emit('click')"
    rounded
  >
    <v-icon v-if="icon" :left="!!label" :center="!label" v-text="icon" />
    <span v-if="label" v-text="label" />
  </v-btn>
</template>

<script>
export default {
  name: "CPTBtn",
  props: {
    color: {
      type: String,
      default: "primary"
    },
    icon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    }
  }
};
</script>
