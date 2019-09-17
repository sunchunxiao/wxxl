export default [
    {
        path: '/sixBasicsEngine/channel/overview',
        redirect: '/sixBasicsEngine/channel/overview/reach'
    },
    {
        path: '/sixBasicsEngine/channel/overview/:name',
        name: 'channelOverview',
        meta: {
            path: {
                reach: ['六项基础引擎','渠道效率', '全景分析','目标达成情况总览'],
                diff: ['六项基础引擎','渠道效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['六项基础引擎','渠道效率', '全景分析','同比环比趋势分析'],
                structure: ['六项基础引擎','渠道效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['六项基础引擎','渠道效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () =>
            import('views/Channel/Overview.vue')
    }, {
        path: '/sixBasicsEngine/channel/contrast',
        name: 'channelContrast',
        meta: {
            path: ['六项基础引擎','渠道效率', '对比分析']
        },
        component: () =>
            import('views/Channel/Contrast.vue')
    }, {
        path: '/sixBasicsEngine/channel/optimization',
        name: 'channelOptimization',
        meta: {
            path: ['六项基础引擎','渠道效率', '策略优化']
        },
        component: () =>
            import('views/Channel/Optimization.vue')
    }, {
        path: '/sixBasicsEngine/channel/track',
        name: 'channelTrack',
        meta: {
            path: ['六项基础引擎','渠道效率', '策略跟踪']
        },
        component: () =>
            import('views/Channel/Track.vue')
    },
];
