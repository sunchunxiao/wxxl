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
          name: 'productOverview',
          component: () => import('./views/Product/Overview.vue')
        }, {
          path: '/product/contrast',
          name: 'productContrast',
          component: () => import('./views/Product/Contrast.vue')
        }, {
          path: '/product/optimization',
          name: 'productOptimization',
          component: () => import('./views/Product/Optimization.vue')
        }, {
          path: '/product/track',
          name: 'productTrack',
          component: () => import('./views/Product/Track.vue')
        }, {
          path: '/organization/overview',
          name: 'organizationOverview',
          component: () => import('./views/Organization/Overview.vue')
        }, {
          path: '/fund/overview',
          name: 'fundOverview',
          component: () => import('./views/Fund/Overview.vue')
        }, {
          path: '/channel/overview',
          name: 'channelOverview',
          component: () => import('./views/Channel/Overview.vue')
        },
      ]
    },
    {
      path: '/index',
      name: 'index',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Index.vue')
    }
  ]
})
