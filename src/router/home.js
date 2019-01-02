export default [
    {
        path: '/home',
        name: 'homeSales',
        component: () => import('views/Home/index.vue')
    },
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
        path: '/home/fiveEff',
        name: 'fiveEff',
        component: () => import('views/Home/index.vue')
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
];
