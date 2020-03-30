<template>
  <div>
    <!-- <b-container>
      <b-row>
        <b-col  class="form-card p-5 mt-4">
          <h2>Users</h2>
          <b-table @row-clicked="itemInfo" responsive striped hover :items="items"></b-table>
        </b-col>
      </b-row>
    </b-container> -->

<b-container>
  <b-row>
    <b-col class="form-card p-5 mt-4">
      <div id="table">

        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>

        <b-input-group size="sm" class="mt-3 mb-3">
          <b-form-input v-model="keyword" placeholder="search" type="text" class="mb-4"></b-form-input>
          <b-table id="my-table" @row-clicked="itemInfo" responsive striped hover :fields="fields" :items="items" :keyword="keyword" :per-page="perPage" :current-page="currentPage"></b-table>
        </b-input-group>
      </div>
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
  name: 'AdminUsers',
  data(){
    return{
      dataArray: [],
      keyword: '',
      fields: [
				{key: '_id', label: 'ID', sortable: true},
				{key: 'username', label: 'Username', sortable: true},
				{key: 'email', label: 'Email', sortable: true}
      ],
      perPage: 20,
      currentPage: 1,
    }
  },
  methods: {
    itemInfo: function(record, index){
      // console.log(record)
      this.$router.push(`/admin/user/${record._id}`)

    }
  },
  created: async function(){
    try {
      var allUsers = await httpAuth().get(`${process.env.VUE_APP_API_URL}/api/users/all`);
      this.dataArray = allUsers.data;
      // console.log(allUsers.data);


    } catch(err) {
      console.log(err);
    }
  },
  computed: {
		items () {
    
			return this.keyword
				? this.dataArray.filter(item => item._id.toLowerCase().includes(this.keyword.toLowerCase()) || item.username.toLowerCase().includes(this.keyword.toLowerCase()) || item.email.toLowerCase().includes(this.keyword.toLowerCase()))
				: this.dataArray
    },
    rows() {
        return this.dataArray.length
    }
	}
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
  transition: .3s ease-in-out;
  text-align: center;
}



</style>
