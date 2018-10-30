// Created by sunchunxiao on 2018/10/16.

import { FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
	//查询组织结构
    GetChannelTree(params) {
        return FetchGet('/channel/tree', params);
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
   
};
