const home = {
  state: {
    productArr: [],
    productTrendArr: [],
    channelArr: [],
    channelTrendArr: [],
  },
  mutations: {
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
    SaveProductProgressData({ commit }, arr) {
      commit('SAVE_HOMEPRODUCT_ARR', arr);
    },
    SaveTrendArr({ commit }, arr) {
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
