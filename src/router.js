import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/product/overview',
          name: 'productoverview',
          component: () => import(/* webpackChunkName: "about" */ './views/Product/Overview.vue')
        }, {
          path: '/product/contrast',
          name: 'productcontrast',
          component: () => import(/* webpackChunkName: "about" */ './views/Product/Contrast.vue')
        }, {
          path: '/product/optimization',
          name: 'productoptimization',
          component: () => import(/* webpackChunkName: "about" */ './views/Product/Optimization.vue')
        }, {
          path: '/organization/overview',
          name: 'organizationoverview',
          component: () => import(/* webpackChunkName: "about" */ './views/Organization/Overview.vue')
        }, {
          path: '/fund/overview',
          name: 'fundoverview',
          component: () => import(/* webpackChunkName: "about" */ './views/Fund/Overview.vue')
        }, {
          path: '/channel/overview',
          name: 'channeloverview',
          component: () => import(/* webpackChunkName: "about" */ './views/Channel/Overview.vue')
        },
      ]
    },
    {
      path: '/index',
      name: 'index',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Index.vue')
    }
  ]
})
