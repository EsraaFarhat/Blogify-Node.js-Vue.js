<template>
  <body>
    <div class="container">
      <div class="img">
        <img src="../assets/blog.svg" alt="" />
      </div>
      <div class="login-content">
        <form method="get" @submit.prevent="checkForm" novalidate="true">
          <h2 class="text-center">Sign up</h2>
          <div class="input-div one">
            <div class="div">
              <input
                type="text"
                class="form-control mt-2"
                id="fname"
                name="fname"
                v-model="user.fname"
                placeholder="First name"
              />
            </div>
          </div>
          <span v-if="errors.fname" class="text-danger text-right">
            {{ errors.fname }}</span
          >
          <div class="input-div">
            <div class="div">
              <input
                type="text"
                class="form-control"
                id="lname"
                name="lname"
                v-model="user.lname"
                placeholder="Last name"
              />
            </div>
          </div>
          <span v-if="errors.lname" class="text-danger text-right">
            {{ errors.lname }}</span
          >
          <div class="input-div">
            <div class="div">
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                placeholder="Email"
                v-model="user.email"
              />
            </div>
          </div>
          <span v-if="errors.email" class="text-danger text-right">
            {{ errors.email }}</span
          >
          <div class="input-div">
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
          <div class="input-div">
            <div class="div">
              <input
                type="number"
                class="form-control no-border"
                id="age"
                name="age"
                v-model="user.age"
                placeholder="Age"
              />
            </div>
          </div>
          <span v-if="errors.age" class="text-danger text-right">
            {{ errors.age }}</span
          >
          <div class="div text-center">
            <div class="form-check form-check-inline col-4 form-control-lg">
              <input
                class="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
                v-model="user.gender"
              />
              <label class="form-check-label" for="male">Male</label>
            </div>
            <div class="form-check form-check-inline col-4 form-control-lg">
              <input
                class="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                v-model="user.gender"
              />
              <label class="form-check-label" for="female">Female</label>
            </div>
          </div>
          <span v-if="errors.gender" class="text-danger text-right">
            {{ errors.gender }}</span
          >
          <div>
            <button class="btn" type="submit">Submit</button>
            <button class="btn" type="reset">Reset</button>
          </div>
        </form>
      </div>
    </div>
  </body>
</template>

<script>
import UserService from "../services/userService";
export default {
  data() {
    return {
      user: {
        fname: "",
        lname: "",
        email: "",
        password: "",
        gender: "",
      },
      errors: {},
    };
  },
  methods: {
    checkForm: async function(e) {
      this.errors = {};
      if (!this.nameValidation(this.user.fname)) {
        this.errors.fname = "First name not valid.";
      }
      if (!this.nameValidation(this.user.lname)) {
        this.errors.lname = "Last name not valid.";
      }
      if (!this.emailValidation(this.user.email)) {
        this.errors.email = "Email not valid.";
      }
      if (!this.passwordValidation(this.user.password)) {
        this.errors.password = "Password not valid.";
      }
      if (!this.ageValidation(this.user.age)) {
        this.errors.age = "Age not valid.";
      }
      if (!this.genderValidation(this.user.gender)) {
        this.errors.gender = "Gender not valid.";
      }

      if (
        this.errors &&
        Object.keys(this.errors).length === 0 &&
        this.errors.constructor === Object
      ) {
        try {
          await UserService.createUser(this.user);
          this.notify({
            title: '"User registerd successfully"',
            type: "success",
            timeout: 3000,
          });
          this.$router.push("/login");
        } catch (ex) {
          this.notify({
            title: "Sign up failed",
            message: ex.message,
            type: "error",
            timeout: 3000,
          });
        }
      }

      e.preventDefault();
    },
    nameValidation: function(name) {
      return name.length >= 3 && name.length <= 50 ? true : false;
    },
    emailValidation: function(email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    passwordValidation: function(password) {
      return password.length >= 5 && password.length <= 255;
    },
    ageValidation: function(age) {
      if (age == null) return true;
      return age >= 1 && age <= 100 ? true : false;
    },
    genderValidation: function(gender) {
      return gender != "" ? true : false;
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
  margin: 5px 0;
  margin-top: 70px;
  color: #33b1ff;
  text-transform: uppercase;
  font-size: 2.2rem;
}
.login-content .input-div {
  position: relative;
  display: grid;
  grid-template-columns: 100% 0%;
  margin: 5px 0;
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
  width: 40%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #4dbafd, #33b1ff, #0ea3ff);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  text-transform: uppercase;
  margin: 1rem 1rem;
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
  .btn {
    width: 30%;
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
.no-border {
  border: 0;
  box-shadow: none;
}
</style>
