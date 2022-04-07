import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        meta: { isPublic: true },
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        meta: { isPublic: true },
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: '首页',
                component: () => import('@/views/Home/index'),
                meta: {
                    title: '首页',
                    icon: 'online-conference'
                }
            }
        ]
    },

    {
        path: '/example',
        component: Layout,
        // redirect: '/example/table',
        name: 'Example',
        meta: {
            title: '文章管理',
            icon: 'notebook_1'
        },
        children: [
            {
                path: 'categoryList',
                name: 'CategoryList',
                component: () => import('@/views/table/CategoryList'),
                meta: {
                    title: '分类管理',
                    icon: 'test'
                }
            },
            {
                path: 'articlesList',
                name: 'ArticlesList',
                component: () => import('@/views/table/ArticlesList'),
                meta: {
                    title: '文章管理',
                    icon: 'test'
                }
            },
            {
                path: 'commentList',
                name: 'CommentList',
                component: () => import('@/views/table/CommentList'),
                meta: {
                    title: '评论管理',
                    icon: 'test'
                }
            }
        ]
    },
    {
        path: '/trivial',
        component: Layout,
        children: [
            {
                path: '',
                name: '日常琐碎',
                component: () => import('@/views/trivial/TrivialList'),
                meta: {
                    title: '日常琐碎',
                    icon: 'notebook'
                }
            }
        ]
    },
    {
        path: '/message',
        component: Layout,
        children: [
            {
                path: '',
                name: '留言管理',
                component: () => import('@/views/message/MessageList'),
                meta: {
                    title: '留言管理',
                    icon: 'conversation'
                }
            }
        ]
    },
    {
        path: '/link',
        component: Layout,
        children: [
            {
                path: '',
                name: '友链管理',
                component: () => import('@/views/link/LinkList'),
                meta: {
                    title: '友链管理',
                    icon: 'conversation'
                }
            }
        ]
    },
    {
        path: '/music',
        component: Layout,
        children: [
            {
                path: '',
                name: '音乐管理',
                component: () => import('@/views/music/MusicList'),
                meta: {
                    title: '音乐管理',
                    icon: 'conversation'
                }
            }
        ]
    },
    {
        path: '/setting',
        component: Layout,
        // redirect: '/example/table',
        name: 'Setting',
        meta: {
            title: '系统设置',
            icon: 'notebook_1',
            roles: ['administrator', 'admin']
        },
        children: [
            {
                path: 'adminUsers',
                name: 'AdminUsers',
                component: () => import('@/views/setting/AdminUsers'),
                meta: {
                    title: '系统账号',
                    icon: 'test',
                    roles: ['admin']
                }
            },
            {
                path: 'Users',
                name: 'Users',
                component: () => import('@/views/setting/Users'),
                meta: {
                    title: '用户账号',
                    icon: 'test',
                    roles: ['administrator', 'admin']
                }
            }
        ]
    },
    // 404 page must be placed at the end !!!
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes
    });

const router = createRouter();
// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [

]

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
