import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Router from 'vue-router'

import Plc from './components/plc'
import Data from './components/data'

Vue.config.productionTip = false

Vue.use(Router)

const routes = [
  { path: '/', name: "plc", component: Plc },
  { path: '/data', name: "data", component: Data},
]

const router = new Router({ mode: 'history', routes })

new Vue({
  vuetify,
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
