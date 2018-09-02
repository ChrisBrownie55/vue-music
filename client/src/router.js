import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(route => route.meta.requiresAuth) &&
    !store.getters.loggedIn
  ) {
    return next({ name: 'login' })
  }
  next()
})

export default router
