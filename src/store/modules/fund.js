const fund = {
    state: {
        tree: {},
    },
    mutations: {
        SAVE_FUND_TREE: (state, tree) => {
            state.tree = tree;
        },
    },
    actions: {
        SaveFundTree({
            commit
        }, tree) {
            commit('SAVE_FUND_TREE', tree);
        },
    }
};

export default fund;