
const product = {
    state: {
      tree: {},
      progressArr: [],
      trendArr: [],
      rankArr: [],
      structureArr:[],
      compareArr:{},
      historyArr:{},
			strategyArr:{},
    },
    mutations: {
      SAVE_PRODUCT_TREE: (state, tree) => {
        state.tree = tree;
      },
      SAVE_PROGRESS_ARR: (state, arr) => {
        state.progressArr = arr;
      },
      SAVE_TREND_ARR: (state, arr) => {
        state.trendArr = arr;
      },
      SAVE_RANK_ARR: (state, arr) => {
        state.rankArr = arr;
      },
      SAVE_STRUCTURE_ARR: (state, arr) => {
        state.structureArr = arr;
      },
      SAVE_COMPARE_ARR: (state, arr) => {
        state.compareArr = arr;
      },
      SAVE_HISTORY_ARR: (state, arr) => {
        state.historyArr = arr;
      },
			SAVE_STRATEGYARR_ARR: (state, arr) => {
				state.strategyArr = arr;
			},

    },
    actions: {
      SaveProductTree ({ commit }, tree) {
        commit('SAVE_PRODUCT_TREE', tree);
      },
      SaveProgressData({ commit }, arr) {
        commit('SAVE_PROGRESS_ARR', arr);
      },
      SaveTrendArr({ commit }, arr) {
        commit('SAVE_TREND_ARR', arr);
      },
      SaveRankArr({ commit }, arr) {
        commit('SAVE_RANK_ARR', arr);
      },
      SaveStructureArr({ commit }, arr) {
        commit('SAVE_STRUCTURE_ARR', arr);
      },
      SaveCompareArr({ commit }, arr) {
        commit('SAVE_COMPARE_ARR', arr);
      },
      SaveProductHistory({ commit }, arr) {
        commit('SAVE_HISTORY_ARR', arr);
      },
			SaveProductStrategy({ commit }, arr) {
				commit('SAVE_STRATEGYARR_ARR', arr);
			},

    }
  };

  export default product;

