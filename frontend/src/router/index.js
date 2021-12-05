import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Signup from '../components/Signup'
import Profile from '../components/Profile'
import  PostsList from '../components/PostsList'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: ' PostsList',
    component: PostsList
  },
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
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
