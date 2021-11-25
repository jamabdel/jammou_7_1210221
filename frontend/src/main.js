import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { BootstrapVue, BIcon, BIconArrowUp, BIconArrowDown } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.component('BIcon', BIcon)
Vue.component('BIconArrowUp', BIconArrowUp)
Vue.component('BIconArrowDown', BIconArrowDown)

Vue.config.productionTip = false

export const url = 'http://localhost:3000/api/'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
