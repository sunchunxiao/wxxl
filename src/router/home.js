export default [
    {
        path: '/home',
        name: 'homeIndex',
        component: () => import('views/Home/index.vue'),
        redirect: '/home/external/sales',
        children: [
            {
                path: '/home/external/sales',
                name: 'homeSales',
                meta: {
                    path: ['首页', '基本竞争力一一销售']
                },
                component: () => import('views/Home/Sales.vue')
            },
            {
                path: '/home/external/profit',
                name: 'profit',
                meta: {
                    path: ['首页', '持续竞争力一一利润']
                },
                component: () => import('views/Home/Profit.vue')
            },
            {
                path: '/home/external/equity',
                name: 'equity',
                meta: {
                    path: ['首页', '品牌价值']
                },
                component: () => import('views/Home/BrandEquity.vue')
            },
            {
                path: '/home/insideExternal/profitSpace',
                name: 'profitSpace',
                meta: {
                    path: ['首页', '盈利空间']
                },
                component: () => import('views/Home/ProfitSpace.vue')
            },
            {
                path: '/home/insideExternal/profitability',
                name: 'profitability',
                meta: {
                    path: ['首页', '营运水平/盈利能力']
                },
                component: () => import('views/Home/Profitability.vue')
            },
            {
                path: '/home/insideExternal/pay',
                name: 'pay',
                meta: {
                    path: ['首页', '支付能力']
                },
                component: () => import('views/Home/Pay.vue')
            },
        ]
    },
    {
        path: '/home/external/core',
        redirect: '/home/external/core/product'
    },
    {
        path: '/home/external/core/:name',
        name: 'homeCore',
        meta: {
            path: {
                product: ['核心竞争力', '产品效率'],
                channel: ['核心竞争力', '渠道效率'],
                customer: ['核心竞争力', '客户效率'],
                organization: ['核心竞争力', '组织效率'],
                fund: ['核心竞争力', '资金效率']
            }
        },
        component: () => import('views/Home/CoreCompetence.vue'),
    },
];
