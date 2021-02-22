import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/tailwind.css';
import axios from 'axios'
import store from './flux'
import Router from './router'
import vmodal from 'vue-js-modal'

Vue.use(vmodal)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store: store,
  router: Router, 
}).$mount('#app')
