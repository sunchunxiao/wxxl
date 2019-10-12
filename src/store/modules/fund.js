const fund = {
    state: {
        tree: {},
        fundprogressArr: [],
        fundprogressbackArr: [],
        fundtrendArr: [],
        fundstructureArr1: [],
        fundstructureArr2: [],
        fundrankArr: [],
        fundcompareArr: [],
        fundcompareArrback: [],
        fundhistoryArr: [],
        fundlastParams: {},
        fundLastcidObjArr: {},
        fundLastcidObjArrBack: {},
        fundAchievement: '',
        fundAchievementOpt: '',
        fundReachRadarObj:{},
    },
    mutations: {
        SAVE_FUND_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_FUNDPROGRESS_ARR: (state, arr) => {
            state.fundprogressArr = arr;
        },
        SAVE_FUNDBACKPROGRESS_ARR: (state, arr) => {
            state.fundprogressbackArr = arr;
        },
        SAVE_FUNDTREND_ARR: (state, arr) => {
            state.fundtrendArr = arr;
        },
        SAVE_FUNDSTRUCTURE_ARR1: (state, arr) => {
            state.fundstructureArr1 = arr;
        },
        SAVE_FUNDSTRUCTURE_ARR2: (state, arr) => {
            state.fundstructureArr2 = arr;
        },
        SAVE_RANKRANK_ARR: (state, arr) => {
            state.fundrankArr = arr;
        },
        SAVE_FUNDCOMPARE_ARR: (state, arr) => {
            state.fundcompareArr = arr;
        },
        SAVE_FUNDCOMPAREBACK_ARR: (state, arr) => {
            state.fundcompareArrback = arr;
        },
        CLEAR_FUNDCOMPARE_ARR: state => {
            state.fundcompareArr = [];
        },
        CLEAR_FUNDBACKCOMPARE_ARR: state => {
            state.fundcompareArrback = [];
        },
        SAVE_FUNDHISTORY_ARR: (state, arr) => {
            state.fundhistoryArr = arr;
        },
        SAVE_FUNDLAST_PARAMS: (state, lastParams) => {
            state.fundlastParams = Object.assign({}, state.fundlastParams, lastParams);
        },
        SAVE_FUNDLAST_CIDOBJ: (state, lastParams) => {
            state.fundLastcidObjArr = lastParams;
        },
        SAVE_FUNDLAST_CIDOBJBACK: (state, lastParams) => {
            state.fundLastcidObjArrBack = lastParams;
        },
        SAVE_FUNDACH_PARAMS: (state, params) => {
            state.fundAchievement = params;
        },
        SAVE_FUNDACHOPT_PARAMS: (state, params) => {
            state.fundAchievementOpt = params;
        },
        SAVE_FUNDREACHRADAR_OBJ: (state, obj) => {
            state.fundReachRadarObj = obj;
        },
    },
    actions: {
        SaveFundTree({ commit }, tree) {
            commit('SAVE_FUND_TREE', tree);
        },
        SaveFundProgressData({ commit }, arr) {
            commit('SAVE_FUNDPROGRESS_ARR', arr);
        },
        SaveFundBackData({ commit }, arr) {
            commit('SAVE_FUNDBACKPROGRESS_ARR', arr);
        },
        SaveFundTrendArr({ commit }, arr) {
            commit('SAVE_FUNDTREND_ARR', arr);
        },
        SaveFundStructureArr1({ commit }, arr) {
            commit('SAVE_FUNDSTRUCTURE_ARR1', arr);
        },
        SaveFundStructureArr2({ commit }, arr) {
            commit('SAVE_FUNDSTRUCTURE_ARR2', arr);
        },
        SaveFundRankArr({ commit }, arr) {
            commit('SAVE_RANKRANK_ARR', arr);
        },
        SaveFundCompareArr({ commit }, arr) {
            commit('SAVE_FUNDCOMPARE_ARR', arr);
        },
        SaveFundCompareArrback({ commit }, arr) {
            commit('SAVE_FUNDCOMPAREBACK_ARR', arr);
        },
        ClearFundCompareArr({ commit }) {
            commit('CLEAR_FUNDCOMPARE_ARR');
        },
        ClearFundBackCompareArr({ commit }) {
            commit('CLEAR_FUNDBACKCOMPARE_ARR');
        },
        SaveFundtHistory({ commit }, arr) {
            commit('SAVE_FUNDHISTORY_ARR', arr);
        },
        SaveFundLastParams({ commit }, lastParams) {
            commit('SAVE_FUNDLAST_PARAMS', lastParams);
        },
        SaveFundCidObj({ commit }, lastParams) {
            commit('SAVE_FUNDLAST_CIDOBJ', lastParams);
        },
        SaveFundCidObjBack({ commit }, lastParams) {
            commit('SAVE_FUNDLAST_CIDOBJBACK', lastParams);
        },
        SaveFundAchievement({ commit }, params) {
            commit('SAVE_FUNDACH_PARAMS', params);
        },
        SaveFundAchievementOpt({ commit }, params) {
            commit('SAVE_FUNDACHOPT_PARAMS', params);
        },
        //资金效率综合评估
        SaveFundReachRadar({ commit }, obj) {
            commit('SAVE_FUNDREACHRADAR_OBJ', obj);
        },
    }
};

export default fund;
