export default [
    {
        path: '/fund/overview',
        redirect: '/fund/overview/reach'
    },
    {
        path: '/fund/overview/:name',
        name: 'fundOverview',
        meta: {
            path: {
                reach: ['资金效率', '全景分析','目标达成情况总览'],
                diff: ['资金效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['资金效率', '全景分析','同比环比趋势分析'],
                structure: ['资金效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['资金效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Fund/Overview.vue')
    }, {
        path: '/fund/contrast',
        name: 'fundContrast',
        meta: {
            path: ['资金效率', '对比分析']
        },
        component: () =>
            import('views/Fund/Contrast.vue')
    }, {
        path: '/fund/optimization',
        name: 'fundOptimization',
        meta: {
            path: ['资金效率', '策略优化']
        },
        component: () =>
            import('views/Fund/Optimization.vue')
    }, {
        path: '/fund/track',
        name: 'fundTrack',
        meta: {
            path: ['资金效率', '策略跟踪']
        },
        component: () =>
            import('views/Fund/Track.vue')
    },
];
