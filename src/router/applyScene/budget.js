export default [
    {
        path: '/applyScene/budget/overview',
        name: 'applySceneBudget',
        meta: {
            path: ['三大应用场景','计划', '货品计划']
        },
        component: () => import('views/Budget/Overview.vue')
    },
];
