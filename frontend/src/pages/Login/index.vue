<template>
  <v-container class="fill-height d-flex justify-center">
    <v-card flat rounded max-width="600" color="grey lighten-5">
      <v-card-title
        v-text="'Cadastro de Vaga Integral'"
        class="grey--text text-h4"
      />

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
            :clearable="false"
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
            :clearable="false"
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
        return this.showMessage(
          "Você precisa informar o nome de usuário e a senha",
          "error"
        );

      this.login();
    },

    login() {
      this.$http
        .post("login", {
          login: this.username,
          senha: this.password
        })
        .then(({ token, id, nome_exibicao: nome }) => {
          localStorage.setItem("token", token);

          localStorage.setItem("user", JSON.stringify({ id, nome }));

          window.location.reload();
        })
        .catch(error => this.showMessage(error, "error"));
    }
  }
};
</script>
