export default [
    {
        path: '/applyScene/plan/overview',
        name: 'applyScenePlan',
        meta: {
            path: ['三大应用场景','计划', '货品计划']
        },
        component: () => import('views/GoodsPlan/Overview.vue')
    },
];
