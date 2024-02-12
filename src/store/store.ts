import { createStore } from 'vuex';
import userModule from './modules/userModule';
import loadingModule from './modules/loadingModule';

export interface RootState {
  accessToken: string | null;
  // Diğer oturum bilgilerini buraya ekleyebilirsiniz
}

export default createStore({
  state: (): RootState => ({
    accessToken: null,
    // Diğer oturum bilgilerini buraya ekleyebilirsiniz
  }),
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    // Diğer mutasyonlar buraya eklenir
  },
  actions: {
    // Diğer eylemler buraya eklenir
  },
  getters: {
    // Diğer getter'lar buraya eklenir
  },
  modules: {
    user: userModule,
    loading: loadingModule,
  },
});
