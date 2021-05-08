<template>
<body>
    <div class="container jumbotron align-items-center col-md-6"> 
        <h2 class="align-middle">Login to our site</h2>
        <form class="needs-validation" method="get" @submit.prevent="checkForm" >
            <div class="mb-3 col-12">
                <p v-if="errors.length">
                    <ul>
                        <li v-for="error in errors" :key="error" >{{ error }}</li>
                    </ul>
                </p>
            </div>
            <div class="col-md-12 mb-4" >
                <input type="email" class="form-control mt-2" id="email" placeholder="Email" v-model="inputs.email">
            </div>
            <div class="col-md-12 mb-3">
                <input type="password" class="form-control" id="password" placeholder="Password" v-model="inputs.password">
            </div>
            <div id="buttons">
            <button class="btn btn-primary mt-4 col-md-6" type="submit">login</button>
            </div>
            <div class=" row justify-content-around mt-3"> 
                <p>Don't have an account? <router-link to="/register">Register</router-link></p>
            </div>
        </form>      
    </div>
</body>
</template>

<script>
import AuthService from '../services/authService';
export default {
    data(){
        return{
            inputs:{
                email:"",
                password:"",
            },
            errors:[],
        }
    },
    methods: {
        checkForm: async function(e){
            this.errors = []
            if (!this.emailValidation(this.inputs.email)) {
                this.errors.push('Email not valid.');
            }
            if (!this.passwordValidation(this.inputs.password)) {
                this.errors.push('Password not valid.');
            }

            if (this.errors.length == 0) {
                try{
                    let token = await AuthService.loginRequest(this.inputs);
                    // console.log(token.data);
                    localStorage.setItem("user", token.data);
                    this.$router.go('/');
                    return true;
                } catch(ex){
                    this.errors.push(ex.response.data);
                    // console.log(ex.response.data);
                }
            }

            e.preventDefault();
    },
    emailValidation:function(email){
        let re= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    passwordValidation:function(password){
        return password.length >= 5 && password.length <= 255;
    },
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
}

.jumbotron{
    background-color:rgb(43, 44, 43) ;
    border-radius: 10px;
    width: 50%;
    opacity: 0.93;
}
.valid-feedback, .invalid-feedback{
    font-size: medium;
}
.valid-feedback{
    color: green;
}
.invalid-feedback{
    color: red;
}
#buttons{
    text-align: center;
}
input{
    height: 60px;
}
p,h2{
    color: white;
}
li{
    font-size: 20px;
    color: red;
}
</style>