export default [
    {
        path: '/product/overview',
        redirect: '/product/overview/reach'
    },
    {
        path: '/product/overview/:name',
        name: 'productOverview',
        component: () => import('views/Product/Overview.vue')
    },
    {
        path: '/product/contrast',
        name: 'productContrast',
        component: () => import('views/Product/Contrast.vue')
    },
    {
        path: '/product/optimization',
        name: 'productOptimization',
        component: () => import('views/Product/Optimization.vue')
    },
    {
        path: '/product/track',
        name: 'productTrack',
        component: () => import('views/Product/Track.vue')
    }
];
