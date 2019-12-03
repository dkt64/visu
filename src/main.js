import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Router from 'vue-router'
import VueSSE from 'vue-sse';
import Vuex from 'vuex'

import Plc from './components/plc'
import Data from './components/data'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(VueSSE);
Vue.use(Vuex)

const routes = [
  { path: '/', name: "plc", component: Plc },
  { path: '/data', name: "data", component: Data },
]

const router = new Router({ mode: 'history', routes })


// Global data
var connected = false
var plcAddress = ""
var msgServer = null
var z_values = []
var dummy = 0
var cycles = []

// var plcDataType = {Timestamp:"", IOImage:""}
var plcData = null
// plcData[0] = plcDataType

var tab1 = [
  {
    z: [],
    type: "heatmap",
    colorscale: 'YIGnBu',
  }
]

var tab2 = [
  {
    z: [],
    type: "heatmap",
    colorscale: 'YIOrRd',
    // colorscale: [
    //   ['0.0', '#17becf'],
    //   ['0.5', 'rgb(255,0,255)'],
    //   ['1.0', 'rgb(255,255,255)']
    // ],
  }
]

const store = new Vuex.Store({
    state: {
      connected,
      plcAddress,
      msgServer,
      z_values,
      dummy,
      plcData,
      tab1,
      tab2,
      cycles,
    }
  })

new Vue({
  vuetify,
  axios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
