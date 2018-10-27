// Created by sunchunxiao on 2018/10/16.

import { FetchPost,FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
	//查询组织结构
    GetOrgTree(params) {
        return FetchGet('/org/tree', params);
    },
		GetOrgProgress(params) {
			return FetchGet('/org/progress', params);
		},
		GetOrgTrend(params) {
			return FetchGet('/org/trend', params);
		},
		GetOrgStructure(params) {
			return FetchGet('/org/structure', params);
		},
		GetOrgRank(params) {
			return FetchGet('/org/rank', params);
		},
		GetOrgStrategy(params) {
			return FetchGet('/org/strategy', params);
		},
		PostOrgStrategyLog(params) {
			return FetchPostNew('/org/strategyLog', params);
		},
		GetOrgCompare(params) {
			return FetchGet('/org/compare', params);
		},
		GetOrgSubject(params) {
			return FetchGet('/org/subject', params);
		},
};
