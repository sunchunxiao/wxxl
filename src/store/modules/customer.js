const customer = {
    state: {
        tree: {},
    },
    mutations: {
        SAVE_CUESTOMER_TREE: (state, tree) => {
            state.tree = tree;
        },
    },
    actions: {
        SaveCusTree({
            commit
        }, tree) {
            commit('SAVE_CUESTOMER_TREE', tree);
        },
    }
};

export default customer;