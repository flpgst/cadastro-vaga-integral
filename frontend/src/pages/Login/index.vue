<template>
  <v-container class="fill-height d-flex justify-center">
    <v-card flat rounded max-width="550" color=" grey lighten-5">
      <v-form
        class="d-flex flex-wrap"
        ref="form"
        @submit.prevent="onSubmit"
        @keydown.enter="onSubmit"
      >
        <v-col cols="12">
          <CPMInput
            v-model="username"
            label="Usuário"
            :uppercase="false"
            :validator="[v => !!v]"
          />
        </v-col>
        <v-col cols="12">
          <CPMInput
            v-model="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :uppercase="false"
            @click:append="showPassword = !showPassword"
            :validator="[v => !!v]"
          />
        </v-col>
        <v-col cols="12" class="d-flex justify-end">
          <CPMBtn type="submit" label="Entrar" icon="mdi-login-variant" />
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import CPMInput from "@/components/Input";
import CPMBtn from "@/components/Btn";

export default {
  name: "login",
  components: {
    CPMInput,
    CPMBtn
  },
  data: () => ({
    showPassword: false,
    username: null,
    password: null
  }),
  methods: {
    onSubmit() {
      if (!this.$refs.form.validate())
        return this.showMessage("Usuário ou senha inválidos", "error");

      this.login();
    },
    login() {
      // const { username, password } = this;
    }
  }
};
</script>
