export default [
    {
        path: '/sixBasicsEngine/organization/overview',
        redirect: '/sixBasicsEngine/organization/overview/reach'
    },
    {
        path: '/sixBasicsEngine/organization/overview/:name',
        name: 'organizationOverview',
        meta: {
            path: {
                reach: ['六项基础引擎','组织效率', '全景分析','目标达成情况总览'],
                diff: ['六项基础引擎','组织效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['六项基础引擎','组织效率', '全景分析','同比环比趋势分析'],
                structure: ['六项基础引擎','组织效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['六项基础引擎','组织效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Organization/Overview.vue')
    }, {
        path: '/sixBasicsEngine/organization/contrast',
        name: 'organizationContrast',
        meta: {
            path: ['六项基础引擎','组织效率', '对比分析']
        },
        component: () =>
            import('views/Organization/Contrast.vue')
    }, {
        path: '/sixBasicsEngine/organization/optimization',
        name: 'organizationOptimization',
        meta: {
            path: ['六项基础引擎','组织效率', '策略优化']
        },
        component: () =>
            import('views/Organization/Optimization.vue')
    }, {
        path: '/sixBasicsEngine/organization/track',
        name: 'organizationTrack',
        meta: {
            path: ['六项基础引擎','组织效率', '策略跟踪']
        },
        component: () =>
            import('views/Organization/Track.vue')
    },
];
