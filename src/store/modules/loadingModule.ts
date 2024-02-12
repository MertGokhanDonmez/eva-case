import { Module } from 'vuex';

interface LoadingState {
  isLoading: boolean;
}

const state: LoadingState = {
  isLoading: false,
};

const mutations = {
  setLoading(state: LoadingState, value: boolean) {
    state.isLoading = value;
  },
};

const actions = {
  startLoading({ commit }: any) {
    commit('setLoading', true);
  },
  stopLoading({ commit }: any) {
    commit('setLoading', false);
  },
};

const getters = {
  isLoading: (state: LoadingState) => state.isLoading,
};

const loadingModule: Module<LoadingState, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default loadingModule;
