import Vue from "vue";
import App from "./App.vue";
import Maska from "maska";

import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

// import api from "./plugins/api";
// Vue.prototype.$http = api;

Vue.config.productionTip = false;

Vue.use(Maska);

Vue.mixin({
  methods: {
    showMessage(message, color) {
      store.dispatch("snackbar/show", { message, color });
    }
  }
});

new Vue({
  router,
  store,
  vuetify,

  render: h => h(App)
}).$mount("#app");
