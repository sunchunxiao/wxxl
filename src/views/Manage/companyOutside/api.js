// Created by sunchunxiao on 2018/10/16.

import { FetchGet, FetchPost } from 'utils/fetch';

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
    PostOrgStrategyLog(params) {
        return FetchPost('/org/strategyLog', params);
    },
    GetOrgCompare(params) {
        return FetchGet('/org/compare', params);
    },
    GetOrgSubject(params) {
        return FetchGet('/org/subject', params);
    },
    GetOrgStrategiesOpt(params) {
        return FetchGet('/org/strategiesOpt', params);
    },
    GetOrgStrategiesTrack(params) {
        return FetchGet('/org/strategiesTrack', params);
    },
    GetOrgApplog(params) {
        return FetchGet('/org/strategy/app_log', params);
    },
    GetOrgFilter(params) {
        return FetchGet('/org/strategy/filter', params);
    },
};
