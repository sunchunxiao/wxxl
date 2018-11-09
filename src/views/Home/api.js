import { FetchGet, FetchPostNew } from 'utils/fetch';
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
		return FetchPostNew('/product/strategy/save', params);
    },
    GetProductSearch(params) {
		return FetchGet('/product/search', params);
	},

};