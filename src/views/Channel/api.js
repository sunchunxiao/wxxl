// Created by sunchunxiao on 2018/10/16.

import { FetchGet, FetchPost } from 'utils/fetch';
// import store from 'store';

export default {
    //未达成数
    GetChannelAchievement(params) {
        return FetchGet('/channel/subject/achievement', params);
    },
    //查询组织结构
    GetChannelTree(params) {
        return FetchGet('/channel/tree', params);
    },
    GetChannelTreePrograss(params) {
        return FetchGet('/channel/tree/progress', params);
    },
    GetChannelProgress(params) {
        return FetchGet('/channel/progress', params);
    },
    GetChannelTrend(params) {
        return FetchGet('/channel/trend', params);
    },
    GetChannelStructure(params) {
        return FetchGet('/channel/structure', params);
    },
    GetChannelRank(params) {
        return FetchGet('/channel/rank', params);
    },
    GetChannelMatch(params) {
        return FetchGet('/channel/strategy/match', params);
    },
    PostChannelSave(params) {
        return FetchPost('/channel/strategy/save', params);
    },
    GetChannelHistory(params) {
        return FetchGet('/channel/strategy/history', params);
    },
    GetChannelStrategy(params) {
        return FetchGet('/channel/strategy', params);
    },
    GetChannelCompare(params) {
        return FetchGet('/channel/compare', params);
    },
    GetChannelApplog(params) {
        return FetchGet('/channel/strategy/app_log', params);
    },
    GetChannelFilter(params) {
        return FetchGet('/channel/strategy/filter', params);
    },
    //钻取
    GetChannelPoor(params) {
        return FetchGet('/channel/progress/poor', params);
    },
    //http://wxxl.huangcan.dev.gy:1080/eff/v1?cid=106&pt=%E6%9C%88&sDate=2018-08-01&eDate=2018-11-30&version=0&subject=S
};
