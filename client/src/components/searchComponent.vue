<template>
<body>
  <div class="page-content page-container" id="page-content">
    <div class="padding">
      <div class="row mt-5 justify-content-center">
        <h1 v-if="error" class="text-danger">{{ error }}</h1>
      </div>
        <div class="row d-flex justify-content-center">
            <div class=" col-md-12 ">
                <div class="card user-card-full">
                    <div class="row m-l-0 m-r-0">
                        <div class="offset-2 col-8"  v-for="blog in blogs" :key="blog._id">
                            <div class="card-block">
                                <div class="dropdown float-right" v-if="blog.author._id === myId._id">
                                  <button class="btn mr-2" type="button" style="border:none" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <font-awesome-icon style="color:gray; font-size:20px" :icon="['fas', 'ellipsis-h']"/>
                                  </button>
                                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#" @click.prevent="editBlog(blog._id)">Edit blog</a>
                                    <a class="dropdown-item" href="#" @click.prevent="deleteBlog(blog._id)">Delete blog</a>
                                  </div>
                                </div>
                                 <div class=" text-left mb-2 ml-2">
                                  <p><span v-if="token"><router-link style="color: cornflowerblue" :to="{path:`/profile/${blog.author._id}`}"><b>{{ blog.author.fname }} {{ blog.author.lname }} </b></router-link></span>
                                    <span v-if="!token"><b>{{ blog.author.fname }} {{ blog.author.lname }}</b></span>
                                    <span style="color:gray"> - 
                                    {{
                                      ` ${blog.createdAt.getDate()}/${blog.createdAt.getMonth() +
                                        1}/${blog.createdAt.getFullYear()} - ${blog.createdAt.getHours()}:${blog.createdAt.getMinutes()} `
                                    }}
                                  </span></p>
                                </div>
                                <div class=" text-left mb-3">
                                  <img v-if="blog.blogImage" :src="'http://localhost:3000/'+ blog.blogImage" style="width:100%; height:auto;" class="">
                                  <!-- <div class="col-6"> -->
                                  <h2 class="ml-2 mt-2"><b>{{ blog.title }}</b></h2>
                                  <p class="card-text ml-2">
                                    {{ blog.body }}
                                  </p>

                                  <!-- </div> -->
                                </div>
                                <div class="text-right mb-5" v-if="blog.tags.length != 0">
                                  <ul class="list-group list-group-horizontal text-right list-inline">
                                    <li v-for="(tag, index) in blog.tags" :key="index">{{ tag }}</li>
                                  </ul>
                                </div>
                            </div>
                                <hr style="border-color: lightgray;">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="token">
              <button class="btn btn-primary btn-lg" id="fixedbutton" @click="createBlog">+</button>
            </div>
        </div>
    </div>
</div>











  <!-- //! kkkkkkkkkkkkkkkkkkkkkkkk -->
  <!-- <div class=" container col-8">
    <div class="row mt-1">
      <h3 v-if="error" class="text-danger">{{ error }}</h3>
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
  </div> -->
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
      token:null,
      myId:""
    };
  },
  // props:{
  //   text: this.$route.params.text
  // },
  props:["text"],
  methods: {
      createBlog() {
        this.$router.push('/addBlog');
    },
    editBlog(id){
      this.$router.push(`/editBlog/${id}`);
    },
    async deleteBlog(id){
      let res = confirm("Are you sure you want to delete this blog?");
      if(res) {
        try {
          await BlogService.deleteBlog(this.token, id);
          this.notify({title: 'Deleted successfully', type: 'success', timeout: 3000});

          this.blogs = await BlogService.getBlogs(this.token);
        } catch (ex) {
          this.notify({title: "Couldn't delete", message: ex.message, type: 'error', timeout: 3000});
          // console.log(ex);
        }
      }
      else this.notify({title: 'Operation cancelled', type: 'info', timeout: 3000});
    },
  },
  notifications: {
    notify: { 
      title: '',
      message: '',
      type: ''
    }
  },
  async created() {
    // console.log(this.text);
      this.token = localStorage.getItem("user");
      if(this.token){
        this.myId = await UserService.me(this.token);
        try {
          // this.token = localStorage.getItem("user");
          this.blogs = await BlogService.searchBlogs(this.text, this.token);
          this.error="";
          // console.log(this.blogs);

        } catch (ex) {
          this.blogs = [];
          this.error = "No matches found";
          // console.log(err.response.data);
        }
    }
  },
  async updated(){
     try {
      this.token = localStorage.getItem("user");
      this.blogs = await BlogService.searchBlogs(this.text, this.token);
      this.error="";
      // console.log(this.blogs);
    } catch (err) {
      this.blogs = [];
      this.error = "No matches found";
      // console.log(err.response.data);
    }
  },
  notifications: {
      notify: { 
          title: '',
          message: '',
          type: ''
      }
  },
};
</script>

<style scoped>
body{
  background-color: white;
  margin-top: -35px;
}
li {
  display: inline-block;
  margin: 0 10px;
  
}

ul {
  float: right;
}

li {
  border: 1px solid cornflowerblue;
  color: cornflowerblue;
  padding: 5px 10px;
  border-radius: 15px;
}

#fixedbutton {
    position: fixed;
    top: 560px;
    right: 40px; 
    border-radius: 50%;
    background-color: cornflowerblue;
    border-color: cornflowerblue;
}
#dropdownMenuButton:focus{
  border: 0;
  box-shadow: inset 0 0px 2px 0 rgb(105, 105, 105);
}
/* ////////////////////////////////////////////////////////////////////// */

.padding {
    padding: 3rem !important
}

.user-card-full {
    overflow: hidden
}

.card {
    border: none;
}

.m-r-0 {
    margin-right: 0px
}

.m-l-0 {
    margin-left: 0px
}

.bg-c-lite-green {
    background: linear-gradient(to right, #525151, #808080)
}

.user-profile {
    padding: 20px 0
}

.m-b-25 {
    margin-bottom: 20px
}

.img-radius {
    border-radius: 5px;
    width: 100px;
}

h6 {
    font-size: 14px
}

@media only screen and (min-width: 1400px) {
    p {
        font-size: 14px
    }
}

.card-block {
    padding: 1.25rem
}

 .card .card-block p {
    line-height: 25px
}

.m-b-10 {
    margin-bottom: 10px
} 

.b-b-default {
    border-bottom: 1px solid #e0e0e0
}

.f-w-600 {
    font-weight: 600
}

.m-b-20 {
    margin-bottom: 20px
}

.m-t-40 {
    margin-top: 20px
}

.p-b-5 {
    padding-bottom: 5px !important
}

.m-b-10 {
    margin-bottom: 10px
}

.m-t-40 {
    margin-top: 20px
}

.user-card-full .social-link li {
    display: inline-block
}

.user-card-full .social-link li a {
    font-size: 20px;
    margin: 0 10px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out
}
</style>
