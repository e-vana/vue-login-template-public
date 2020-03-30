<template>
  <div v-if="!isLoading">
    <b-container>
      <b-row>
        <b-col class="form-card p-5 mt-4">
          <h2>User Data</h2>
          <b-table responsive striped hover :items="items"></b-table>
          <b-button class="mb-2" @click="changePermission('isLocked', true)" v-if="!this.items[0].isLocked" variant="danger">Lock Account</b-button>
          <b-button class="mb-2" @click="changePermission('isLocked', false)" v-if="this.items[0].isLocked" variant="danger">Unlock Account</b-button>
          <br>
          <b-button class="mb-2" @click="changePermission('isAdmin', true)" v-if="!this.items[0].isAdmin" variant="info">Give Admin Permission</b-button>
          <b-button class="mb-2" @click="changePermission('isAdmin', false)" v-if="this.items[0].isAdmin" variant="info">Remove Admin</b-button>
          <br>
          <b-button class="mb-2" @click="changePermission('isSupport', true)" v-if="!this.items[0].isSupport" variant="secondary">Give Support Permission</b-button>
          <b-button class="mb-2" @click="changePermission('isSupport', false)" v-if="this.items[0].isSupport" variant="secondary">Remove Support Permission</b-button>

        </b-col>
      </b-row>
    </b-container>

  </div>

</template>
<script>

// import {instance, instanceAdmin} from '../main.js'
import {httpAuth} from '../util/axiosHttp.js'
import { cookies } from 'vue-cookies';





export default {
  name: 'AdminUser',
  data(){
    return{
      items: [

      ],
      isLoading: true,
    }
  },
  methods: {
    changePermission: async function(permission, value){
      try {
        var idParam = this.$route.params.id;
        var changePermission = await httpAuth().post(`${process.env.VUE_APP_API_URL}/api/users/${idParam}/change-permission/${permission}-${value}`)
        console.log(changePermission);
        this.$set(this.items, 0, changePermission.data);
        // this.$router.go();
      }catch(err){
        console.log(err);
      }
    }
  },
  created: async function(){
    try {
      this.isLoading = true;
      var idParam = this.$route.params.id;
      var allUsers = await httpAuth().get(`${process.env.VUE_APP_API_URL}/api/users/${idParam}`);
      this.$set(this.items, 0, allUsers.data);
      this.isLoading = false;

    } catch(err) {
      console.log(err);
    }
  }
}

</script>
<style>

</style>
