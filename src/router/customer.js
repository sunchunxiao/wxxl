export default [
    {
        path: '/customer/overview/:name',
        name: 'customerOverview',
        component: () =>
            import('views/Customer/Overview.vue')
    }, {
        path: '/customer/contrast',
        name: 'customerContrast',
        component: () =>
            import('views/Customer/Contrast.vue')
    }, {
        path: '/customer/optimization',
        name: 'customerOptimization',
        component: () =>
            import('views/Customer/Optimization.vue')
    }, {
        path: '/customer/track',
        name: 'customerTrack',
        component: () =>
            import('views/Customer/Track.vue')
    },
];
