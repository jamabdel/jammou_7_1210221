import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Signup from '../components/Signup'



Vue.use(VueRouter)

const routes = [
  
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
  

  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
