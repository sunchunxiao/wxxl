
const organization = {
    state: {
        orgtree: {},
        orgprogressArr: [],
        orgprogressbackArr: [],
        orgtrendArr: [],
        orgstructureArr1:[],
        orgstructureArr2:[],
        orgrankArr: [],
        orgcompareArr: [],
        orgcompareArrback: [],
        orghistoryArr:[],
    },
    mutations: {
        SAVE_ORGANIZATION_TREE: (state, orgtree) => {
            state.orgtree = orgtree;
        },
        SAVE_ORGPROGRESS_ARR: (state, arr) => {
            state.orgprogressArr = arr;
        },
        SAVE_ORGPROGRESSBACK_ARR: (state, arr) => {
            state.orgprogressbackArr = arr;
        },
        SAVE_ORGTREND_ARR: (state, arr) => {
            state.orgtrendArr = arr;
        },
        SAVE_ORGSTRUCTURE_ARR1: (state, arr) => {
            state.orgstructureArr1 = arr;
        },
        SAVE_ORGSTRUCTURE_ARR2: (state, arr) => {
            state.orgstructureArr2 = arr;
        },
        SAVE_ORGRANK_ARR: (state, arr) => {
            state.orgrankArr = arr;
        },
        SAVE_ORGCOMPARE_ARR: (state, arr) => {
            state.orgcompareArr = arr;
        },
        CLEAR_ORGCOMPARE_ARR: state => {
            state.orgcompareArr = [];
        },
        CLEAR_ORGBACKCOMPARE_ARR: state => {
            state.orgcompareArrback = [];
        },
        SAVE_ORGCOMPAREBACK_ARR: (state, arr) => {
            state.orgcompareArrback = arr;
        },
        SAVE_ORGHISTORY_ARR: (state, arr) => {
            state.orghistoryArr = arr;
        },
    },
    actions: {
        SaveOrgTree({ commit }, orgtree) {
            commit('SAVE_ORGANIZATION_TREE', orgtree);
        },
        SaveOrgProgressData({ commit }, arr) {
            commit('SAVE_ORGPROGRESS_ARR', arr);
        },
        SaveOrgBackData({ commit }, arr) {
            commit('SAVE_ORGPROGRESSBACK_ARR', arr);
        },
        SaveOrgTrendArr({ commit }, arr) {
            commit('SAVE_ORGTREND_ARR', arr);
        },
        SaveOrgStructureArr1({ commit }, arr) {
            commit('SAVE_ORGSTRUCTURE_ARR1', arr);
        },
        SaveOrgStructureArr2({ commit }, arr) {
            commit('SAVE_ORGSTRUCTURE_ARR2', arr);
        },
        SaveOrgRankArr({ commit }, arr) {
            commit('SAVE_ORGRANK_ARR', arr);
        },
        SaveOrgCompareArr({ commit }, arr) {
            commit('SAVE_ORGCOMPARE_ARR', arr);
        },
        ClearOrgCompareArr({ commit }) {
            commit('CLEAR_ORGCOMPARE_ARR');
        },
        ClearOrgBackCompareArr({ commit }) {
            commit('CLEAR_ORGBACKCOMPARE_ARR');
        },
        SaveOrgCompareArrback({ commit }, arr) {
            commit('SAVE_ORGCOMPAREBACK_ARR', arr);
        },

        SaveOrgtHistory({ commit }, arr) {
            commit('SAVE_ORGHISTORY_ARR', arr);
        },
    }
};

export default organization;

