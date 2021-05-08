<template>
    <div class="container">
        <form id="app" class="row justify-content-center" method="post" action="#" @submit.prevent="checkForm" enctype="multipart/form-data">
        <h1 class="text-primary mt-2">add blog</h1>
            <div class="mb-3 col-12">
                <p v-if="errors.length">
                    <ul>
                        <li v-for="(error, index) in errors" class="alert alert-danger" :key="index">{{ error }}</li>
                    </ul>
                </p>
            </div>
            <div class="mb-3 col-8">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" v-model="blog.title" maxlength="100">
            </div>
            <div class="mb-3 col-8">
                <label for="body" class="form-label">Body</label>
                <textarea name="body" id="body" class="form-control" v-model="blog.body"></textarea>
            </div>
            <div class="mb-3 col-8">
                <label for="file-input" class="form-label">Upload an image </label>
                <input type="file" class="ml-2" accept="image/*" @change="uploadImage($event)" id="file-input">
            </div>

            <div class="mb-3 col-8">
                <label for="tags" class="form-label">Tags</label>
                <input type="text" class="form-control" id="tags" v-model="blog.tags">
            </div>
            <button type="submit" class="btn btn-primary col-8 mb-5" >Add blog</button>
        </form>
    </div>
</template>

<script>
import BlogService from "../services/blogService";
import axios from 'axios';

export default {
    data: () => ({
        blog: {
            title: "",
            body: "",
            img:null,
            tags: ""
        },
        tagsAsString: "",
        errors: [],
        data: null,
    }),
    methods: {
        checkForm: async function(e){
            this.errors = []
            if (!this.titleValidation(this.blog.title)) {
                this.errors.push('Title not valid.');
            }
            if (!this.bodyValidation(this.blog.body)) {
                this.errors.push('Body not valid.');
            }

            if (this.errors.length == 0) {
                // this.blog.tags = this.tagsAsString.split(',');
                // if(this.blog.tags[0] == "") this.blog.tags = [];
                this.data = new FormData();
                this.data.append('blogImage', this.blog.img); 
                this.data.append('title', this.blog.title); 
                this.data.append('body', this.blog.body); 
                this.data.append('tags', this.blog.tags); 
                // console.log(typeof(this.data.get('blogImage')) );
                // console.log(typeof(this.blog.img) );
                console.log(this.blog.tags);
                try {
                    let token = localStorage.getItem("user");
                    await BlogService.createBlog(this.data, token);
                    // alert("Added...")
                    // this.blog = await BlogService.getBlogs();
                    this.$router.push('/');
                } catch (ex) {
                  this.errors.push(ex.response.data);
                  console.log(ex.response.data);
                }
                // try{
                //     let token = await AuthService.loginRequest(this.inputs);
                //     // console.log(token.data);
                //     localStorage.setItem("user", token.data);
                //     this.$router.push('/');
                //     return true;
                // } catch(ex){
                //     this.errors.push(ex.response.data);
                //     // console.log(ex.response.data);
                // }
            }

            e.preventDefault();
        },
        titleValidation:function(title){
            return title.length >= 3 && title.length <= 100;
        },
        bodyValidation:function(body){
            return body.length >= 3;
        },
        uploadImage(event) {
            this.blog.img = event.target.files[0];

            // const URL = 'http://foobar.com/upload'; 

            this.data = new FormData();
            // this.data.append('name', 'blogImage');
            this.data.append('blogImage', this.blog.img); 
            this.data.append('title', this.blog.title); 
            this.data.append('body', this.blog.body); 
            this.data.append('tags', this.blog.tags); 

            // this.blog = data;
            // console.log(data);
            // let config = {
            //     header : {
            //         'Content-Type' : 'image/png'
            //     }
            // }
            // console.log(event.target.files[0]);

            // axios.put(
            //     URL, 
            //     data,
            //     config
            //     ).then(
            //         response => {
            //             console.log('image upload response > ', response)
            //         }
            //     )
        }

                
    },
}
</script>