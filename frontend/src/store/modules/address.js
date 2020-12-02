import config from "@/config";
import api from "@/plugins/api";

const { estadoDefault, cidadeDefault } = config;

const module = {
  namespaced: true,
  state: {
    states: null,
    estadoDefault,
    cidadeDefault
  },
  mutations: {
    states(state, states) {
      state.states = states;
    }
  },
  actions: {
    async getStates({ commit, state }) {
      if (!state.states) {
        const { data: states } = await api.get("estado");
        commit("states", states);
      }
    }
  }
};

export default module;
