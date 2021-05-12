<template>
  <nav class="navbar navbar-expand-lg">
    <img
      src="./assets/animal-1299357_1280.png"
      style="width:50px; height:50px;"
    />
    <router-link class="navbar-brand ml-2" to="/">Blogify</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div
      class="collapse navbar-collapse justify-content-between"
      id="navbarSupportedContent"
    >
      <ul class="navbar-nav ml-4">
        <li>
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li v-if="data">
          <router-link class="nav-link" to="/following">Following</router-link>
        </li>
      </ul>
      <form v-if="data" class="form-inline ml-auto" @submit.prevent="search">
        <input
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          v-model="text"
        />
        <button class="btn" type="submit">Search</button>
      </form>
      <ul class="navbar-nav mr-5 ml-auto">
        <li v-if="!data">
          <router-link class="nav-link " to="/login">Login</router-link>
        </li>
        <li v-if="!data">
          <router-link class="nav-link" to="/register">Register</router-link>
        </li>
        <li v-if="data" class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              src="./assets/female.svg"
              style="width:40px; height:40px;"
              class="mr-2"
              v-if="gender == 'female'"
            />
            <img
              src="./assets/male.svg"
              style="width:40px; height:40px;"
              class="mr-2"
              v-if="gender == 'male'"
            />
            {{ fname }} {{ lname }}
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link
              class="text-secondary ml-3 nav-dropdown-link"
              to="/profile/me"
              @click="profile"
              >My profile
            </router-link>
            <div class="dropdown-divider"></div>
            <router-link
              class="text-secondary ml-3 nav-dropdown-link"
              to="/login"
              @click="logout"
              >Logout</router-link
            >
          </div>
        </li>
      </ul>
    </div>
  </nav>

  <router-view></router-view>
</template>

<script>
import homeComponent from "./components/homeComponent.vue";
import UserService from "./services/userService";
import jwt_decode from "jwt-decode";

export default {
  name: "App",
  components: {
    homeComponent,
  },
  data() {
    return {
      data: localStorage.getItem("user"),
      myInfo: [],
      fname: "",
      lname: "",
      gender: "",
      text: "",
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.go("/login");
    },
    async profile() {
      let token = localStorage.getItem("user");
      if (token) {
        try {
          this.myInfo = await UserService.profile(token);
          this.fname = this.myInfo[0].author.fname;
          this.lname = this.myInfo[0].author.lname;
        } catch (ex) {
          console.log(ex.message);
          // this.notify({
          //   title: "Can't load data",
          //   message: ex.message,
          //   type: "error",
          //   timeout: 3000,
          // });
        }
      }
    },
    search(e) {
      e.preventDefault();
      this.$router.push(`/search/${this.text}`);
      this.text = "";
    },
  },
  created() {
    if (localStorage.getItem("user")) {
      let decoded = jwt_decode(localStorage.getItem("user"));
      this.fname = decoded.fname;
      this.lname = decoded.lname;
      this.gender = decoded.gender;
    }
  },
  notifications: {
    notify: {
      title: "",
      message: "",
      type: "",
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@200;300&display=swap");
.navbar {
  background-color: white;
  padding: 1rem 3rem;
  height: 0rem;
  min-height: 12vh;
}
ul {
  list-style-type: none;
}
a {
  font-family: "Poppins", sans-serif;
  text-decoration: none;
  font-weight: 500px;
  color: rgba(34, 54, 69, 0.7);
}
a:hover {
  color: cornflowerblue;
}
.navbar .navbar-brand a {
  padding: 1rem 0;
  display: block;
  text-decoration: none;
}
.navbar .navbar-brand {
  font-family: "Pacifico", cursive;
  font-size: 2rem;
  color: cornflowerblue;
}
.navbar-toggler {
  background-color: cornflowerblue;
  border: none;
  padding: 10px 6px;
  outline: none;
}
.navbar-toggler span {
  display: block;
  width: 22px;
  height: 2px;
  border: 1px;
  background: #fff;
}
.navbar-toggler span + span {
  margin-left: 4px;
  margin-top: 4px;
  width: 18px;
}
.navbar-toggler span + span + span {
  margin-left: 10px;
  width: 10px;
}
.navbar-expand-lg .navbar-nav .nav-link {
  padding: 2rem 1.2rem;
  font-size: 1.1rem;
  position: relative;
}
.navbar-expand-lg .navbar-nav .nav-link:focus {
  border-bottom: 2px solid cornflowerblue;
  color: cornflowerblue;
}
.nav-dropdown-link {
  font-size: 1rem;
  width: 100%;
  position: relative;
  padding-top: 10px;
  text-decoration: none;
}
.nav-dropdown-link:hover {
  border-bottom: 2px solid cornflowerblue;
}
form .btn {
  background-color: cornflowerblue;
  color: white;
  font-size: 1rem;
}
@media screen and (max-width: 1000px) {
  .navbar {
    height: auto;
  }
}
</style>
