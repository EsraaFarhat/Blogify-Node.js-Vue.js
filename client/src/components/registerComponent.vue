<template>
<body>
    <div class="container jumbotron align-items-center col-md-6">
        <h2 class="align-middle">Register with us</h2>
        <form class="needs-validation" method="get" @submit.prevent="checkForm" novalidate="true">
            <div class="mb-3 col-12">
                <p v-if="errors.length">
                    <ul>
                        <li v-for="(error, index) in errors" :key="index" >{{ error }}</li>
                    </ul>
                </p>
            </div>
            <div class="col-md-12 mb-3" >
                <input type="text" class="form-control mt-2" id="fname" name="fname" v-model="user.fname" placeholder="First name">
               
            </div>
            <div class="col-md-12 mb-3">
                <input type="text" class="form-control" id="lname" name="lname" v-model="user.lname" placeholder="Last name">
                
            </div>
            <div class="col-md-12 mb-3">
                <input type="email" class="form-control" id="email" name="email" placeholder="Email" v-model="user.email">
                
            </div>
            <div class="col-md-12 mb-3">
                <input type="password" class="form-control" id="password" name="password" v-model="user.password" placeholder="Password">
            </div>
            <div class="col-md-12 mb-3">
                <input type="number" class="form-control" id="age" name="age" v-model="user.age" placeholder="Age">
            </div >
            <div class="row text-light justify-content-center">
                <!-- <h5 class="col-3" style="margin-top: 10px; margin-left: 16px">Gender</h5> -->
                <div class="form-check form-check-inline col-4 form-control-lg">
                    <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="user.gender">
                    <label class="form-check-label" for="male">Male</label>
                </div>
                <div class="form-check form-check-inline col-4 form-control-lg">
                    <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="user.gender">
                    <label class="form-check-label" for="female">Female</label>
                </div>
            </div>
            <div id="buttons">
            <button class="btn btn-primary mt-4 col-4 " type="submit">Submit</button>
            <button class="btn btn-primary mt-4 offset-1 col-4" type="reset">Reset</button>
        </div> 
        </form>
    </div>
  
</body>

</template>

<script>
import UserService from '../services/userService';
export default {
    data(){
        return{
            user:{
                fname:"",
                lname:"",
                email:"",
                password:"",
                age:null,
                gender:""
            },
            errors:[],
        }
    },
    methods: {
        checkForm: function(e){

            this.errors = []
            if (!this.nameValidation(this.user.fname)) {
                this.errors.push('First name is not valid.');
            }
            if (!this.nameValidation(this.user.lname)) {
                this.errors.push('Last name is not valid.');
            }
            if (!this.emailValidation(this.user.email)) {
                this.errors.push('Email is not valid.');
            }
            if (!this.passwordValidation(this.user.password)) {
                this.errors.push('Password is not valid.');
            }
            if (!this.ageValidation(this.user.age)) {
                this.errors.push('Age is not valid.');
            }
            if (!this.genderValidation(this.user.gender)) {
                this.errors.push('Gender is not valid.');
            }
            
            if (this.errors == 0) {
                 try{
                    UserService.createUser(this.user);
                    alert("User registerd successfully");
                    this.$router.push('/login');
                } catch(ex){
                    this.errors.push(ex.response.data);
                }
            }

            e.preventDefault();
    },
    nameValidation:function(name){
        return name.length >= 3 && name.length <= 50 ? true : false;
    },
    emailValidation:function(email){
        let re= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    passwordValidation:function(password){
        return password.length >= 5 && password.length <= 255;
    },
    ageValidation:function(age){
        if(age == null) return true;
        return age >= 1 && age <= 100 ? true : false;
    },
    genderValidation:function(gender){
        return gender != "" ? true : false;
    }
},
created(){
    let token = localStorage.getItem('user');
    if(token) this.$router.push('/');
}
}
</script>

<style scoped>
    body{
    padding-top:10px;
    background-image: url(../assets/1.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 580px;
}
h2{
    margin-bottom: 40px;
    text-align: center;
    color: white;
}

.jumbotron{
    background-color:rgb(43, 44, 43) ;
    border-radius: 10px;
    opacity: 0.9;
}
input{
    height: 50px;
}
#buttons{
    text-align: center;
}
li{
    font-size: 20px;
    color: red;
}
</style>