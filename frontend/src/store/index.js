import Vue from "vue";
import Vuex from "vuex";

import snackbar from "@/store/modules/snackbar";

Vue.use(Vuex);

const store = new Vuex.Store({ modules: { snackbar } });

export default store;
