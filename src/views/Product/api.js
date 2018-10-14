import {FetchGet} from 'utils/fetch';
// import store from 'store';

export default {
    GetProductTree(params) {
        return FetchGet('/product/tree', params);
    },
    GetProductProgress(params) {
        return FetchGet('/product/progress', params);
    },
    GetProductTrend(params) {
        return FetchGet('/product/trend', params);
    },
    GetProductStructure(params) {
        return FetchGet('/product/structure', params);
    },
    GetProductRank(params) {
        return FetchGet('/product/rank', params);
    },
}
