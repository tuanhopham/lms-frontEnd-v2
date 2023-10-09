import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import i18n from '@/i18n'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import GAuth from 'vue-google-oauth2'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'

import filters from '@/utils/filters'
import router from './router'
import { GOOGLE_ANALYTICS_ID } from '@/utils/constants'
import VueAnalytics from 'vue-analytics'
import katex from '@/plugins/katex'

import Panel from './components/Panel.vue'
import IconBtn from './components/btn/IconBtn.vue'
import Save from './components/btn/Save.vue'
import Cancel from './components/btn/Cancel.vue'
import './style.less'

import VirtualList from 'vue-virtual-scroll-list'

Vue.component('virtual-list', VirtualList)
Vue.config.productionTip = false

Vue.use(iView)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.devtools = false
Vue.use(VueAnalytics, {
  id: GOOGLE_ANALYTICS_ID,
  router
})
const gauthOption = {
  clientId: '786239976027-meb3fdvuoh7ddorubtef280mkmddcqpa.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: false,
  plugin_name: 'lms 2'
}
Vue.use(GAuth, gauthOption)
Vue.use(katex)
Vue.component(IconBtn.name, IconBtn)
Vue.component(Panel.name, Panel)
Vue.component(Save.name, Save)
Vue.component(Cancel.name, Cancel)
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.prototype.$error = (msg) => {
  Vue.prototype.$message({'message': msg, 'type': 'error'})
}

Vue.prototype.$warning = (msg) => {
  Vue.prototype.$message({'message': msg, 'type': 'warning'})
}

Vue.prototype.$success = (msg) => {
  if (!msg) {
    Vue.prototype.$message({'message': 'Succeeded', 'type': 'success'})
  } else {
    Vue.prototype.$message({'message': msg, 'type': 'success'})
  }
}

new Vue(Vue.util.extend({router, store, i18n}, App)).$mount('#app')
