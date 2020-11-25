<template>
  <v-row align="center">
    <template v-if="label">
      <v-col cols="1">
        <v-divider class="grey lighten-1" />
      </v-col>
      <v-col cols="auto" v-text="label" class=" text-h6 grey--text" />
    </template>
    <v-col>
      <v-divider class="grey lighten-1" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CPTFormSubtitle",
  props: {
    label: {
      type: String,
      default: null
    }
  }
};
</script>
