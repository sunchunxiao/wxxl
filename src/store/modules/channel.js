const channel = {
    state: {
        tree: {},
        channelProgressArr: [],
        channelTrendArr: [],
        channelStructureArr:[],
        channelRankArr: [],
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
    }
};

export default channel;
