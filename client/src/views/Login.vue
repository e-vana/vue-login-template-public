<template>

<div class="my-bg-dark">
  <div class="container pb-4">
    <b-row>
      <b-col md="3">
      </b-col>
      <b-col md="6" cols="12" class="form-card p-5 mt-4">
        <b-form @submit.prevent="login">
          <h2>Login</h2>

          <b-form-group id="userName" label="Username" label-for="input-username">
            <b-form-input id="input-username" required placeholder="username" v-model="username"></b-form-input>
          </b-form-group>

          <b-form-group id="password" label="Password" label-for="input-password">
            <b-form-input type="password" id="input-password" required placeholder="password" v-model="password"></b-form-input>
            <b-form-checkbox class="text-right mt-4" v-model="rememberMe" value="true" unchecked-value="false">Stay Logged In</b-form-checkbox>
          </b-form-group>

          <div class="button-bar text-right">
            <b-button class="mb-3 " type="submit" variant="primary"><b-spinner small v-if="isLoading"/><div v-if="!isLoading">Login</div></b-button>

          </div>
          <div class="container text-right">
            <router-link to="/register">Haven't registered yet?</router-link>
            <br>
            <router-link to="/forgot-password">Forgot your password?</router-link>
          </div>

        </b-form>
        <b-alert variant="warning" class="mt-4 text-center" show v-if="isError">{{ error }}</b-alert>
        <b-alert variant="info" class="mt-4 text-center" show v-if="isNotConfirmed && isError">
          <b-button variant="primary" @click="confirmEmailAgain()"><b-spinner small v-if="isConfirmationLoading"/><div v-if="!isConfirmationLoading">Resend Confirmation Email</div></b-button>
        </b-alert>

      </b-col>
      <b-col md="3"></b-col>
    </b-row>
  </div>
</div>

</template>
<script>

// import {instance} from '../main.js'
import {http} from '../util/axiosHttp.js'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import cookies from 'vue-cookies';


export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      userEmail: '',
      isNotConfirmed: false,
      isError: false,
      isLoading: false,
      isConfirmationLoading: false,
      userId: '',
      rememberMe: false,
      appName: process.env.VUE_APP_NAME
    }
  },
  methods: {
    makeToast(variant = null, title, bodyContent) {
      this.$root.$bvToast.toast(bodyContent, {
        title: title,
        variant: variant,
        solid: true
      })
    },
    waitFor: function(){
      this.isLoading = true;
      setTimeout(this.login, 5000);
    },
    confirmEmailAgain: async function(){
      this.isConfirmationLoading = true;
      var confirmedEmail = await http().post(`${process.env.VUE_APP_API_URL}/api/users/send-confirm-email-again`, {
        userEmail: this.userEmail,
        userId: this.userId
      });

      if(!confirmedEmail){
        throw "There was a problem confirming your email address.  Please contact support."
      }
      this.isConfirmationLoading = false;
      this.makeToast('success', 'Sucesfully sent another confirmation email.', "Please check your email and confirm your email address to continue to login.", this.success);
    },
    login: async function() {
      try {
        this.isLoading = true;

        var login = await http().post(`${process.env.VUE_APP_API_URL}/api/users/login`, {
          username: this.username,
          password: this.password
        })

        var userId = login.data.userId;
        this.userId = login.data.userId;
        this.userEmail = login.data.userEmail;
        var isConfirmed = await http().get(`${process.env.VUE_APP_API_URL}/api/users/confirmed-email/${userId}`);

        if(!isConfirmed.data.isConfirmed){
          this.isNotConfirmed = true;
          this.userEmail = login.data.userEmail;
          throw `You cannot continue to login until your email address is confirmed.  Please check your email or click the button below to resend a confirmation email.`
        }

        if(login.data.error){
          throw login.data.error;
        }
 
        var decoded = jwtDecode(login.data.token);
        if(decoded.isAdmin){
          this.$store.commit("admin", true);
        }

        this.$store.commit("setUser", decoded.username);
        this.$store.commit("login");
        this.$store.commit("token", login.data.token);

        // console.log(login.data.token)

        if(this.rememberMe){
          cookies.set("user_token", login.data.token, "1d");
        }
        this.$router.push('/dashboard') 

      } catch(err){
          this.isError = true;
          this.error = err;
          this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
</style>
