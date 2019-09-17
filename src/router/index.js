import Vue from 'vue';
import Router from 'vue-router';

import productRoute from './sixBasicsEngine/product';
import organizationRoute from './sixBasicsEngine/organization';
import customerRoute from './sixBasicsEngine/customer';
import fundRoute from './sixBasicsEngine/fund';
import channelRoute from './sixBasicsEngine/channel';
import supplyChainRoute from './sixBasicsEngine/supplyChain';
import manageRoute from './applyScene/manage';
import planRoute from './applyScene/plan';
import budgetRoute from './applyScene/budget';
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
            ...supplyChainRoute,
            ...manageRoute,
            ...planRoute,
            ...budgetRoute,
            ...homeRoute
        ]
    },
    {
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
