import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import { getToken } from 'utils/auth';

import './plugins';

import './style/index.scss';

import 'utils/finally';

Vue.config.productionTip = false;

const WHITELIST = ['/', '/login', '/index', '/404'];
router.beforeEach((to, from, next) => {
    if (getToken()) {
        if (to.path === '/login') {
            next('/index');
        } else {
            next();
        }
    } else {
        if (WHITELIST.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login');
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
