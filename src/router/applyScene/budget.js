export default [
    {
        path: '/applyScene/budget/overview',
        name: 'applySceneBudget',
        meta: {
            path: ['三大应用场景','预算', '货品预算']
        },
        component: () => import('views/Budget/Overview.vue')
    },
    {
        path: '/applyScene/budget/companyBudget/overview',
        name: 'companyBudget',
        meta: {
            path: ['三大应用场景','绩效管理', '公司内部预算管理']
        },
        component: () => import('views/Budget/companyBudget/Overview.vue')
    },
];
