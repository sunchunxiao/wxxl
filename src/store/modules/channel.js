const channel = {
    state: {
        tree: {},
    },
    mutations: {
        SAVE_CHANNEL_TREE: (state, tree) => {
            state.tree = tree;
        },
    },
    actions: {
        SaveChannelTree({
            commit
        }, tree) {
            commit('SAVE_CHANNEL_TREE', tree);
        },
    }
};

export default channel;
