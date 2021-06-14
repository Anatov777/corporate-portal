import Vue from 'vue'
import Vuelidate from 'vuelidate'
import router from '@/router'
import store from '@/store'
import http from '@/modules/http.js'
import onServerReject from '@/modules/on-server-reject.js'

import App from './App.vue'

import '@/styles/style.scss'

Vue.config.productionTip = false

Vue.config.ignoredElements = ['trix-editor']

Vue.use(Vuelidate)

import moment from 'moment'
require('moment/locale/ru')
Vue.prototype.moment = moment

http.interceptors.response.use(null, onServerReject)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
