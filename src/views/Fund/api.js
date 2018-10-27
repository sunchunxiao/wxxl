// Created by sunchunxiao on 2018/10/22.

import { FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
    //查询组织结构
    GetFundTree(params) {
        return FetchGet('/fund/tree', params);
    },
   
};
