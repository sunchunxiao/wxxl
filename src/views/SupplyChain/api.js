import { FetchGet, FetchPost } from 'utils/fetch';

export default {
    GetSupplyTree(params) {
        return FetchGet('/supply/tree', params);
    },
    GetSupplyTreeProgress(params) {
        return FetchGet('/supply/tree/progress', params);
    },
    GetSupplyProgress(params) {
        return FetchGet('/supply/progress', params);
    },
    GetSupplyTrend(params) {
        return FetchGet('/supply/trend', params);
    },
    GetSupplyStructure(params) {
        return FetchGet('/supply/structure', params);
    },
    GetSupplyRank(params) {
        return FetchGet('/supply/rank', params);
    },
    GetSupplyCompare(params) {
        return FetchGet('/supply/compare', params);
    },
    GetSupplyHistory(params) {
        return FetchGet('/supply/strategy/history', params);
    },
    GetSupplyStrategy(params) {
        return FetchGet('/supply/strategy', params);
    },
    GetSupplyMatch(params) {
        return FetchGet('/supply/strategy/match', params);
    },
    PostSupplySave(params) {
        return FetchPost('/supply/strategy/save', params);
    },
    GetSupplySearch(params) {
        return FetchGet('/supply/search', params);
    },
    GetSupplyApplog(params) {
        return FetchGet('/supply/strategy/app_log', params);
    },
    GetSupplyFilter(params) {
        return FetchGet('/supply/strategy/filter', params);
    },
    //钻取
    GetSupplyPoor(params) {
        return FetchGet('/supply/progress/poor', params);
    },
};
