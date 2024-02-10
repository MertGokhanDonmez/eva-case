import { createStore } from 'vuex';
import userModule from './modules/user';

export interface RootState {
  accessToken: string | null;
  loading: boolean;
  // Diğer oturum bilgilerini buraya ekleyebilirsiniz
}

export default createStore({
  state: (): RootState => ({
    accessToken: null,
    loading: false,
    // Diğer oturum bilgilerini buraya ekleyebilirsiniz
  }),
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    setLoading(state, payload) {
      state.loading = payload;
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
  },
});
