import { FetchGet } from 'utils/fetch';
// import store from 'store';

export default {
    GetOverviewProgress(params) {
        return FetchGet('/overview/progress', params);
    },
    GetOverviewTrend(params) {
        return FetchGet('/overview/trend', params);
    },
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
    GetOrgProgress(params) {
        return FetchGet('/org/avg/progress', params);
    },
    GetOrgTrend(params) {
        return FetchGet('/org/avg/trend', params);
    },
    GetFundProgress(params) {
        return FetchGet('/fund/avg/progress', params);
    },
    GetFundTrend(params) {
        return FetchGet('/fund/avg/trend', params);
    },
    GetCusProgress(params) {
        return FetchGet('/cus/avg/progress', params);
    },
    GetCusTrend(params) {
        return FetchGet('/cus/avg/trend', params);
    },
};
