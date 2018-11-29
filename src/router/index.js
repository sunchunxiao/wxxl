import Vue from 'vue';
import Router from 'vue-router';

import productRoute from './product';
import organizationRoute from './organization';
import customerRoute from './customer';
import fundRoute from './fund';
import channelRoute from './channel';
import homeRoute from './home';

Vue.use(Router);

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'home',
        component: () => import('views/Home.vue'),
        redirect: '/index',
        children: [
            ...productRoute,
            ...organizationRoute,
            ...customerRoute,
            ...fundRoute,
            ...channelRoute,
            ...homeRoute
        ] }, {
        path: '/index',
        name: 'index',
        component: () => import('views/Index.vue')
    }, {
        path: '/login',
        name: 'login',
        component: () => import('views/Login.vue')
    },  {
        path: '/404',
        name: '404',
        component: () => import('views/404.vue')
    }, {
        path: '*',
        redirect: '/404'
    }
    ]
});
