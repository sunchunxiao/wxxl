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
                path: '/home/product',
                name: 'homeProduct',
                meta: {
                    path: ['首页', '核心竞争力一一五项效率', '产品效率 ( 单品平均效率 ) ']
                },
                component: () => import('views/Home/Product.vue')
            },
            {
                path: '/home/channel',
                name: 'homeChannel',
                meta: {
                    path: ['首页', '核心竞争力一一五项效率', '渠道效率 ( 单店平均效率 ) ']
                },
                component: () => import('views/Home/Channel.vue')
            },
            {
                path: '/home/customer',
                name: 'homeCustomer',
                meta: {
                    path: ['首页', '核心竞争力一一五项效率', '客户道效率 ( 消费者人均效率 ) ']
                },
                component: () => import('views/Home/Customer.vue')
            },
            {
                path: '/home/organization',
                name: 'homeOrganization',
                meta: {
                    path: ['首页', '核心竞争力一一五项效率', '组织效率 ( 企业人均效率 ) ']
                },
                component: () => import('views/Home/Organization.vue')
            },
            {
                path: '/home/fund',
                name: 'Fund',
                meta: {
                    path: ['首页', '核心竞争力一一五项效率','资金效率 ( 企业人均效率 ) ']
                },
                component: () => import('views/Home/Fund.vue')
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
        ]
    },
];
