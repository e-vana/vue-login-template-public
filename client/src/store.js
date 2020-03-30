import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    token: '',
    isAdmin: false,
    currentUser: ''
  },
  mutations: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    token: (state, payload) => {
      state.token = payload;
    },
    signout: (state) => {
      state.isLoggedIn = false;
    },
    admin: (state, payload) => {
      state.isAdmin = payload;
    },
    setUser: (state, payload) => {
      state.currentUser = payload;
    }
  },
  actions: {

  },
  getters: {
    loginState: state => {
      return state.isLoggedIn;
    },
    showToken: state => {
      return state.token;
    },
    adminState: state => {
      return state.isAdmin;
    },
    getUser: state => {
      return state.currentUser;
    }
  }
})
