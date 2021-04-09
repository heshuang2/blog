import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Diarys from '../views/Diarys.vue';
import Photos from '../views/photos.vue';
import Messages from '../views/Messages.vue';
import User from '../views/User.vue';
import Post from '../views/Post.vue';
import Type from '../views/childComps/Type.vue';

//导入进度条插件
import Nprogress from 'nprogress';
import 'nprogress/nprogress';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home,
        name: 'home',
        meta: {
            keepAlive: true // 需要缓存
        }
    },
 
    {
        path: '/home/:type(\\w+\.+)',
        component: Type,
        name: 'type',
        meta: {
            keepAlive: true // 需要缓存
        }
    },
    {
        path: '/diarys',
        component: Diarys,
        name: 'diarys',
        meta: {
            keepAlive: false // 需要缓存
        }
    },
    {
        path: '/photos',
        component: Photos,
        name: 'photos'
    },
    {
        path: '/messages',
        component: Messages,
        name: 'messages',
        meta: {
            keepAlive: false // 需要缓存
        }
    },
    {
        path: '/user/:id',
        component: User,
        name: 'user',
        meta: {
            keepAlive: false // 需要缓存
        }
    },
    {
        path: '/Post/:id',
        component: Post,
        name: 'post',
        meta: {
            keepAlive: true // 需要缓存
        }
    }
];

const router = new VueRouter({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.documentElement.scrollTop;
            }
        }
        return {
            x: 0,
            y: 0
        };
    },
    beforeRouteLeave() {
        console.log(1);
    }
    //在页面离开时记录滚动位置
});
router.beforeEach((to, from, next) => {
    Nprogress.start();
    next();
});

router.afterEach(() => {
    Nprogress.done();
});

export default router;
