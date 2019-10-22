// Created by sunchunxiao on 2018/10/16.

import { FetchGet, FetchPost } from 'utils/fetch';

// import store from 'store';

export default {
    //未达成数
    GetOrgAchievement(params) {
        return FetchGet('/org/subject/achievement', params);
    },
    //查询组织结构
    GetOrgTree(params) {
        return FetchGet('/org/tree', params);
    },
    GetOrgTreePrograss(params) {
        return FetchGet('/org/tree/progress', params);
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
    //钻取
    GetOrgPoor(params) {
        return FetchGet('/org/progress/poor', params);
    },
};
