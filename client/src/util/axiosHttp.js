import store from '../store'
import axios from 'axios'

// Some function exports to use different headers on axios requests within the front end
// httpAuth() attaches an auth token for backend validation purposes

export function httpAuth(){
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

