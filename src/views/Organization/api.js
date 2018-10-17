// Created by sunchunxiao on 2018/10/16.

import {FetchPost} from 'utils/fetch';
// import store from 'store';

export default {
    PostOrganizationTree(data) {
        return FetchGet('/v1/org/getTree', data);
    },
    PostProductProgress(data) {
        return FetchGet('/v1/org/getTree', data);
    },
    PostProductTrend(data) {
        return FetchGet('/product/trend', data);
    },
    PostProductStructure(data) {
        return FetchGet('/product/structure', data);
    },
    PostProductRank(data) {
        return FetchGet('/product/rank', data);
    },
}
