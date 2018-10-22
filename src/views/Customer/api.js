// Created by sunchunxiao on 2018/10/16.

import {FetchPost,FetchGet} from 'utils/fetch';
// import store from 'store';

export default {
	//查询组织结构
    GetCusTree(params) {
        return FetchGet('/cus/tree', params);
    },
   
}
