<template>
<div class="my-bg-dark">
  <div class="container pb-4">
    <b-row>
      <b-col md="2">
      </b-col>
      <b-col  md="8" cols="12" class="form-card p-5 mt-4">
          <h2 class="mb-4">Thanks for registering for {{ appName }}!</h2>
          <b-alert show class="text-center p-5">
            <p>To get started, please click the login button below.</p> 
            <b-button to="/login" variant="primary">Login</b-button>
          </b-alert>


      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
</div>
</template>
<script>

// import {instance} from '../main.js'
import {http} from '../util/axiosHttp.js'

export default {
  name: 'ConfirmEmail',
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
  },
  created: async function(){
    //check to see if the account exists
    //if the account exists, set the DB flag to confirm the user
    try {
      var params = this.$route.params.id;
      // console.log(params);

      var confirmedEmail = await http().get(`${process.env.VUE_APP_API_URL}/api/users/confirm-email/${params}`);

      if(!confirmedEmail){
        throw "There was a problem confirming your email address."
      }

    }catch(err){
      console.log(err);
    }
  }
}
</script>

<style scoped>

</style>
