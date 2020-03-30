import {http} from './axiosHttp.js'
import Router from 'vue-router'
import Vue from 'vue'


async function confirmEmail(to, from, next){
  try {
    var self = this;
    console.log("fired")
    var isConfirmed = await http().get(`${process.env.VUE_APP_API_URL}/api/users/confirm-email/${this.$router.params.id}`);
    if(isConfirmed.isConfirmed){
      console.log("confirmed")
      next('/')
    }else {
      console.log("not confirmed")
      next();
    }
  }catch(err){
    console.log(err);
    next('/login')
  }
}

export { confirmEmail };
