// Created by sunchunxiao on 2018/10/16.

import { FetchGet } from 'utils/fetch';

// import store from 'store';

export default {
    GetSupplyRank(params) {
        return FetchGet('/outer_performance/supplier/level', params);
    },
    GetSupplyList(params) {
        return FetchGet('/outer_performance/supplier/list', params);
    },
    GetSupplyScore(params) {
        return FetchGet('/outer_performance/supplier/score', params);
    },
    GetSupplyGossip(params) {
        return FetchGet('/outer_performance/supplier/gossip', params);
    },
    GetOrgStrategy(params) {
        return FetchGet('/outer_performance/supplier/strategy', params);
    },
    GetOrgFilter(params) {
        return FetchGet('/org/strategy/filter', params);
    },
};
