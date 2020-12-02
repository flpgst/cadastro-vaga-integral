import Vue from "vue";
import Vuex from "vuex";

import snackbar from "@/store/modules/snackbar";
import address from "@/store/modules/address";

Vue.use(Vuex);

const store = new Vuex.Store({ modules: { snackbar, address } });

export default store;
