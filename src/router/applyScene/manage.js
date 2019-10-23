export default [
    {
        path: '/applyScene/manage/companyInsideManage/overview',
        redirect: '/applyScene/manage/companyInsideManage/overview/rank'
    },
    {
        path: '/applyScene/manage/companyInsideManage/overview/:name',
        name: 'ManageOverview',
        meta: {
            path: {
                rank: ['三大应用场景','绩效管理', ' 公司内部绩效管理','整体绩效预警分析'],
                sort: ['三大应用场景','绩效管理', ' 公司内部绩效管理','整体绩效排序分析'],
                trend: ['三大应用场景','绩效管理', ' 公司内部绩效管理','绩效考核指标细化分析'],
            }
        },
        component: () => import('views/Manage/companyInside/Overview.vue')
    },
    {
        path: '/applyScene/manage/companyOutsideManage/overview',
        name: 'companyOutsideManage',
        meta: {
            path: ['三大应用场景','绩效管理', '公司外部绩效管理分析']
        },
        component: () => import('views/Manage/companyOutside/Overview.vue')
    },

];
