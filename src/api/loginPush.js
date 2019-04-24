import router from '@/router/route'
import store from '../store'
import Vue from 'vue'
import { Message } from 'element-ui'
router.beforeEach((to, from, next) => {
  let token=sessionStorage.getItem("token");
  if(token){
    if(store.getters.addRouters.length==0){
      store.dispatch('getRouters').then(() => {
        router.addRoutes(store.state.addRouters) // 动态添加可访问路由表
        Vue.nextTick(()=>{
          next({ ...to, replace: true })
        });
      }).catch(()=>{
        store.dispatch('clearRouters').then((err) => {
          Message.error(err || '初始化菜单列表失败,请重新登录');
          next({path: '/'})
        })
      });
    }else{
      if (to.path === '/'){
        store.dispatch('clearRouters').then(()=>{
          next()
        });
      }else{
        next();
      }
    }
  }else{
    if (to.path === '/') {
      next();
    }else{
      next(`/?redirect=${to.path}`)
    }
  }
  if(to.meta.title){
    document.title = to.meta.title;
  }
});
