import { FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
    GetPlan(params) {
        return FetchGet('/scene/plan', params);
    },
    GetProductStrategy(params) {
        return FetchGet('/product/strategy', params);
    },
    GetProductFilter(params) {
        return FetchGet('/product/strategy/filter', params);
    },
};
