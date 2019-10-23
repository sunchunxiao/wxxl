export default [
    {
        path: '/applyScene/plan/overview',
        name: 'applyScenePlan',
        meta: {
            path: ['三大应用场景','计划', '货品计划']
        },
        component: () => import('views/GoodsPlan/Overview.vue')
    },
    {
        path: '/applyScene/plan/companyPlan/overview',
        name: 'companyPlan',
        meta: {
            path: ['三大应用场景','绩效管理', '公司内部计划管理']
        },
        component: () => import('views/GoodsPlan/companyPlan/Overview.vue')
    },
];
