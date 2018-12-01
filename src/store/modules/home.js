const home = {
    state: {
        overviewArr: [],
        overviewTrendArr: [],
        productArr: [],
        productTrendArr: [],
        channelArr: [],
        channelTrendArr: [],
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
    }
};

export default home;
