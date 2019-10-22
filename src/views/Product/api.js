import { FetchGet, FetchPost } from 'utils/fetch';
// import store from 'store';

export default {
    //未达成数
    GetProductAchievement(params) {
        return FetchGet('/product/subject/achievement', params);
    },
    GetProductTree(params) {
        return FetchGet('/product/tree', params);
    },
    GetProductTreeProduct(params) {
        return FetchGet('/product/tree/progress', params);
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
    GetProductCompare(params) {
        return FetchGet('/product/compare', params);
    },
    GetProductHistory(params) {
        return FetchGet('/product/strategy/history', params);
    },
    GetProductStrategy(params) {
        return FetchGet('/product/strategy', params);
    },
    GetProductMatch(params) {
        return FetchGet('/product/strategy/match', params);
    },
    PostProductSave(params) {
        return FetchPost('/product/strategy/save', params);
    },
    GetProductSearch(params) {
        return FetchGet('/product/search', params);
    },
    GetProductApplog(params) {
        return FetchGet('/product/strategy/app_log', params);
    },
    GetProductFilter(params) {
        return FetchGet('/product/strategy/filter', params);
    },
    //钻取
    GetProductPoor(params) {
        return FetchGet('/product/progress/poor', params);
    },
};
