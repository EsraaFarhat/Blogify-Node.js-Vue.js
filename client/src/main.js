import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createWebHistory, createRouter } from "vue-router";
import homeComponent from './components/homeComponent.vue';
import addBlogComponent from './components/addBlogComponent.vue';
import followingComponent from './components/followingComponent.vue';
import registerComponent from './components/registerComponent.vue';
import authComponent from './components/authComponent.vue';
import profileComponent from './components/profileComponent.vue';
import searchComponent from './components/searchComponent.vue';
import handlerComponent from './components/handlerComponent.vue';


const routes=[
	{path:'/', component:homeComponent},
	{path:'/following', component:followingComponent},
	{path:'/profile/:id', component:profileComponent},
	{path:'/addBlog', component:addBlogComponent},
	{path:'/register', component:registerComponent},
	{path:'/login', component:authComponent},
	{path: '/search/:text', component: searchComponent, props: true},
	// {path:'/products/:productid', props:true,  component:productdetails},        // dynamic segment
	{path:'/:catchAll(.*)', component:handlerComponent},
];

    const router = createRouter({history:createWebHistory(), routes});

createApp(App).use(router).mount('#app')
