export default [
    {
        path: '/supplyChain/overview',
        redirect: '/supplyChain/overview/reach'
    },
    {
        path: '/supplyChain/overview/:name',
        name: 'supplyChainOverview',
        meta: {
            path: {
                reach: ['供应链效率', '全景分析', '目标达成情况总览'],
                diff: ['供应链效率', '全景分析', '目标-实际-差异趋势分析'],
                trend: ['供应链效率', '全景分析', '同比环比趋势分析'],
                structure: ['供应链效率', '全景分析', '比例结构与平均值对比分析'],
                rank: ['供应链效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () => import('views/SupplyChain/Overview.vue')
    },
    {
        path: '/supplyChain/contrast',
        name: 'supplyChainContrast',
        meta: {
            path: ['供应链效率', '对比分析'],
        },
        component: () => import('views/SupplyChain/Contrast.vue')
    },
    {
        path: '/supplyChain/optimization',
        name: 'supplyChainOptimization',
        meta: {
            path: ['供应链效率', '策略优化']
        },
        component: () => import('views/SupplyChain/Optimization.vue')
    },
    {
        path: '/supplyChain/track',
        name: 'SupplyChainTrack',
        meta: {
            path: ['供应链效率', '策略跟踪']
        },
        component: () => import('views/SupplyChain/Track.vue')
    }
];
