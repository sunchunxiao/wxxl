export default [
    {
        path: '/fund/overview',
        redirect: '/fund/overview/reach'
    },
    {
        path: '/fund/overview/:name',
        name: 'fundOverview',
        component: () =>
            import('views/Fund/Overview.vue')
    }, {
        path: '/fund/contrast',
        name: 'fundContrast',
        component: () =>
            import('views/Fund/Contrast.vue')
    }, {
        path: '/fund/optimization',
        name: 'fundOptimization',
        component: () =>
            import('views/Fund/Optimization.vue')
    }, {
        path: '/fund/track',
        name: 'fundTrack',
        component: () =>
            import('views/Fund/Track.vue')
    },
];
