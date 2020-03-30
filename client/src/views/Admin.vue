<template>
  <div>
    <b-row>
      <b-col md="2"></b-col>
      <b-col md="8" cols="12" class="form-card p-5 mt-4">


        <div class="icon-container">

          <router-link to ="/admin/users">
          <div class="icon-card">
            <div>
              <b-icon class="h2 mb-2" icon="people"></b-icon>
            </div>
            <div>
              Users
            </div>
          </div>
          </router-link>

          <div class="icon-card">
            <div>
              <b-icon class="h2 mb-2" icon="envelope-open"></b-icon>
            </div>
            <div>
              Tickets
            </div>
          </div>

          <div class="icon-card">
            <div>
              <b-icon class="h2 mb-2" icon="graph-up"></b-icon>
            </div>
            <div>
              Statistics
            </div>
          </div>

        </div>


      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>

</template>
<script>

// import {instance, instanceAdmin} from '../main.js'
import {httpAuth} from '../util/axiosHttp.js'

import makeToast from '../mixins/makeToast.js'

export default {
  name: 'Admin',
  mixins: [makeToast],
  data(){
    return{
      openTickets: 0,
      openTicketsHigh: 0
    }
  },
  methods: {

  }
  // created: async function(){
  //   try {
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }
}

</script>
<style>

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-card {
  padding: 20px;
  margin: 10px;
  text-align: center;
}
.icon-card:hover {
  color: inherit;
}

</style>
