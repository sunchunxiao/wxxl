const plan = {
    state: {
        planNowDataArr:[],
        planFirstDataArr:[],
        planReturnDataArr:[],
    },
    mutations: {
        SAVE_PLANNOW_TREE: (state, arr) => {
            state.planNowDataArr = arr;
        },
        SAVE_PLANFIRST_TREE: (state, arr) => {
            state.planFirstDataArr = arr;
        },
        SAVE_PLANRETURN_TREE: (state, arr) => {
            state.planReturnDataArr = arr;
        },

    },
    actions: {
        SavePlanNowData({ commit }, arr) {
            commit('SAVE_PLANNOW_TREE', arr);
        },
        SavePlanFirstData({ commit }, arr) {
            commit('SAVE_PLANFIRST_TREE', arr);
        },
        SavePlanReturnData({ commit }, arr) {
            commit('SAVE_PLANRETURN_TREE', arr);
        },

    }
};

export default plan;
