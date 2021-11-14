import Vue from 'vue'
import App from './App.vue'
import router from './router'


Vue.config.productionTip = false

export const url = 'http://localhost:3000/api/'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
