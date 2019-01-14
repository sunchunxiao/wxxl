export default [
    {
        path: '/customer/overview',
        redirect: '/customer/overview/reach'
    },
    {
        path: '/customer/overview/:name',
        name: 'customerOverview',
        meta: {
            path: {
                reach: ['客户效率', '全景分析','目标达成情况总览'],
                diff: ['客户效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['客户效率', '全景分析','同比环比趋势分析'],
                structure: ['客户效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['客户效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Customer/Overview.vue')
    }, {
        path: '/customer/contrast',
        name: 'customerContrast',
        meta: {
            path: ['客户效率', '对比分析']
        },
        component: () =>
            import('views/Customer/Contrast.vue')
    }, {
        path: '/customer/optimization',
        name: 'customerOptimization',
        meta: {
            path: ['客户效率', '策略优化']
        },
        component: () =>
            import('views/Customer/Optimization.vue')
    }, {
        path: '/customer/track',
        name: 'customerTrack',
        meta: {
            path: ['客户效率', '策略跟踪']
        },
        component: () =>
            import('views/Customer/Track.vue')
    },
];
