import { createApp } from 'vue'
import App from './App.vue'
import HighchartsVue from 'highcharts-vue'
import store from './store/store'; // Vuex store'unun dosyasını içe aktar
import router from './router/route';  // router'ı ekleyin

const app = createApp(App);

app.use(HighchartsVue);
app.provide("$store", store);
app
  .use(router)
  .use(store) // Vuex store'u uygulamaya ekle
  .mount('#app');
