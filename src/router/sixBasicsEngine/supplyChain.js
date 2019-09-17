export default [
    {
        path: '/sixBasicsEngine/supplyChain/overview',
        redirect: '/sixBasicsEngine/supplyChain/overview/reach'
    },
    {
        path: '/sixBasicsEngine/supplyChain/overview/:name',
        name: 'supplyChainOverview',
        meta: {
            path: {
                reach: ['六项基础引擎','供应链效率', '全景分析', '目标达成情况总览'],
                diff: ['六项基础引擎','供应链效率', '全景分析', '目标-实际-差异趋势分析'],
                trend: ['六项基础引擎','供应链效率', '全景分析', '同比环比趋势分析'],
                structure: ['六项基础引擎','供应链效率', '全景分析', '比例结构与平均值对比分析'],
                rank: ['六项基础引擎','供应链效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () => import('views/SupplyChain/Overview.vue')
    },
    {
        path: '/sixBasicsEngine/supplyChain/contrast',
        name: 'supplyChainContrast',
        meta: {
            path: ['六项基础引擎','供应链效率', '对比分析'],
        },
        component: () => import('views/SupplyChain/Contrast.vue')
    },
    {
        path: '/sixBasicsEngine/supplyChain/optimization',
        name: 'supplyChainOptimization',
        meta: {
            path: ['六项基础引擎','供应链效率', '策略优化']
        },
        component: () => import('views/SupplyChain/Optimization.vue')
    },
    {
        path: '/sixBasicsEngine/supplyChain/track',
        name: 'SupplyChainTrack',
        meta: {
            path: ['六项基础引擎','供应链效率', '策略跟踪']
        },
        component: () => import('views/SupplyChain/Track.vue')
    }
];
