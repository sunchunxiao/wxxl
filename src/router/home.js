export default [
    {
        path: '/home',
        name: 'homeIndex',
        component: () => import('views/Home/index.vue'),
        redirect: '/home/sales',
        children: [
            {
                path: '/home/sales',
                name: 'homeSales',
                meta: {
                    path: ['首页', '基本竞争力一一销售']
                },
                component: () => import('views/Home/Sales.vue')
            },
            {
                path: '/home/profit',
                name: 'profit',
                meta: {
                    path: ['首页', '持续竞争力一一利润']
                },
                component: () => import('views/Home/Profit.vue')
            },
            {
                path: '/home/equity',
                name: 'equity',
                meta: {
                    path: ['首页', '品牌价值']
                },
                component: () => import('views/Home/BrandEquity.vue')
            },
            {
                path: '/home/profitSpace',
                name: 'profitSpace',
                meta: {
                    path: ['首页', '盈利空间']
                },
                component: () => import('views/Home/ProfitSpace.vue')
            },
            {
                path: '/home/profitability',
                name: 'profitability',
                meta: {
                    path: ['首页', '营运水平/盈利能力']
                },
                component: () => import('views/Home/Profitability.vue')
            },
            {
                path: '/home/pay',
                name: 'pay',
                meta: {
                    path: ['首页', '支付能力']
                },
                component: () => import('views/Home/Pay.vue')
            },
            {
                path: '/home/core',
                redirect: '/home/core/product'
            },

        ]
    },
    {
        path: '/home/core/:name',
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
