export default [
    {
        path: '/sixBasicsEngine/product/overview',
        redirect: '/sixBasicsEngine/product/overview/reach'
    },
    {
        path: '/sixBasicsEngine/product/overview/:name',
        name: 'productOverview',
        meta: {
            path: {
                reach: ['六项基础引擎','产品效率', '全景分析','目标达成情况总览'],
                diff: ['六项基础引擎','产品效率', '全景分析','目标-实际-差异趋势分析'],
                trend: ['六项基础引擎','产品效率', '全景分析','同比环比趋势分析'],
                structure: ['六项基础引擎','产品效率', '全景分析','比例结构与平均值对比分析'],
                rank: ['六项基础引擎','产品效率', '全景分析','智能评选和智能策略']
            }
        },
        component: () => import('views/Product/Overview.vue')
    },
    {
        path: '/sixBasicsEngine/product/contrast',
        name: 'productContrast',
        meta: {
            path: ['六项基础引擎','产品效率', '对比分析']
        },
        component: () => import('views/Product/Contrast.vue')
    },
    {
        path: '/sixBasicsEngine/product/optimization',
        name: 'productOptimization',
        meta: {
            path: ['六项基础引擎','产品效率', '策略优化']
        },
        component: () => import('views/Product/Optimization.vue')
    },
    {
        path: '/sixBasicsEngine/product/track',
        name: 'productTrack',
        meta: {
            path: ['六项基础引擎','产品效率', '策略跟踪']
        },
        component: () => import('views/Product/Track.vue')
    }
];
