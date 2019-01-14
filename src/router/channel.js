export default [
    {
        path: '/channel/overview',
        redirect: '/channel/overview/reach'
    },
    {
        path: '/channel/overview/:name',
        name: 'channelOverview',
        meta: {
            path: {
                reach: ['渠道效率', '全景分析','目标达成情况总览'],
                diff: ['渠道效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['渠道效率', '全景分析','同比环比趋势分析'],
                structure: ['渠道效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['渠道效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Channel/Overview.vue')
    }, {
        path: '/channel/contrast',
        name: 'channelContrast',
        meta: {
            path: ['渠道效率', '对比分析']
        },
        component: () =>
            import('views/Channel/Contrast.vue')
    }, {
        path: '/channel/optimization',
        name: 'channelOptimization',
        meta: {
            path: ['渠道效率', '策略优化']
        },
        component: () =>
            import('views/Channel/Optimization.vue')
    }, {
        path: '/channel/track',
        name: 'channelTrack',
        meta: {
            path: ['渠道效率', '策略跟踪']
        },
        component: () =>
            import('views/Channel/Track.vue')
    },
];
