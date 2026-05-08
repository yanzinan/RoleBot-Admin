import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../views/Mainlayout.vue'
import Agent from '../views/main/Agent.vue';
import Logout from '../views/main/Logout.vue';
import Change from '../views/main/Change.vue'



const routes = [
    {
        path:'/',
        component:MainLayout,
        children:[
            {
                path: '',
                name: 'Agent',
                component: Agent,
            },
            {
                path: 'logout',
                name: 'Logout',
                component: Logout,
            },
            {
                path: 'change',
                name: 'Change',
                component: Change
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    }
];

const router = createRouter({
    history:createWebHashHistory(import.meta.env.BASE_URL),
    routes,
});

//导航守卫，例如检查是否已登录
router.beforeEach((to, from, next) => {
    // 检查目标路由是否是登录页面
    if (to.name === 'Login') {
        // 如果用户已经登录，重定向到首页或其他默认页面
        if (sessionStorage.getItem('Login')) {
            next({ path: '/' }); // 通常首页的path为'/'
        } else {
            // 用户未登录，继续前往登录页面
            next();
        }
    } else {
        // 如果目标不是登录页面，检查用户是否登录
        if (!sessionStorage.getItem('Login')) {
            // 如果用户没有登录，重定向到登录页面
            next({ name: 'Login' });
        } else {
                // 用户已登录，继续前往目标页面
                next();
        }
    }
  });

export default router;