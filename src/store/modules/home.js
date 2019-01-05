const home = {
    state: {
        overviewArr: [],
        overviewTrendArr: [],
        productArr: [],
        productTrendArr: [],
        channelArr: [],
        channelTrendArr: [],
        orgHomeArr: [],
        orgTrendArr: [],
        fundHomeArr: [],
        fundHomeTrendArr: [],
        cusHomeArr: [],
        cusHomeTrendArr: [],
        searchDate: {}
    },
    mutations: {
        SAVE_OVERVIEW_ARR: (state, arr) => {
            state.overviewArr = arr;
        },
        SAVE_OVERVIEWTREND_ARR: (state, arr) => {
            state.overviewTrendArr = arr;
        },
        SAVE_HOMEPRODUCT_ARR: (state, arr) => {
            state.productArr = arr;
        },
        SAVE_PRODUCTTREND_ARR: (state, arr) => {
            state.productTrendArr = arr;
        },
        SAVE_CHANNELPROGRASS_ARR: (state, arr) => {
            state.channelArr = arr;
        },
        SAVE_CHANNELTREND_ARR: (state, arr) => {
            state.channelTrendArr = arr;
        },
        SAVE_HOMEORGPROGRASS_ARR: (state, arr) => {
            state.orgHomeArr = arr;
        },
        SAVE_ORGHOMETREND_ARR: (state, arr) => {
            state.orgTrendArr = arr;
        },
        SAVE_HOMEFUNDPROGRASS_ARR: (state, arr) => {
            state.fundHomeArr = arr;
        },
        SAVE_FUNDHOMETREND_ARR: (state, arr) => {
            state.fundHomeTrendArr = arr;
        },
        SAVE_HOMECUSPROGRASS_ARR: (state, arr) => {
            state.cusHomeArr = arr;
        },
        SAVE_CUSHOMETREND_ARR: (state, arr) => {
            state.cusHomeTrendArr = arr;
        },
        SAVE_SEARCH_DATE: (state, date) => {
            state.searchDate = date;
        }
    },
    actions: {
        SaveOverviewProgressData({ commit }, arr) {
            commit('SAVE_OVERVIEW_ARR', arr);
        },
        SaveOverviewTrendArr({ commit }, arr) {
            commit('SAVE_OVERVIEWTREND_ARR', arr);
        },
        SaveProductProgressData({ commit }, arr) {
            commit('SAVE_HOMEPRODUCT_ARR', arr);
        },
        SaveProductTrendArr({ commit }, arr) {
            commit('SAVE_PRODUCTTREND_ARR', arr);
        },
        SaveChannelProgressData({ commit }, arr) {
            commit('SAVE_CHANNELPROGRASS_ARR', arr);
        },
        SaveChannelTrendArr({ commit }, arr) {
            commit('SAVE_CHANNELTREND_ARR', arr);
        },
        SaveOrgHomeProgress({ commit }, arr) {
            commit('SAVE_HOMEORGPROGRASS_ARR', arr);
        },
        SaveOrgHomeTrendArr({ commit }, arr) {
            commit('SAVE_ORGHOMETREND_ARR', arr);
        },
        SaveFundHomeProgress({ commit }, arr) {
            commit('SAVE_HOMEFUNDPROGRASS_ARR', arr);
        },
        SaveFundHomeTrendArr({ commit }, arr) {
            commit('SAVE_FUNDHOMETREND_ARR', arr);
        },
        SaveCusHomeProgress({ commit }, arr) {
            commit('SAVE_HOMECUSPROGRASS_ARR', arr);
        },
        SaveCusHomeTrendArr({ commit }, arr) {
            commit('SAVE_CUSHOMETREND_ARR', arr);
        },
        SaveSearchDate({ commit }, date) {
            commit('SAVE_SEARCH_DATE', date);
        }
    }
};

export default home;
