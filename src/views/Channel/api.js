// Created by sunchunxiao on 2018/10/16.

import { FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
	//查询组织结构
    GetChannelTree(params) {
        return FetchGet('/channel/tree', params);
    },
   
};
