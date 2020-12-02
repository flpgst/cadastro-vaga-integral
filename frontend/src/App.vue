<template>
  <v-app>
    <login v-if="!isAuthenticated()"> </login>
    <v-row v-else>
      <v-col cols="12">
        <v-app-bar app color="primary" dark>
          <v-row>
            <v-col
              v-text="user.name"
              cols="auto"
              class="font-weight-medium body-1 d-flex align-center text-uppercase"
            />

            <v-col cols="auto">
              <v-divider vertical class="white" />
            </v-col>

            <v-col class="py-0 d-flex">
              <v-col cols="auto">
                <v-btn text depressed to="/cadastros">
                  <v-icon left v-text="'mdi-format-list-bulleted'" />
                  CONSULTA DE CADASTROS
                </v-btn>
              </v-col>
            </v-col>
          </v-row>

          <v-spacer></v-spacer>

          <v-btn icon @click="logout()">
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </v-app-bar>

        <v-main>
          <v-container>
            <router-view />
          </v-container>
        </v-main>

        <CPTSnackbar />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import CPTSnackbar from "@/components/Snackbar";
import Login from "@/pages/Login";
import { isAuthenticated, logout } from "@/plugins/security";

export default {
  name: "App",

  components: {
    CPTSnackbar,
    Login
  },

  data: () => ({
    user: {
      name: "Neide da Silva"
    }
  }),
  methods: {
    isAuthenticated,
    logout
  }
};
</script>
