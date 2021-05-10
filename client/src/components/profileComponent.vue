<template>
<!-- <body> -->
  <div class="page-content page-container" id="page-content">
    <div class="padding">
        <div class="row d-flex justify-content-center">
            <div class=" col-md-12 ">
                <div class="card user-card-full">
                    <div class="row m-l-0 m-r-0">
                        <div class=" offset-2 col-8 bg-c-lite-green user-profile">
                            <div class="card-block text-center text-white">
                                <div class="m-b-25"> <img v-if="user.gender == 'female'" src="../assets/female.svg" class="img-radius" alt="User-Profile-Image">
                                                     <img v-if="user.gender == 'male'" src="../assets/male.svg" class="img-radius" alt="User-Profile-Image">
                                </div>
                                <h5 class="f-w-600">{{ user.fname }} {{ user.lname }}</h5>
                                <p v-if="myData._id == id">Email: {{ user.email }}</p> 
                                <p v-if="myData._id == id && user.age" >Age: {{ user.age }}</p> 
                                <p v-if="myData._id == id">Gender: {{ user.gender }}</p> 
                                <button v-if="myData._id != id" class="btn btn-lg text-light" style="background-color:cornflowerblue;" @click="follow">{{buttonText}}</button>
                                <!-- <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i> -->
                            </div>
                        </div>
                        <div class="offset-2 col-8"  v-for="blog in blogs" :key="blog._id">
                            <div class="card-block">
                              <div class="dropdown float-right" v-if="blog.author._id === user._id">
                                  <button class="btn mr-2" type="button" style="border:none" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <font-awesome-icon style="color:gray; font-size:20px" :icon="['fas', 'ellipsis-h']"/>
                                  </button>
                                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#" @click.prevent="editBlog(blog._id)">Edit blog</a>
                                    <a class="dropdown-item" href="#" @click.prevent="deleteBlog(blog._id)">Delete blog</a>
                                  </div>
                                </div>
                                 <div class=" text-left mb-2 ml-2">
                                  <p><span style="color:cornflowerblue"><b>{{ blog.author.fname }} {{ blog.author.lname }}</b></span>
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
  <!-- <div class=" container col-8">
    <div class="row mt-1 ">
      <p v-if="error" class="text-danger">{{ error }}</p>
    </div>
    <button v-if="myId._id != id" class="btn btn-info mt-3 btn-lg" @click="follow">{{buttonText}}</button>
    <div
      class="card col-12 text-light bg-dark my-3"
      v-for="blog in blogs"
      :key="blog._id"
    >
      <div class="card-header text-left">
        <h4 style="color: salmon">{{ blog.title }}</h4>
        <span style="color: salmon">{{ blog.author.fname }} {{ blog.author.lname }} , 
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
<!-- </body> -->
</template>

<script>
import UserService from "../services/userService";
import BlogService from "../services/blogService";
import jwt_decode from "jwt-decode";

export default {
  name: "blogComponent",
  data() {
    return {
      blogs: [],
      response:"",
      error: "",
      token:null,
      id: this.$route.params.id,
      myData:"",
      user : {},
      buttonText: ""
    };
  },
  methods: {
      createBlog() {
        this.$router.push('/addBlog');
    },
    async follow(){
        try {
           let res = await UserService.addFollowing(this.id, this.token);
           this.buttonText = res.data;
           console.log(res.data);
        } catch (ex) {
            this.notify({title: "Operation failed", message: ex.message, type: 'error', timeout: 3000});
            // console.log(ex.response);
        }
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

          this.response = await UserService.profile(this.token, this.id);
          console.log(this.response);
          if(this.response.fname) {
            this.user = this.response;
            this.blogs = {};
          }
          else {
            this.blogs = this.response;
            this.user = this.response[0].author;
          };
        } catch (ex) {
            this.notify({title: "Couldn't delete", message: ex.message, type: 'error', timeout: 3000});
          // console.log(ex);
        }
      }
      else this.notify({title: 'Operation cancelled', type: 'info', timeout: 3000});
    },
  },
  async created() {
    try {
      this.token = localStorage.getItem("user");
    //   if(this.token){
    //    let decoded = jwt_decode(localStorage.getItem("user"));
    //    this.user.fname = decoded.fname; 
    //    this.user.lname = decoded.lname; 
    //    this.user.email = decoded.email; 
    //    this.user.age = decoded.age; 
    //    this.user.gender = decoded.gender; 
    //    this.user.myId = decoded._id;
    //    // console.log(decoded);
    //  }

      this.myData = await UserService.me(this.token);
      if(this.id == 'me') this.id = this.myData._id;
        // console.log(this.myData.following.indexOf(this.id));
        // console.log(this.myData.following.length);
        for(let i=0;i<this.myData.following.length; i++){
            if(this.myData.following[0]._id == this.id) {
                this.buttonText = "unfollow";
                break;
            }
        }
      if( this.buttonText == "") this.buttonText = "follow";

      this.response = await UserService.profile(this.token, this.id);
      if(this.response.fname) this.user = this.response;
      else {
        this.blogs = this.response;
        this.user = this.response[0].author;
      };
      // console.log(this.blogs);

    } catch (ex) {
      this.notify({title: "Can't load data", message: ex.message, type: 'error', timeout: 3000});
      // this.error = err.response;
      // console.log(err);
    }
  },
  async updated() {
  //  try {
  //     this.token = localStorage.getItem("user");
  //   //   if(this.token){
  //   //    let decoded = jwt_decode(localStorage.getItem("user"));
  //   //    this.user.fname = decoded.fname; 
  //   //    this.user.lname = decoded.lname; 
  //   //    this.user.email = decoded.email; 
  //   //    this.user.age = decoded.age; 
  //   //    this.user.gender = decoded.gender; 
  //   //    this.user.myId = decoded._id;
  //   //    // console.log(decoded);
  //   //  }

  //     this.myData = await UserService.me(this.token);
  //     if(this.id == 'me') this.id = this.myData._id;
  //       // console.log(this.myData.following.indexOf(this.id));
  //       // console.log(this.myData.following.length);
  //       for(let i=0;i<this.myData.following.length; i++){
  //           if(this.myData.following[0]._id == this.id) {
  //               this.buttonText = "unfollow";
  //               break;
  //           }
  //       }
  //     if( this.buttonText == "") this.buttonText = "follow";;

  //     this.response = await UserService.profile(this.token, this.id);
  //     if(this.response.fname) this.user = this.response;
  //     else {
  //       this.blogs = this.response;
  //       this.user = this.response[0].author;
  //     };
  //     // console.log(this.blogs);

  //   } catch (ex) {
  //     this.notify({title: "Can't load data", message: ex.message, type: 'error', timeout: 3000});
  //     // this.error = err.response;
  //     // console.log(err);
  //   }
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
/* h3 {
  margin: 40px 0 0;
} */
/* ul {
  list-style-type: none;
  padding: 0;
} */
li {
  display: inline-block;
  margin: 0 10px;
  
}
/* a {
  color: #42b983;
} */
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
    padding: 1px 0
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
