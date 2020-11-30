import Vue from "vue";
import App from "./App.vue";
import Maska from "maska";

import vuetify from "./plugins/vuetify";
import server from "./plugins/api";
import router from "./router";
import store from "./store";

Vue.prototype.$http = server;

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
