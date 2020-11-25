<template>
  <v-snackbar
    v-model="active"
    v-bind="$attrs"
    :color="color"
    right
    rounded="lg"
    text
    top
  >
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  name: "snackbar",

  computed: {
    active: {
      get() {
        return this.$store.state.snackbar.active;
      },
      set(active) {
        this.$store.commit("snackbar/active", active);
      }
    },

    color() {
      return this.$store.state.snackbar.color;
    },
    message() {
      return this.$store.state.snackbar.message;
    }
  }
};
</script>
