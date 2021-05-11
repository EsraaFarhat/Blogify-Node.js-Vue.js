<template>
  <body>
    <div class="container">
      <div class="img">
        <img src="../assets/blog.svg" alt="" />
      </div>
      <div class="login-content">
        <form method="get" @submit.prevent="checkForm" novalidate="true">
          <h2 class="text-center">Welcome</h2>
          <span v-if="errors.exception" class="text-danger text-right">
            {{ errors.exception }}</span
          >
          <div class="input-div one">
            <div class="i">
              <font-awesome-icon :icon="['fas', 'envelope']" />
            </div>
            <div class="div">
              <input
                type="email"
                class="form-control mt-2"
                id="email"
                placeholder="Email"
                v-model="user.email"
              />
            </div>
          </div>
          <span v-if="errors.email" class="text-danger text-right">
            {{ errors.email }}</span
          >
          <div class="input-div pass">
            <div class="i">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </div>
            <div class="div">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                v-model="user.password"
              />
            </div>
          </div>
          <span v-if="errors.password" class="text-danger text-right">
            {{ errors.password }}</span
          >
          <div id="buttons">
            <button class="btn" type="submit">login</button>
          </div>
          <div class=" row justify-content-around mt-3">
            <p>
              Don't have an account?
              <router-link to="/register">Register</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </body>
</template>

<script>
import AuthService from "../services/authService";
export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    checkForm: async function(e) {
      this.errors = {};
      if (!this.emailValidation(this.user.email)) {
        this.errors.email = "Email not valid.";
      }
      if (!this.passwordValidation(this.user.password)) {
        this.errors.password = "Password not valid.";
      }
      if (
        this.errors &&
        Object.keys(this.errors).length === 0 &&
        this.errors.constructor === Object
      ) {
        try {
          let token = await AuthService.loginRequest(this.user);
          this.notify({
            title: "Welcome back :)",
            type: "success",
            timeout: 3000,
          });
          localStorage.setItem("user", token.data);
          setTimeout(() => {
            this.$router.go("/");
          }, 500);
        } catch (ex) {
          this.notify({
            title: "Login failed",
            message: ex.message,
            type: "error",
            timeout: 3000,
          });
        }
      }

      e.preventDefault();
    },
    emailValidation: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    passwordValidation: function(password) {
      return password.length >= 5 && password.length <= 255;
    },
  },
  created() {
    let token = localStorage.getItem("user");
    if (token) this.$router.push("/");
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
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.container {
  width: 100vw;
  height: 90vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10rem;
  padding: 4 2rem;
}
.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.login-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.img img {
  width: 400px;
}

form {
  margin-top: -50px;
  width: 360px;
}
.login-content h2 {
  margin: 15px 0;
  color: #33b1ff;
  text-transform: uppercase;
  font-size: 2.5rem;
}
.login-content .input-div {
  position: relative;
  display: grid;
  grid-template-columns: 8% 92%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #33b1ff;
  margin-bottom: 10px;
}

.login-content .input-div.one {
  margin-top: 0;
}
.i {
  padding-top: 15px;
  color: #969494;
  display: flex;
  justify-content: center;
  align-items: center;
}

.i font-awesome-icon {
  transition: 0.3s;
}
.input-div > div {
  position: relative;
  height: 45px;
}
.input-div > div > input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  margin: 0.5rem 0;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: #555;
}

a {
  text-align: right;
  text-decoration: none;
  color: #33b1ff;
  font-size: 1rem;
  transition: 0.3s;
  font-weight: bold;
}

.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #4dbafd, #33b1ff, #0ea3ff);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  text-transform: uppercase;
  margin: 1rem 0;
  transition: 0.5s;
}
.btn:hover {
  background-position: right;
}

@media screen and (max-width: 1050px) {
  .container {
    grid-gap: 5rem;
  }
}

@media screen and (max-width: 1000px) {
  form {
    width: 290px;
  }

  .login-content h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img img {
    width: 400px;
  }
}

@media screen and (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }

  .img {
    display: none;
  }

  .wave {
    display: none;
  }

  .login-content {
    justify-content: center;
  }
}
input:focus {
  box-shadow: inset 0 0px 0 #ddd;
}
</style>
