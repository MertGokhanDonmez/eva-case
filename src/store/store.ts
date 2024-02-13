import { createStore } from 'vuex';
import userModule from './modules/userModule';
import loadingModule from './modules/loadingModule';

export interface RootState {
  accessToken: string | null;
}

export default createStore({
  state: (): RootState => ({
    accessToken: null,
  }),
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  actions: {
  },
  getters: {
  },
  modules: {
    user: userModule,
    loading: loadingModule,
  },
});
