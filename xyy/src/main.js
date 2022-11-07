import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import { postRequest } from './utils/api';
import { putRequest } from './utils/api';
import { getRequest } from './utils/api';
import { deleteRequest } from './utils/api';
import {initMenu} from './utils/menus';
import 'animate.css'
import dayjs from "dayjs";
import {Button} from 'tdesign-vue'




Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.deleteRequest=deleteRequest;
Vue.prototype.$dayjs = dayjs;
Vue.use(Button)


/**
 * dayJs 实现的过滤器
 * 使用方法 {{ dateStr | date }}
 */
Vue.filter("date", (dateStr, format = "YYYY-MM-DD") => {
  return dayjs(dateStr).format(format);
})
Vue.filter("dateTime", (dateStr, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(dateStr).format(format);
});
Vue.filter("time", (dateStr, format = "HH:mm:ss") => {
  return dayjs(dateStr).format(format);
});




//路由前置守卫 
router.beforeEach((to,from,next)=>{
  //判断一下是否登录  未登录不允许
  if(to.path=='/'){
    next();
  } else if(window.sessionStorage.getItem("user")){
    initMenu(router,store);
    next();
  } else {
    next('/?redirect=' + to.path)
}
})

new Vue({
  router, 
  store,
  render: h => h(App),
}).$mount('#app')
