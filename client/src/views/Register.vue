<template>
  <div id="register-form" class="my-bg-dark">
    <div class="container pb-4">
      <b-row>
        <b-col md="3">
        </b-col>
        <b-col md="6" cols="12" class="form-card p-5 mt-4">
          <b-form @submit.prevent="register">
            <h2>Register</h2>

            <b-form-group id="userName" label="Username" label-for="input-username">
              <b-form-input id="input-username" required placeholder="username" v-model="username"></b-form-input>
            </b-form-group>


            <b-form-group id="email" label="Email" label-for="input-email" description="We'll never share your email with anyone else.">
              <b-form-input id="input-email" required placeholder="email" v-model="email" ></b-form-input>
            </b-form-group>
            
            <b-form-group id="password" label="Password" label-for="input-password" description="Password must contain one uppercase letter, one lowercase, one number and one non-alpha character.">
              <b-form-input type="password" id="input-password" required placeholder="password" v-model="password"></b-form-input>
            </b-form-group>

            <b-form-group id="passwordAgain" label="" label-for="input-passwordAgain">
              <b-form-input type="password" id="input-passwordAgain" required placeholder="confirm password" v-model="passwordAgain"></b-form-input>
              <b-badge v-if="(password == passwordAgain) && (password != '')" variant="success">Passwords Match!</b-badge>
            </b-form-group>



            <div class="button-bar text-right">
              <b-button class="mb-3 " type="submit" variant="primary"><b-spinner small v-if="isLoading"/><div v-if="!isLoading">Register</div></b-button>

            </div>
            <div class="container text-right">
              <router-link to="/login">Already have a login?</router-link>
              <br>
              <router-link to="/forgot-password">Forgot your password?</router-link>
            </div>

          </b-form>
          <b-alert variant="warning" class="mt-4 text-center" show v-if="isError">{{ error }}</b-alert>
          <b-alert variant="success" class="mt-4 text-center" show v-if="isSuccess">{{ success }}</b-alert>

        </b-col>
        <b-col md="6"></b-col>
      </b-row>
    </div>
  </div>
</template>
<script>

import {http} from '../util/axiosHttp.js'

import { isEmail } from '../util/isEmail.js'
import { checkPassword } from '../util/checkPassword.js'



export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      passwordAgain: '',
      email: '',
      error: '',
      success: '',
      isLoading: false,
      isError: false,
      isSuccess: false,
      appName: process.env.VUE_APP_NAME,
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
    register: async function() {
      // console.log(process.env.VUE_APP_API_URL);
      try {
        this.isLoading = true;
        //Client side validation
        if(!isEmail(this.email)){
          throw "Poorly formatted email address."
        }
        if(!checkPassword(this.password)){
          throw "This password does not meet complexity requirements.\n\n Passwords require at least one upper case letter, lower case letter, non alpha symbol and a number."
        }
        if(this.password != this.passwordAgain){
          throw "The two passwords do not match."
        }
        var register = await http().post(`${process.env.VUE_APP_API_URL}/api/users/register`, {
          username: this.username,
          password: this.password,
          email: this.email
        })
        if(register.data.error){
          throw register.data.error;
        }
        if(register.data.isRegistered){
          this.isSuccess = true;
          this.success = "Please check your email to finish the confirmation process.";
          this.makeToast('success', "Hey new user!", this.success);
          this.$router.push('/login'); 

        }
        this.isLoading = false;

      } catch(err) {
        this.isError = true;
        this.error = err;
        this.email = '';
        this.password = '';
        this.passwordAgain = '';
        this.username = '';
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>

</style>
