const fund = {
    state: {
        tree: {},
        fundprogressArr: [],
    },
    mutations: {
        SAVE_FUND_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_FUNDPROGRESS_ARR: (state, arr) => {
			state.fundprogressArr = arr;
		},
    },
    actions: {
        SaveFundTree({ commit }, tree) {
            commit('SAVE_FUND_TREE', tree);
        },
        SaveFundProgressData({ commit }, arr) {
			commit('SAVE_FUNDPROGRESS_ARR', arr);
		},
    }
};

export default fund;
