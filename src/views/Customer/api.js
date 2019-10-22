// Created by sunchunxiao on 2018/10/16.

import { FetchGet, FetchPost } from 'utils/fetch';
// import store from 'store';

export default {
    //未达成数
    GetCusAchievement(params) {
        return FetchGet('/cus/subject/achievement', params);
    },
    //查询组织结构
    GetCusTree(params) {
        return FetchGet('/cus/tree', params);
    },
    GetCusTreePrograss(params) {
        return FetchGet('/cus/tree/progress', params);
    },
    GetCusSubject(params) {
        return FetchGet('/cus/subject', params);
    },
    GetCusProgress(params) {
        return FetchGet('/cus/progress', params);
    },
    GetCusTrend(params) {
        return FetchGet('/cus/trend', params);
    },
    GetCusStructure(params) {
        return FetchGet('/cus/structure', params);
    },
    GetCusRank(params) {
        return FetchGet('/cus/rank', params);
    },
    GetCusStrategy(params) {
        return FetchGet('/cus/strategy', params);
    },
    PostCusStrategyLog(params) {
        return FetchPost('/cus/strategyLog', params);
    },
    GetCusCompare(params) {
        return FetchGet('/cus/compare', params);
    },
    GetCusStrategiesOpt(params) {
        return FetchGet('/cus/strategiesOpt', params);
    },
    GetCusStrategiesTrack(params) {
        return FetchGet('/cus/strategiesTrack', params);
    },
    GetCusApplog(params) {
        return FetchGet('/cus/strategy/app_log', params);
    },
    GetCusFilter(params) {
        return FetchGet('/cus/strategy/filter', params);
    },
    //钻取
    GetCusPoor(params) {
        return FetchGet('/cus/progress/poor', params);
    },
};
