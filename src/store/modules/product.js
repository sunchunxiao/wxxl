const product = {
    state: {
        tree: {},
        tree1: false,
        treePrograss: [],
        progressArr: [],
        trendArr: [],
        rankArr: [],
        structureArr: [],
        compareArr: [],
        historyArr: [],
        strategyArr: [],
        productDateArr: {},
        lastParams: {},
        lastcidObjArr: {},
        productAchievement: '',
        productAchievementOpt: ''
    },
    mutations: {
        SAVE_PRODUCT_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_PRODUCT_TREE1: (state, tree1) => {
            state.tree1 = tree1;
        },
        SAVE_TREEPRODUCT_TREE: (state, arr) => {
            state.treePrograss = arr;
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
        CLEAR_COMPARE_ARR: state => {
            state.compareArr = [];
        },
        SAVE_HISTORY_ARR: (state, arr) => {
            state.historyArr = arr;
        },
        SAVE_STRATEGYARR_ARR: (state, arr) => {
            state.strategyArr = arr;
        },
        SAVE_PRODUCEDATE_ARR: (state, arr) => {
            state.productDateArr = arr;
        },
        SAVE_LAST_PARAMS: (state, lastParams) => {
            state.lastParams = Object.assign({}, state.lastParams, lastParams);
        },
        SAVE_LAST_CIDOBJ: (state, lastcidObjArr) => {
            state.lastcidObjArr = lastcidObjArr;
        },
        SAVE_ACHIEVE_PARAMS: (state, params) => {
            state.productAchievement = params;
        },
        SAVE_ACHIEVEOPT_PARAMS: (state, params) => {
            state.productAchievementOpt = params;
        },

    },
    actions: {
        SaveProductTree({ commit }, tree) {
            commit('SAVE_PRODUCT_TREE', tree);
        },
        SaveProductTree1({ commit }, tree1) {
            commit('SAVE_PRODUCT_TREE1', tree1);
        },
        SaveProductTreePrograss({ commit }, arr) {
            commit('SAVE_TREEPRODUCT_TREE', arr);
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
        ClearCompareArr({ commit }) {
            commit('CLEAR_COMPARE_ARR');
        },
        SaveProductDate({ commit }, arr) {
            commit('SAVE_PRODUCEDATE_ARR', arr);
        },
        SaveLastParams({ commit }, lastParams) {
            commit('SAVE_LAST_PARAMS', lastParams);
        },
        SavecidObjArr({ commit }, lastcidObjArr) {
            commit('SAVE_LAST_CIDOBJ', lastcidObjArr);
        },
        SaveProAchievement({ commit }, params) {
            commit('SAVE_ACHIEVE_PARAMS', params);
        },
        SaveProAchievementOpt({ commit }, params) {
            commit('SAVE_ACHIEVEOPT_PARAMS', params);
        },
    }
};

export default product;
