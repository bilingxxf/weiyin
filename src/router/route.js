import Vue from 'vue'
import Router from 'vue-router'
import '../assets/icon/iconfont.css'
Vue.use(Router)
const defaultMap= [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' }
  }
];
export default new Router({
  routes:defaultMap,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
