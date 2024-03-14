import { createStore } from "vuex";

export default createStore({
  state: {
    loader: true,
  },
  getters: {
    isLoading : (state) => state.loader
  },
  actions: {
    showLoader({commit}) {
      commit("SHOWLOADER");
    },
    hideLoader({commit}) {
      commit("HIDELOADER");
    }
  },
  mutations: {
    SHOWLOADER(state) {
      state.loader = true;
    },
    HIDELOADER(state) {
      state.loader = false;
    }
  }
});