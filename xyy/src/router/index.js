import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/MyLogin.vue'
import Home from '../views/MyHome.vue'
import AdminInfo from '../views/UserInfo.vue'



Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [

  {
    path: '/',
    name: 'login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/adminInfo',
        name: '个人中心',
        component: AdminInfo,
      }
    ]
  }




]

const router = new VueRouter({
  routes
})

export default router
