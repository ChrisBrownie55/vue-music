import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  theme: {
    primary: '#673AB7',
    secondary: '#4CAF50',
    accent: '#FF9800',
    error: '#212121',
    warning: '#BF360C',
    info: '#607D8B',
    success: '#304FFE'
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
