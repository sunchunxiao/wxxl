
const organization = {
    state: {
        orgscore:'',
        orgid:'',
        detailrank:'',
        orgtree: {},
        orgprogressArr: [],
        orgprogressbackArr: [],
        orgtrendArr: [],
        orgsortArr:[],
        orgstructureArr1:[],
        orgstructureArr2:[],
        orgrankArr: [],
        orgradarArr: [],
        orggossipArr:[],
        orgPosArr:[],
        orgcompareArr: [],
        orgcompareArrback: [],
        orghistoryArr:[],
        orglastParams: {},
        managelastParams:{},
        orgLastcidObjArr: {},
        orgLastcidObjArrBack: {},
        orgAchievement: '',
        orgAchievementOpt: ''
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
        SAVE_ORGSORT_ARR: (state, arr) => {
            state.orgsortArr = arr;
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
        SAVE_ORGRADAR_ARR: (state, arr) => {
            state.orgradarArr = arr;
        },
        SAVE_ORGGOSSIP_ARR: (state, arr) => {
            state.orggossipArr = arr;
        },
        SAVE_ORGPOS_ARR: (state, arr) => {
            state.orgPosArr = arr;
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
        SAVE_ORGLAST_PARAMS: (state, lastParams) => {
            state.orglastParams = Object.assign({}, state.orglastParams, lastParams);
        },
        SAVE_MANAGELAST_PARAMS: (state, lastParams) => {
            state.managelastParams = Object.assign({}, state.managelastParams, lastParams);
        },
        SAVE_ORGLAST_CIDOBJ: (state, lastParams) => {
            state.orgLastcidObjArr = lastParams;
        },
        SAVE_ORGLAST_CIDOBJBACK: (state, lastParams) => {
            state.orgLastcidObjArrBack = lastParams;
        },
        SAVE_ORGSCORE: (state, score) => {
            state.orgscore = score;
        },
        SAVE_ORGID: (state, id) => {
            state.orgid = id;
        },
        SAVE_DetailRank: (state, rank) => {
            state.detailrank = rank;
        },
        SAVE_ACH_PARAMS: (state, params) => {
            state.orgAchievement = params;
        },
        SAVE_ACHOPT_PARAMS: (state, params) => {
            state.orgAchievementOpt = params;
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
        SaveOrgSort({ commit }, arr) {
            commit('SAVE_ORGSORT_ARR', arr);
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
        SaveOrgRadarArr({ commit }, arr) {
            commit('SAVE_ORGRADAR_ARR', arr);
        },
        SaveOrgGossipArr({ commit }, arr) {
            commit('SAVE_ORGGOSSIP_ARR', arr);
        },
        SaveOrgPosArr({ commit }, arr) {
            commit('SAVE_ORGPOS_ARR', arr);
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
        SaveOrgLastParams({ commit }, lastParams) {
            commit('SAVE_ORGLAST_PARAMS', lastParams);
        },
        SaveManageLastParams({ commit }, lastParams) {
            commit('SAVE_MANAGELAST_PARAMS', lastParams);
        },
        SaveOrgCidObj({ commit }, lastParams) {
            commit('SAVE_ORGLAST_CIDOBJ', lastParams);
        },
        SaveOrgCidObjBack({ commit }, lastParams) {
            commit('SAVE_ORGLAST_CIDOBJBACK', lastParams);
        },
        SaveOrgScore({ commit }, score) {
            commit('SAVE_ORGSCORE', score);
        },
        SaveOrgId({ commit }, id) {
            commit('SAVE_ORGID', id);
        },
        SaveDetailRank({ commit }, rank) {
            commit('SAVE_DetailRank', rank);
        },
        SaveOrgAchievement({ commit }, params) {
            commit('SAVE_ACH_PARAMS', params);
        },
        SaveOrgAchievementOpt({ commit }, params) {
            commit('SAVE_ACHOPT_PARAMS', params);
        },
    }
};

export default organization;

