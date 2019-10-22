import { FetchGet } from 'utils/fetch';

export default {
    //本季度产能使用
    GetPlanCapacity(params) {
        return FetchGet('/plan/capacity', params);
    },
    //各工厂下单进度
    GetPlanFactory(params) {
        return FetchGet('/plan/progress/factory', params);
    },
    //各业务部门下单进度
    GetPlanDepartment(params) {
        return FetchGet('/plan/progress/department', params);
    },
    //当前、首单、反单下单进度
    GetPlanOrders(params) {
        return FetchGet('/plan/progress/orders', params);
    },
    //筛选条件
    GetPlanFilter(params) {
        return FetchGet('/plan/filter', params);
    },
    GetPlan(params) {
        return FetchGet('/scene/plan', params);
    }
};
