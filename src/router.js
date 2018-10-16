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
				//产品效率  
				{
					path: '/product/overview',
					name: 'productOverview',
					component: () =>
						import('./views/Product/Overview.vue')
				}, {
					//全景分析
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
					//资金效率
					path: '/fund/overview',
					name: 'fundOverview',
					component: () =>
						import('./views/Fund/Overview.vue')
				}, {
					//渠道效率
					path: '/channel/overview',
					name: 'channelOverview',
					component: () =>
						import('./views/Channel/Overview.vue')
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