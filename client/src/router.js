import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import PasswordReset from './views/PasswordReset.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ConfirmEmail from './views/ConfirmEmail.vue'
import Dashboard from './views/Dashboard.vue'
import Admin from './views/Admin.vue'
import AdminUsers from './views/AdminUsers.vue'
import AdminUser from './views/AdminUser.vue'

import Splash from './views/Splash.vue'
import Breakdown from './views/Breakdown.vue'
import { http } from './util/axiosHttp.js'




Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/splash',
      name: 'splash',
      component: Splash
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/password-reset/:id',
      name: 'password-reset',
      component: PasswordReset
    },
    {
      path: '/forgot-password/',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/confirm-email/:id',
      name: 'confirm-email',
      component: ConfirmEmail,
      beforeEnter: async (to, from, next) => {
        try{
          var params = to.params.id;
          var confirmedEmail = await http().get(`${process.env.VUE_APP_API_URL}/api/users/confirmed-email/${params}`);

          // console.log(confirmedEmail.data.isConfirmed)

          if(confirmedEmail.data.isConfirmed==true){
            next('/');
          }else {
            next();
          }
        }catch(err){
          console.log(err);
        }
      }
    },
    {
      path: '/breakdown',
      name: 'breadown', 
      component: Breakdown
    },
    {
      path: '/dashboard/',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if(store.getters.loginState){
          next();
        } else{
          next('/')
        }
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        if(store.getters.adminState){
          next();
        } else{
          next('/')
        }
      }
    },
    {
      path: '/admin/users',
      name: 'user-list',
      component: AdminUsers,
      beforeEnter: (to, from, next) => {
        if(store.getters.adminState){
          next();
        } else{
          next('/')
        }
      }
    },
    {
      path: '/admin/user/:id',
      name: 'user',
      component: AdminUser,
      beforeEnter: (to, from, next) => {
        if(store.getters.adminState){
          next();
        } else{
          next('/')
        }
      }
    }

  ]
})
