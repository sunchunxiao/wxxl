// Created by sunchunxiao on 2018/10/22.

import { FetchGet, FetchPost } from 'utils/fetch';
// import store from 'store';

export default {
    //未达成数
    GetFundAchievement(params) {
        return FetchGet('/fund/subject/achievement', params);
    },
    //查询组织结构
    GetFundTree(params) {
        return FetchGet('/fund/tree', params);
    },
    GetFundTreePrograss(params) {
        return FetchGet('/fund/tree/progress', params);
    },
    GetFundProgress(params) {
        return FetchGet('/fund/progress', params);
    },
    GetFundTrend(params) {
        return FetchGet('/fund/trend', params);
    },
    GetFundStructure(params) {
        return FetchGet('/fund/structure', params);
    },
    GetFundRank(params) {
        return FetchGet('/fund/rank', params);
    },
    GetFundStrategy(params) {
        return FetchGet('/fund/strategy', params);
    },
    PostFundStrategyLog(params) {
        return FetchPost('/fund/strategyLog', params);
    },
    GetFundCompare(params) {
        return FetchGet('/fund/compare', params);
    },
    GetFundSubject(params) {
        return FetchGet('/fund/subject', params);
    },
    GetFundStrategiesOpt(params) {
        return FetchGet('/fund/strategiesOpt', params);
    },
    GetFundStrategiesTrack(params) {
        return FetchGet('/fund/strategiesTrack', params);
    },
    GetFundApplog(params) {
        return FetchGet('/fund/strategy/app_log', params);
    },
    GetFundFilter(params) {
        return FetchGet('/fund/strategy/filter', params);
    },
};
