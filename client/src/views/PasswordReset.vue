<template>
  <div class="my-bg-dark">
    <div class="container pb-4">
      <b-row>
        <b-col md="3"></b-col>


        <b-col md="6" cols="12" class="form-card p-5 mt-4">
          <h2>Reset your password</h2>
          <b-form-group id="password" description="Enter a new password." label-for="input-password">
            <b-form-input type="password" id="input-password" required placeholder="password" v-model="password"></b-form-input>
          </b-form-group>
          <b-form-group id="passwordAgain" description="Enter your new password again." label-for="input-passwordAgain">
            <b-form-input type="password" id="input-passwordAgain" required placeholder="confirm password" v-model="passwordAgain"></b-form-input>
          </b-form-group>
          <b-alert variant="warning" class="mt-4 text-center" show v-if="isError">
            {{ error }}
          </b-alert>

          <div class="button-bar text-right">
            <b-button class="mb-3" type="submit" variant="primary" v-if="!success" @click="resetPassword">change my password</b-button>
            <p>
              <router-link to="/">Help! Contact support here.</router-link>
            </p>
          </div>
        </b-col>

        <b-col md="3"></b-col>
      </b-row>

    </div>
  </div>
</template>
<script>

// import {instance} from '../main.js'
import {http} from '../util/axiosHttp.js'


import { checkPassword } from '../util/checkPassword.js'

export default {
  name: 'PasswordReset',
  data() {
    return {
      username: '',
      password: '',
      passwordAgain: '',
      error: '',
      user: '',
      isError: false,
      success: false,
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
    resetPassword: async function() {
      try {

        if(this.password != this.passwordAgain){
          throw "The two passwords do not match."
        }
        if(!checkPassword(this.password)){
          throw "This password does not meet complexity requirements.\n\n Passwords require at least one upper case letter, lower case letter, non alpha symbol and a number."
        }
        var resetPassword = await http().post(`${process.env.VUE_APP_API_URL}/api/account/reset-password`, {
          resetAttemptId: this.$route.params.id,
          newPassword: this.password,
        })
        if(resetPassword){
          this.makeToast('success', "Password succesfully changed.", "Your password has been updated in our system.");
          this.$router.push('/login'); 
        }

        } catch(err) {
          this.isError = true;
          this.error = err;
          this.password = '';
          this.passwordAgain = '';
      }
    }
  }
}
</script>

<style scoped>

</style>
