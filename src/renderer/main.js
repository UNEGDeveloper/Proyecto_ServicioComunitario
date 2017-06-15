import Vue from 'vue'
import axios from 'axios'

import Vuetify from 'vuetify'
import Icons from 'material-design-icons'
import App from './App'
import router from './router'
import store from './store'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons/iconfont/material-icons.css'

Vue.use(Vuetify)
Vue.use(Icons)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
