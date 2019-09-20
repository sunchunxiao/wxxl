const goods = {
    state: {
        goodNowDataArr:[],
        goodFirstDataArr:[],
        goodreturnDataArr:[],
    },
    mutations: {
        SAVE_GOODSNOW_TREE: (state, arr) => {
            state.goodNowDataArr = arr;
        },
        SAVE_GOODSFIRST_TREE: (state, arr) => {
            state.goodFirstDataArr = arr;
        },
        SAVE_GOODSRETURN_TREE: (state, arr) => {
            state.goodreturnDataArr = arr;
        },

    },
    actions: {
        SaveGoodNowData({ commit }, arr) {
            commit('SAVE_GOODSNOW_TREE', arr);
        },
        SaveGoodFirstData({ commit }, arr) {
            commit('SAVE_GOODSFIRST_TREE', arr);
        },
        SaveGoodreturnData({ commit }, arr) {
            commit('SAVE_GOODSRETURN_TREE', arr);
        },

    }
};

export default goods;
