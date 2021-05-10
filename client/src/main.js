import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

import { createWebHistory, createRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisH, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import homeComponent from './components/homeComponent.vue';
import addBlogComponent from './components/addBlogComponent.vue';
import editBlogComponent from './components/editBlogComponent.vue';
import followingComponent from './components/followingComponent.vue';
import registerComponent from './components/registerComponent.vue';
import authComponent from './components/authComponent.vue';
import profileComponent from './components/profileComponent.vue';
import searchComponent from './components/searchComponent.vue';
import handlerComponent from './components/handlerComponent.vue';

library.add([faEllipsisH, faEnvelope, faLock]);

const toastTypes = {
	success: 'success',
	error: 'error',
	info: 'info',
	warn: 'warn'
}

miniToastr.init({types: toastTypes});

function toast ({title, message, type, timeout, cb}) {
	return miniToastr[type](message, title, timeout, cb)
  }
  
  const options = {
	success: toast,
	error: toast,
	info: toast,
	warn: toast
}


const routes=[
	{path:'/', component:homeComponent},
	{path:'/following', component:followingComponent},
	{path:'/profile/:id', component:profileComponent},
	{path:'/addBlog', component:addBlogComponent},
	{path:'/editBlog/:id', component:editBlogComponent, props: true},
	{path:'/register', component:registerComponent},
	{path:'/login', component:authComponent},
	{path: '/search/:text', component: searchComponent, props: true},
	// {path:'/products/:productid', props:true,  component:productdetails},
	{path:'/:catchAll(.*)', component:handlerComponent},
];

    const router = createRouter({history:createWebHistory(), routes});

createApp(App).use(router).use(VueNotifications, options).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
