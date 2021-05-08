<template>
<body>
  <div class=" container col-8">
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
  </div>
</body>
</template>

<script>
import UserService from "../services/userService";
export default {
  name: "blogComponent",
  data() {
    return {
      blogs: [],
      error: "",
      token:null,
      id: this.$route.params.id,
      myId : '',
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
            console.log(ex.response);
        }
    }
  },
  async created() {
    try {
      this.token = localStorage.getItem("user");

      this.myId = await UserService.me(this.token);
      if(this.id == 'me') this.id = this.myId._id;
        console.log(this.myId.following.indexOf(this.id));
        console.log(this.myId.following.length);
        for(let i=0;i<this.myId.following.length; i++){
            if(this.myId.following[0]._id == this.id) {
                this.buttonText = "unfollow";
                break;
            }
        }
      if( this.buttonText == "") this.buttonText = "follow";;

      this.blogs = await UserService.profile(this.token, this.id);

    } catch (err) {
      this.error = err.response;
      console.log(err);
    }
  },
};
</script>

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
