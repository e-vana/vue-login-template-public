<template>
  <div>
    <b-row>
      <b-col md="3"></b-col>
      <b-col md="6" cols="12" class="form-card p-5 mt-4">
        <h2>Hey {{ this.$store.getters.getUser }}, welcome to {{ appName }}!</h2>
        <!-- check to see if user is signed up for a plan, if yes display their current plan -->
        <p>Doesn't look there's anything in the dashboard yet.  Check back later!</p>
      </b-col>
      <b-col md="3"></b-col>
    </b-row>
  </div>
</template>
<script>
import {http} from '../util/axiosHttp.js'

export default {
  name: 'Dashboard',
  data(){
    return{
      appName: process.env.VUE_APP_NAME,
    }
  },
  async mounted(){
    try {
    } catch(err) {
      console.log(err)
    }
  }
}

</script>
<style scoped>


</style>
