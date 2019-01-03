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
                component: () => import('views/Home/Sales.vue')
            },
            {
                path: '/home/profit',
                name: 'profit',
                component: () => import('views/Home/Profit.vue')
            },
            {
                path: '/home/product',
                name: 'homeProduct',
                component: () => import('views/Home/Product.vue')
            },
            {
                path: '/home/channel',
                name: 'homeChannel',
                component: () => import('views/Home/Channel.vue')
            },
            {
                path: '/home/customer',
                name: 'homeCustomer',
                component: () => import('views/Home/Customer.vue')
            },
            {
                path: '/home/organization',
                name: 'homeOrganization',
                component: () => import('views/Home/Organization.vue')
            },
            {
                path: '/home/fund',
                name: 'Fund',
                component: () => import('views/Home/Fund.vue')
            },
            {
                path: '/home/equity',
                name: 'equity',
                component: () => import('views/Home/BrandEquity.vue')
            },
            {
                path: '/home/profitSpace',
                name: 'profitSpace',
                component: () => import('views/Home/ProfitSpace.vue')
            },
            {
                path: '/home/profitability',
                name: 'profitability',
                component: () => import('views/Home/Profitability.vue')
            },
            {
                path: '/home/pay',
                name: 'pay',
                component: () => import('views/Home/Pay.vue')
            },
        ]
    },
];
