import Vue from 'vue'
import App from './App'

import router from './router/route'
import store from './store'
import ElementUI from 'element-ui'
import { http } from '@/api/http'
import regExp from '@/api/regExp'
import codeLength from '@/api/codeLength'
import VueLazyload from 'vue-lazyload'
import Redis from '@/api/redis'
Vue.use(VueLazyload)

import QRCode from 'qrcodejs2'

import '@/api/loginPush'
import 'babel-polyfill'

import './assets/icon/iconfont.css'

import x2js from 'x2js'

import 'element-ui/lib/theme-chalk/index.css'
import '@/style/css/common.scss'
import '@/style/css/public.scss'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = http
Vue.prototype.$regExp = regExp
Vue.prototype.$codeLength = codeLength
Vue.prototype.$redis = Redis

Vue.prototype.$x2js = new x2js()
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
