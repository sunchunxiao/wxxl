export default [
    {
        path: '/sixBasicsEngine/fund/overview',
        redirect: '/sixBasicsEngine/fund/overview/reach'
    },
    {
        path: '/sixBasicsEngine/fund/overview/:name',
        name: 'fundOverview',
        meta: {
            path: {
                reach: ['六项基础引擎','资金效率', '全景分析','目标达成情况总览'],
                diff: ['六项基础引擎','资金效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['六项基础引擎','资金效率', '全景分析','同比环比趋势分析'],
                structure: ['六项基础引擎','资金效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['六项基础引擎','资金效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Fund/Overview.vue')
    }, {
        path: '/sixBasicsEngine/fund/contrast',
        name: 'fundContrast',
        meta: {
            path: ['六项基础引擎','资金效率', '对比分析']
        },
        component: () =>
            import('views/Fund/Contrast.vue')
    }, {
        path: '/sixBasicsEngine/fund/optimization',
        name: 'fundOptimization',
        meta: {
            path: ['六项基础引擎','资金效率', '策略优化']
        },
        component: () =>
            import('views/Fund/Optimization.vue')
    }, {
        path: '/sixBasicsEngine/fund/track',
        name: 'fundTrack',
        meta: {
            path: ['六项基础引擎','资金效率', '策略跟踪']
        },
        component: () =>
            import('views/Fund/Track.vue')
    },
];
