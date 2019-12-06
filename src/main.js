import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Router from 'vue-router'
import VueSSE from 'vue-sse';
import Vuex from 'vuex'
import babylon from 'vue-babylonjs'

import Plc from './components/plc'
import Data from './components/data'
import Trans from './components/trans'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(VueSSE)
Vue.use(Vuex)
Vue.use(babylon)

const routes = [
  { path: '/', name: "plc", component: Plc },
  { path: '/data', name: "data", component: Data },
  { path: '/trans', name: "trans", component: Trans },
]

const router = new Router({ mode: 'history', routes })


// Global data
var connected = false
var plcAddress = ""
var slotNr = 0
var msgServer = null
var z_values = []
var dummy = 0
var cycles = []

var plcData = []
var objData = []
var Transitions = []
var Stats = []
var States = []

var quantity = 0
var positions = []
var scales = []
var rotation = 0.0

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
      slotNr,
      msgServer,
      z_values,
      dummy,
      plcData,
      tab1,
      tab2,
      cycles,
      Transitions,
      Stats,
      States,
      objData,
      quantity,
      positions,
      scales,
      rotation
    }
  })

new Vue({
  vuetify,
  axios,
  router,
  store,
  babylon,
  render: h => h(App)
}).$mount('#app')
