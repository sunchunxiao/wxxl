export default [
    {
        path: '/applyScene/budget/overview',
        name: 'applySceneBudget',
        meta: {
            path: ['三大应用场景','预算', '货品预算']
        },
        component: () => import('views/Budget/Overview.vue')
    },
];
