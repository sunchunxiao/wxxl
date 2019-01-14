export default [
    {
        path: '/organization/overview',
        redirect: '/organization/overview/reach'
    },
    {
        path: '/organization/overview/:name',
        name: 'organizationOverview',
        meta: {
            path: {
                reach: ['组织效率', '全景分析','目标达成情况总览'],
                diff: ['组织效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['组织效率', '全景分析','同比环比趋势分析'],
                structure: ['组织效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['组织效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Organization/Overview.vue')
    }, {
        path: '/organization/contrast',
        name: 'organizationContrast',
        meta: {
            path: ['组织效率', '对比分析']
        },
        component: () =>
            import('views/Organization/Contrast.vue')
    }, {
        path: '/organization/optimization',
        name: 'organizationOptimization',
        meta: {
            path: ['组织效率', '策略优化']
        },
        component: () =>
            import('views/Organization/Optimization.vue')
    }, {
        path: '/organization/track',
        name: 'organizationTrack',
        meta: {
            path: ['组织效率', '策略跟踪']
        },
        component: () =>
            import('views/Organization/Track.vue')
    },
];
