<template>
<div class="my-bg-dark">
  <div class="container pb-4">
    <b-row>
      <b-col md="3">
      </b-col>
      <b-col md="6" cols="12" class="form-card p-5 mt-4">
        <b-form @submit.prevent="forgotPassword">
          <h2>Forgot your password?</h2>

          <b-form-group id="email" description="Enter your email address and we'll send you a reset link." label-for="input-email">
            <b-form-input id="input-email" required placeholder="email" v-model="email"></b-form-input>
          </b-form-group>

          <div class="button-bar text-right">
            <b-button class="mb-3 " type="submit" variant="primary"><b-spinner small v-if="isLoading"/><div v-if="!isLoading">Send Reset Email</div></b-button>

          </div>
        </b-form>
        <b-alert variant="warning" class="mt-4 text-center" show v-if="isError">{{ error }}</b-alert>
      </b-col>
      <b-col md="6"></b-col>
    </b-row>
  </div>
</div>
</template>
<script>

// import {instance} from '../main.js'
import {http} from '../util/axiosHttp.js'
import { isEmail } from '../util/isEmail.js'



export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      error: '',
      isError: false,
      isLoading: false,
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
    forgotPassword: async function() {
      try {
        this.isLoading = true;
        if(!isEmail(this.email)){
          throw "Please enter a valid email address."
        }
        if(this.email == ''){
          throw "Please enter an email address."
        }
        var forgotPassword = await http().post(`${process.env.VUE_APP_API_URL}/api/account/reset-password-request`, {
          email: this.email
        })
        if(forgotPassword){
          this.makeToast('success', "We received your reset request.", "Check your email and click the link from us to continue the reset process.")
          this.isLoading = false;
        }
      } catch(err) {
        this.isError = true;
        this.isLoading = false;
        // this.error = forgotPassword.data.error
        this.error = err;
      }

    }
  },
}
</script>

<style scoped>

</style>
