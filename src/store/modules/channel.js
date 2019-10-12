const channel = {
    state: {
        tree: {},
        channelProgressArr: [],
        channelTrendArr: [],
        channelStructureArr:[],
        channelRankArr: [],
        channelCompareArr:[],
        channelHistoryArr:[],
        channelLastParams: {},
        channelLastcidObjArr: {},
        channelAchievement: '',
        channelAchievementOpt:'',
        channelReachRadarObj:{},
    },
    mutations: {
        SAVE_CHANNEL_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_CHANPROGRESS_ARR: (state, arr) => {
            state.channelProgressArr = arr;
        },
        SAVE_CHANTREND_ARR: (state, arr) => {
            state.channelTrendArr = arr;
        },
        SAVE_CHANSTRUCTURE_ARR: (state, arr) => {
            state.channelStructureArr = arr;
        },
        SAVE_CHANRANK_ARR: (state, arr) => {
            state.channelRankArr = arr;
        },
        SAVE_CHANCOMPARE_ARR: (state, arr) => {
            state.channelCompareArr = arr;
        },
        CLEAR_CHANCOMPARE_ARR: state => {
            state.channelCompareArr = [];
        },
        SAVE_CHANHISTORY_ARR: (state, arr) => {
            state.channelHistoryArr = arr;
        },
        SAVE_CHANLAST_PARAMS: (state, lastParams) => {
            state.channelLastParams = Object.assign({}, state.channelLastParams, lastParams);
        },
        SAVE_CHANLAST_CIDOBJ: (state, channelLastcidObjArr) => {
            state.channelLastcidObjArr = channelLastcidObjArr;
        },
        SAVE_ACHIEVE_PARAMS: (state, params) => {
            state.channelAchievement = params;
        },
        SAVE_ACHIEVEOPT_PARAMS: (state, params) => {
            state.channelAchievementOpt = params;
        },
        SAVE_CHANNELREACHRADAR_OBJ: (state, obj) => {
            state.channelReachRadarObj = obj;
        },
    },
    actions: {
        SaveChannelTree({ commit }, tree) {
            commit('SAVE_CHANNEL_TREE', tree);
        },
        SaveChannelProgress({ commit }, arr) {
            commit('SAVE_CHANPROGRESS_ARR', arr);
        },
        SaveChannelTrendArr({ commit }, arr) {
            commit('SAVE_CHANTREND_ARR', arr);
        },
        SaveChannelStructureArr({ commit }, arr) {
            commit('SAVE_CHANSTRUCTURE_ARR', arr);
        },
        SaveChannelRankArr({ commit }, arr) {
            commit('SAVE_CHANRANK_ARR', arr);
        },
        SaveChannelCompareArr({ commit }, arr) {
            commit('SAVE_CHANCOMPARE_ARR', arr);
        },
        ClearChannelCompareArr({ commit }) {
            commit('CLEAR_CHANCOMPARE_ARR');
        },
        SaveChannelHistory({ commit }, arr) {
            commit('SAVE_CHANHISTORY_ARR', arr);
        },
        SaveChannelLastParams({ commit }, lastParams) {
            commit('SAVE_CHANLAST_PARAMS', lastParams);
        },
        SaveChannelCidObj({ commit }, channelLastcidObjArr) {
            commit('SAVE_CHANLAST_CIDOBJ', channelLastcidObjArr);
        },
        SaveChannelAchievement({ commit }, params) {
            commit('SAVE_ACHIEVE_PARAMS', params);
        },
        SaveChannelAchievementOpt({ commit }, params) {
            commit('SAVE_ACHIEVEOPT_PARAMS', params);
        },
        //渠道效率综合评估
        SaveChannelReachRadar({ commit }, obj) {
            commit('SAVE_CHANNELREACHRADAR_OBJ', obj);
        },
    }
};

export default channel;
