<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand ml-4" href="#"><router-link class="text-light m-2" to="/"><b>Blogify</b></router-link></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
        <router-link class="nav-link" to="/"><b>Home</b></router-link>
      </li>
      <li v-if="data" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
        <router-link class="nav-link" to="/following">Following</router-link>
      </li>
    </ul>
    <form v-if="data" class="form-inline mr-auto my-lg-0" @submit.prevent="search">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="text">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
    <ul class="navbar-nav mr-5">
      <li v-if="!data" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
        <router-link class="text-light m-2" to="/login">Login</router-link>
      </li>
      <li v-if="!data" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
        <router-link class="text-light m-2" to="/register">Register</router-link>
      </li>
    <li v-if="data" class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{fname}} {{lname}}
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link class="text-dark ml-3" to='/profile/me' @click="profile">My profile </router-link>
          <div class="dropdown-divider"></div>
            <router-link class="text-dark ml-3" to='/login' @click="logout">Logout</router-link>
        </div>
      </li>
    </ul>
  </div>
</nav>

  <router-view ></router-view>
</template>

<script>
import homeComponent from "./components/homeComponent.vue";
import UserService from "./services/userService"

export default {
  name: "App",
  components: {
    homeComponent,
  },
  data(){
    return{
      data: localStorage.getItem('user'),
      myInfo:[],
      fname:"",
      lname:"",
      text: ""
    }
  },
  methods:{
    logout(){
      localStorage.removeItem('user');
      this.$router.go('/login');
    },
    async profile(){
      try{
      this.myInfo = await UserService.profile(this.data, 'me');
      this.fname = this.myInfo[0].author.fname; 
      this.lname = this.myInfo[0].author.lname; 
      }catch(ex){
        console.log(ex.response);
      }
    },
    search(e){
      e.preventDefault();
      this.$router.push(`/search/${this.text}`);
      this.text="";
    }
  },
  async created(){
    try{
      this.myInfo = await UserService.profile(this.data, 'me');
      this.fname = this.myInfo[0].author.fname; 
      this.lname = this.myInfo[0].author.lname; 
    }catch(ex){
      console.log(ex.response);
    }
  },
};
</script>

<style>

</style>
