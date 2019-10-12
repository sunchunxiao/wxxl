const customer = {
    state: {
        tree: {},
        cusprogressArr: [],
        custrendArr: [],
        cusstructureArr:[],
        cusrankArr: [],
        cuscompareArr: [],
        cushistoryArr:[],
        cusLastParams: {},
        cusLastcidObjArr: {},
        cusAchievement: '',
        cusAchievementOpt: '',
        cusReachRadarObj:{},
    },
    mutations: {
        SAVE_CUESTOMER_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_CUSPROGRESS_ARR: (state, arr) => {
            state.cusprogressArr = arr;
        },
        SAVE_CUSTREND_ARR: (state, arr) => {
            state.custrendArr = arr;
        },
        SAVE_CUSSTRUCTURE_ARR: (state, arr) => {
            state.cusstructureArr = arr;
        },
        SAVE_CUSRANK_ARR: (state, arr) => {
            state.cusrankArr = arr;
        },
        SAVE_CUSCOMPARE_ARR: (state, arr) => {
            state.cuscompareArr = arr;
        },
        CLEAR_CUSCOMPARE_ARR: state => {
            state.cuscompareArr = [];
        },
        SAVE_CUSHISTORY_ARR: (state, arr) => {
            state.cushistoryArr = arr;
        },
        SAVE_CUSLAST_PARAMS: (state, lastParams) => {
            state.cusLastParams = Object.assign({}, state.cusLastParams, lastParams);
        },
        SAVE_CUSLAST_CIDOBJ: (state, cusLastcidObjArr) => {
            state.cusLastcidObjArr = cusLastcidObjArr;
        },
        SAVE_CUSACH_PARAMS: (state, params) => {
            state.cusAchievement = params;
        },
        SAVE_CUSACHOPT_PARAMS: (state, params) => {
            state.cusAchievementOpt = params;
        },
        SAVE_CUSREACHRADAR_OBJ: (state, obj) => {
            state.cusReachRadarObj = obj;
        },
    },
    actions: {
        SaveCusTree({ commit }, tree) {
            commit('SAVE_CUESTOMER_TREE', tree);
        },
        SaveCusProgressData({ commit }, arr) {
            commit('SAVE_CUSPROGRESS_ARR', arr);
        },
        SaveCusTrendArr({ commit }, arr) {
            commit('SAVE_CUSTREND_ARR', arr);
        },
        SaveCusStructureArr({ commit }, arr) {
            commit('SAVE_CUSSTRUCTURE_ARR', arr);
        },
        SaveCusRankArr({ commit }, arr) {
            commit('SAVE_CUSRANK_ARR', arr);
        },
        SaveCusCompareArr({ commit }, arr) {
            commit('SAVE_CUSCOMPARE_ARR', arr);
        },
        ClearCusCompare({ commit }) {
            commit('CLEAR_CUSCOMPARE_ARR');
        },
        SaveCustHistory({ commit }, arr) {
            commit('SAVE_CUSHISTORY_ARR', arr);
        },
        SaveCustLastParams({ commit }, lastParams) {
            commit('SAVE_CUSLAST_PARAMS', lastParams);
        },
        SaveCusCidObj({ commit }, cusLastcidObjArr) {
            commit('SAVE_CUSLAST_CIDOBJ', cusLastcidObjArr);
        },
        SaveCusAchievement({ commit }, params) {
            commit('SAVE_CUSACH_PARAMS', params);
        },
        SaveCusAchievementOpt({ commit }, params) {
            commit('SAVE_CUSACHOPT_PARAMS', params);
        },
        //客户效率综合评估
        SaveCusReachRadar({ commit }, obj) {
            commit('SAVE_CUSREACHRADAR_OBJ', obj);
        },
    }
};

export default customer;
