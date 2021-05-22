<template>
  <div class="container d-flex">
    <div class="row justify-content-center align-items-center">
      <div class="img  col-4 mx-5">
        <img src="../assets/bogging1.svg" />
      </div>
      <div class="login-content ml-4 col-6">
        <form method="get" @submit.prevent="checkForm" novalidate="true">
          <div class="input-div one">
            <div class="div">
              <label for="title" class="form-label">Title</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="blog.title"
                maxlength="100"
              />
            </div>
          </div>
          <span v-if="errors.title" class="text-danger text-right">
            {{ errors.title }}</span
          >
          <div class="input-div">
            <div class="div mb-4">
              <label for="body" class="form-label">Body</label>
              <textarea
                name="body"
                id="body"
                class="form-control w-100 vh-25 no-border"
                v-model="blog.body"
              ></textarea>
            </div>
          </div>
          <span v-if="errors.body" class="text-danger text-right">
            {{ errors.body }}</span
          >
          <div class="input-div">
            <div class="div">
              <label for="file-input" class="form-label"
                >Upload an image
              </label>
              <input
                type="file"
                class="ml-2"
                accept="image/*"
                @change="uploadImage($event)"
                id="file-input"
              />
            </div>
          </div>
          <div class="input-div">
            <div class="div">
              <label for="tags" class="form-label">Tags</label>
              <input
                type="text"
                class="form-control"
                id="tags"
                v-model="blog.tags"
              />
            </div>
          </div>
          <div>
            <button type="submit" class="btn">Add blog</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import BlogService from "../services/blogService";
import axios from "axios";

export default {
  data: () => ({
    blog: {
      title: "",
      body: "",
      img: null,
      tags: "",
    },
    errors: {},
    data: null,
  }),
  methods: {
    checkForm: async function(e) {
      this.errors = {};
      if (!this.titleValidation(this.blog.title)) {
        this.errors.title = "Title not valid.";
      }
      if (!this.bodyValidation(this.blog.body)) {
        this.errors.body = "Body not valid.";
      }

      if (
        this.errors &&
        Object.keys(this.errors).length === 0 &&
        this.errors.constructor === Object
      ) {
        if(this.blog.img){
          let img = new FormData();
          img.append("file", this.blog.img);
          img.append("upload_preset", "Blogify");
          img.append("cloud_name", "dc7kn9h2m");
          await fetch(" https://api.cloudinary.com/v1_1/dc7kn9h2m/image/upload",{
            method: "post",
            body: img
          })
          .then(res => res.json())
          .then(data => this.blog.imgUrl = data.url)
          .catch(err => conole.log(err))
        }

        this.data = new FormData();
        this.data.append("blogImage", this.blog.imgUrl);
        this.data.append("title", this.blog.title);
        this.data.append("body", this.blog.body);
        this.data.append("tags", this.blog.tags);
        try {
          let token = localStorage.getItem("user");
          await BlogService.createBlog(this.data, token);
          this.notify({
            title: "Blog created successfully",
            type: "success",
            timeout: 3000,
          });
          this.$router.push("/");
        } catch (ex) {
          this.notify({
            title: "Operation failed",
            message: ex.message,
            type: "error",
            timeout: 3000,
          });
        }
      }

      e.preventDefault();
    },
    titleValidation: function(title) {
      return title.length >= 3 && title.length <= 100;
    },
    bodyValidation: function(body) {
      return body.length >= 3;
    },
    uploadImage(event) {
      this.blog.img = event.target.files[0];

      this.data = new FormData();
      this.data.append("blogImage", this.blog.imgUrl);
      this.data.append("title", this.blog.title);
      this.data.append("body", this.blog.body);
      this.data.append("tags", this.blog.tags);
    },
  },
  notifications: {
    notify: {
      title: "",
      message: "",
      type: "",
      imgUrl:""
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
  height: 90vh;
  margin: 0rem 4rem;
}
.img img {
  width: 90%;
  margin-top: -35%;
}

form {
  margin-top: -50px;
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
  padding: 20px 0;
  border-bottom: 2px solid #33b1ff;
  margin-bottom: 10px;
}
textarea {
  border-bottom: 2px solid #33b1ff;
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
  height: 40px;
  padding-left: 5px;
}
.input-div > div > input {
  position: absolute;
  left: 0;
  top: 10px;
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
.input-div > div > input[type="file"] {
  top: 8px;
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
  margin: 1.5rem 0;
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
input:focus,
textarea:focus {
  box-shadow: inset 0 0px 0 #ddd;
}
.no-border {
  border: 0;
  box-shadow: none;
}
</style>
