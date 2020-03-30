<template>
  <div class="home">
    <div>
      <b-row>
        <b-col md="2"></b-col>
        <b-col md="8" cols="12" class="form-card p-5 mt-4">
          <h2>Thanks for checking out Vue Login Template.</h2>
          <p>This project was built to learn several concepts across a full stack application creating a login system.  The front end is build in VueJS utilizing Vuex for state management and Vue Router for routing.</p>
          <p>The backend API is an Express server utilizing Mongoose and MongoDB.</p>

          <h3>View the source code on github <a href="http://www.github.com/e-vana">here.</a></h3>
          <hr>


          <b-alert show v-if="$store.getters.loginState==false" class="text-center p-5">
            <h3>Make an account and try it out!</h3>
            <router-link v-if="$store.getters.loginState==false" to="/login"><b-button class="mr-2" variant="primary">Login</b-button></router-link>
            <router-link v-if="$store.getters.loginState==false" to="/register"><b-button class="mr-2" variant="primary">Register</b-button></router-link>
          </b-alert>
          
          <b-alert show v-if="$store.getters.loginState==true">Thanks for trying out this application!</b-alert>

          <hr>



          <h5>Want more information about what this application does or how it works?</h5>
          <router-link to="/breakdown"><b-button class="mr-2" variant="primary">View in-depth breakdown</b-button></router-link>

        </b-col>
        <b-col md="2"></b-col>
      </b-row>
    </div>



  
  </div>
</template>

 
<script>

export default {
  name: 'home',
  components: {
  }
}
</script>
<style scoped>
.image-container {
  height: 300px;
  width:100%;
  object-fit: cover;

}
.image-container img {
  height: 300px;
  object-fit: cover;
}
</style>
