import { createStore } from 'vuex';

export default createStore({
  state: {
    accessToken: null,
    loading: false, // Yükleniyor durumu
    // Diğer oturum bilgilerini buraya ekleyebilirsiniz
  },
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
});
