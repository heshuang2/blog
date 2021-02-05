import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Diarys from '../views/Diarys.vue';
import Photos from '../views/photos.vue';
import Messages from '../views/Messages.vue';
import User from '../views/User.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/diarys',
        component: Diarys
    },
    {
        path: '/photos',
        component: Photos
    },
    {
        path: '/messages',
        component: Messages
    },
    {
        path: '/user/:id',
        component: User
    }
];

const router = new VueRouter({
  routes,
  mode: "history"
})

export default router
