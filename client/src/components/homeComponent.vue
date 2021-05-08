<template>
<body>
  <div class=" container col-8">
    <div class="row mt-1 ">
      <p v-if="error" class="text-danger">{{ error }}</p>
    </div>
    <div
      class="card col-12 text-light bg-dark my-3"
      v-for="blog in blogs"
      :key="blog._id"
    >
      <div class="card-header text-left">
        <h4 style="color: salmon">{{ blog.title }}</h4>
        <span style="color: salmon" v-if="!token" >{{ blog.author.fname }} {{ blog.author.lname }}, 
          {{
            ` ${blog.createdAt.getDate()}/${blog.createdAt.getMonth() +
              1}/${blog.createdAt.getFullYear()} - ${blog.createdAt.getHours()}:${blog.createdAt.getMinutes()} `
          }}
        </span>
        <span style="color: salmon" v-if="token" ><router-link style="color: salmon" :to="{path:`/profile/${blog.author._id}`}">{{ blog.author.fname }} {{ blog.author.lname }} </router-link>, 
          {{
            ` ${blog.createdAt.getDate()}/${blog.createdAt.getMonth() +
              1}/${blog.createdAt.getFullYear()} - ${blog.createdAt.getHours()}:${blog.createdAt.getMinutes()} `
          }}
        </span>
        <!-- <h6 class="text-warning">{{ blog.author.fname }} {{ blog.author.lname }}</h6> -->
        
      </div>
      <div class="card-body text-left">
        <img v-if="blog.blogImage" :src="'http://localhost:3000/'+ blog.blogImage" style="width:100px; height:100px">
        <h4 class="card-text">
          {{ blog.body }}
        </h4>
      </div>
      <div class="card-footer text-right" v-if="blog.tags.length != 0">
        <ul class="list-group list-group-horizontal text-right list-inline">
          <li v-for="(tag, index) in blog.tags" :key="index">{{ tag }}</li>
        </ul>
      </div>
    </div>
    <div class="row" v-if="token">
      <button class="btn btn-primary btn-lg" id="fixedbutton" @click="createBlog">+</button>
    </div>
  </div>
</body>
</template>

<script>
import BlogService from "../services/blogService";
import UserService from '../services/userService';
export default {
  name: "blogComponent",
  data() {
    return {
      blogs: [],
      error: "",
      myId: "",
      token:null
    };
  },
  methods: {
      createBlog() {
        this.$router.push('/addBlog');
      // try {
      //   await BlogService.createBlog(this.text);
      //   this.blogs = await BlogService.getBlogs();
      // } catch (ex) {
      //   this.error = ex;
      //   console.log(ex);
      // }
    },
  },
  async created() {
    try {
      this.token = localStorage.getItem("user");
      this.myId = UserService.me(this.token);
      this.blogs = await BlogService.getBlogs(this.token);
    } catch (err) {
      this.error = err.response.data;
      // console.log(err.response.data);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body{
  background-color: lightgray;
  background-size: 100% 100%;
  /* height: 800px; */
  margin-top: -10px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
ul {
  float: right;
}

li {
  border: 1px solid salmon;
  color: salmon;
  padding: 5px 10px;
  border-radius: 15px;
}
#fixedbutton {
    position: fixed;
    top: 560px;
    right: 40px; 
    border-radius: 50%;
    background-color: salmon;
    border-color: salmon;
}
</style>
