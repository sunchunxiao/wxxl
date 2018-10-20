import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'home',
            component: Home,
            redirect: '/index',
            children: [
                //全景分析
                {
                    path: '/product/overview',
                    name: 'productOverview',
                    component: () =>
                        import('./views/Product/Overview.vue')
                }, {
                    path: '/product/contrast',
                    name: 'productContrast',
                    component: () =>
                        import('./views/Product/Contrast.vue')
                }, {
                    path: '/product/optimization',
                    name: 'productOptimization',
                    component: () =>
                        import('./views/Product/Optimization.vue')
                }, {
                    path: '/product/track',
                    name: 'productTrack',
                    component: () =>
                        import('./views/Product/Track.vue')
                }, {
                    //组织效率  
                    path: '/organization/overview',
                    name: 'organizationOverview',
                    component: () =>
                        import('./views/Organization/Overview.vue')
                }, {
                    path: '/organization/contrast',
                    name: 'organizationContrast',
                    component: () =>
                        import('./views/Organization/Contrast.vue')
                }, {
                    path: '/organization/optimization',
                    name: 'organizationOptimization',
                    component: () =>
                        import('./views/Organization/Optimization.vue')
                }, {
                    path: '/organization/track',
                    name: 'organizationTrack',
                    component: () =>
                        import('./views/Organization/Track.vue')
                }, {
                    //客户效率
                    path: '/customer/overview',
                    name: 'customerOverview',
                    component: () =>
                        import('./views/Customer/Overview.vue')
                }, {
                    path: '/customer/contrast',
                    name: 'customerContrast',
                    component: () =>
                        import('./views/Customer/Contrast.vue')
                }, {
                    path: '/customer/optimization',
                    name: 'customerOptimization',
                    component: () =>
                        import('./views/Customer/Optimization.vue')
                },{
                    path: '/customer/track',
                    name: 'customerTrack',
                    component: () =>
                        import('./views/Customer/Track.vue')
                },{
                    //资金效率
                    path: '/fund/overview',
                    name: 'fundOverview',
                    component: () =>
                        import('./views/Fund/Overview.vue')
                }, {
                    path: '/fund/contrast',
                    name: 'fundContrast',
                    component: () =>
                        import('./views/Fund/Contrast.vue')
                }, {
                    path: '/fund/optimization',
                    name: 'fundOptimization',
                    component: () =>
                        import('./views/Fund/Optimization.vue')
                }, {
                    path: '/fund/track',
                    name: 'fundTrack',
                    component: () =>
                        import('./views/Fund/Track.vue')
                }, {
                    //渠道效率
                    path: '/channel/overview',
                    name: 'channelOverview',
                    component: () =>
                        import('./views/Channel/Overview.vue')
                },{
                    path: '/channel/contrast',
                    name: 'channelContrast',
                    component: () =>
                        import('./views/Channel/Contrast.vue')
                },{
                    path: '/channel/optimization',
                    name: 'channelOptimization',
                    component: () =>
                        import('./views/Channel/Optimization.vue')
                },{
                    path: '/channel/track',
                    name: 'channelTrack',
                    component: () =>
                        import('./views/Channel/Track.vue')
                },
            ]
        },
        {
            path: '/index',
            name: 'index',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import('./views/Index.vue')
        }
    ]
})