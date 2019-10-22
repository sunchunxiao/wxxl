import { FetchGet } from 'utils/fetch';

export default {
    //本季度产能使用
    GetBudgetCapacity(params) {
        return FetchGet('/budget/capacity', params);
    },
    //各工厂下单进度
    GetBudgetFactory(params) {
        return FetchGet('/budget/progress/factory', params);
    },
    //各业务部门下单进度
    GetBudgetDepartment(params) {
        return FetchGet('/budget/progress/department', params);
    },
    //当前、首单、反单下单进度
    GetBudgetOrders(params) {
        return FetchGet('/budget/progress/orders', params);
    },
    //筛选条件
    GetBudgetFilter(params) {
        return FetchGet('/budget/filter', params);
    },
    GetBudget(params) {
        return FetchGet('/scene/budget', params);
    }
};
