const supply = {
    state: {
        supplyTree: {},
        supplyTreePrograss: [],
        supplyProgressArr: [],
        supplyTrendArr: [],
        supplyRankArr: [],
        supplyStructureArr: [],
        supplyCompareArr: [],
        supplyHistoryArr: [],
        strategyArr: [],
        supplyDateArr: {},
        supplyLastParams: {},
        supplylastcidObjArr: {},
        supplyReachRadarObj:{},
    },
    mutations: {
        SAVE_SUPPLY_TREE: (state, supplyTree) => {
            state.supplyTree = supplyTree;
        },
        SAVE_SUPPLYTREESUPPLY_TREE: (state, arr) => {
            state.supplyTreePrograss = arr;
        },
        SAVE_SUPPLYPROGRESS_ARR: (state, arr) => {
            state.supplyProgressArr = arr;
        },
        SAVE_SUPPLYTREND_ARR: (state, arr) => {
            state.supplyTrendArr = arr;
        },
        SAVE_SUPPLYRANK_ARR: (state, arr) => {
            state.supplyRankArr = arr;
        },
        SAVE_SUPPLYSTRUCTURE_ARR: (state, arr) => {
            state.supplyStructureArr = arr;
        },
        SAVE_SUPPLYCOMPARE_ARR: (state, arr) => {
            state.supplyCompareArr = arr;
        },
        CLEAR_SUPPLYCOMPARE_ARR: state => {
            state.supplyCompareArr = [];
        },
        SAVE_SUPPLYHISTORY_ARR: (state, arr) => {
            state.supplyHistoryArr = arr;
        },
        SAVE_SUPPLYSTRATEGYARR_ARR: (state, arr) => {
            state.strategyArr = arr;
        },
        SAVE_SUPPLYDATE_ARR: (state, arr) => {
            state.supplyDateArr = arr;
        },
        SAVE_SUPPLYLAST_PARAMS: (state, lastParams) => {
            state.supplyLastParams = Object.assign({}, state.lastParams, lastParams);
        },
        SAVE_SUPPLYLAST_CIDOBJ: (state, lastcidObjArr) => {
            state.supplylastcidObjArr = lastcidObjArr;
        },
        SAVE_SUPPLYREACHRADAR_OBJ: (state, obj) => {
            state.supplyReachRadarObj = obj;
        },
    },
    actions: {
        SaveSupplyTree({ commit }, supplyTree) {
            commit('SAVE_SUPPLY_TREE', supplyTree);
        },
        SaveSupplyTreePrograss({ commit }, arr) {
            commit('SAVE_SUPPLYTREESUPPLY_TREE', arr);
        },
        SaveSupplyProgressData({ commit }, arr) {
            commit('SAVE_SUPPLYPROGRESS_ARR', arr);
        },
        SaveSupplyTrendArr({ commit }, arr) {
            commit('SAVE_SUPPLYTREND_ARR', arr);
        },
        SaveSupplyRankArr({ commit }, arr) {
            commit('SAVE_SUPPLYRANK_ARR', arr);
        },
        SaveSupplyStructureArr({ commit }, arr) {
            commit('SAVE_SUPPLYSTRUCTURE_ARR', arr);
        },
        SaveSupplyCompareArr({ commit }, arr) {
            commit('SAVE_SUPPLYCOMPARE_ARR', arr);
        },
        SaveSupplyHistory({ commit }, arr) {
            commit('SAVE_SUPPLYHISTORY_ARR', arr);
        },
        SaveSupplyStrategy({ commit }, arr) {
            commit('SAVE_SUPPLYSTRATEGYARR_ARR', arr);
        },
        ClearSupplyCompareArr({ commit }) {
            commit('CLEAR_SUPPLYCOMPARE_ARR');
        },
        SaveSupplyDate({ commit }, arr) {
            commit('SAVE_SUPPLYDATE_ARR', arr);
        },
        SaveSupplyLastParams({ commit }, lastParams) {
            commit('SAVE_SUPPLYLAST_PARAMS', lastParams);
        },
        SaveSupplycidObjArr({ commit }, lastcidObjArr) {
            commit('SAVE_SUPPLYLAST_CIDOBJ', lastcidObjArr);
        },
        //供应效率综合评估
        SaveSupplyReachRadar({ commit }, obj) {
            commit('SAVE_SUPPLYREACHRADAR_OBJ', obj);
        },
    }
};

export default supply;
