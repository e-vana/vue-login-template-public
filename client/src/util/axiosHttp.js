import store from '../store'
import axios from 'axios'



export function httpAuth(){
  // console.log($cookies.get("user_token"))
  return axios.create({
    validateStatus: function (status) {
      return status >= 200;
    },
    headers: {
      "Authorization" : `Bearer ${$cookies.get("user_token")}`
    }
  })
}

export function http(){
  return axios.create({
    validateStatus: function (status) {
      return status >= 200;
    }
  })
}

