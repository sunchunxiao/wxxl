// Created by sunchunxiao on 2018/10/16.

import { FetchGet, FetchPost } from 'utils/fetch';

// import store from 'store';

export default {
    //查询组织结构
    GetOrgTree(params) {
        return FetchGet('/org/tree', params);
    },
    GetOrgTreePrograss(params) {
        return FetchGet('/inner_performance/tree/progress', params);
    },
    GetOrgProgress(params) {
        return FetchGet('/org/progress', params);
    },
    GetOrgTrend(params) {
        return FetchGet('/org/trend', params);
    },
    GetRadar(params) {
        return FetchGet('/inner_performance/detail', params);
    },
    GetOrgStructure(params) {
        return FetchGet('/inner_performance/score', params);
    },
    GetOrgRank(params) {
        return FetchGet('/inner_performance/rank', params);
    },
    GetOrgStrategy(params) {
        return FetchGet('/org/strategy', params);
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
