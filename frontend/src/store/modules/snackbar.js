const module = {
  namespaced: true,
  state: {
    active: false,
    color: null,
    message: null
  },
  mutations: {
    active(state, status) {
      state.active = status;
    },
    color(state, color) {
      state.color = color;
    },
    message(state, message) {
      state.message = message;
    }
  },
  actions: {
    show({ commit }, { message, color }) {
      commit("message", message);
      commit("color", color);
      commit("active", true);
    }
  }
};

export default module;
