import { FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
    GetProductProgress(params) {
        return FetchGet('/product/avg/progress', params);
    },
    GetProductTrend(params) {
        return FetchGet('/product/avg/trend', params);
    },
    GetChannelProgress(params) {
        return FetchGet('/channel/avg/progress', params);
    },
    GetChannelTrend(params) {
        return FetchGet('/channel/avg/trend', params);
    },

    GetProductSearch(params) {
        return FetchGet('/product/search', params);
    },
};
