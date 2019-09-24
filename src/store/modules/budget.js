const budget = {
    state: {
        budgetNowDataArr:[],
        budgetFirstDataArr:[],
        budgetReturnDataArr:[],
    },
    mutations: {
        SAVE_BUDGETNOW_TREE: (state, arr) => {
            state.budgetNowDataArr = arr;
        },
        SAVE_BUDGETFIRST_TREE: (state, arr) => {
            state.budgetFirstDataArr = arr;
        },
        SAVE_BUDGETRETURN_TREE: (state, arr) => {
            state.budgetReturnDataArr = arr;
        },

    },
    actions: {
        SaveBudgetNowData({ commit }, arr) {
            commit('SAVE_BUDGETNOW_TREE', arr);
        },
        SaveBudgetFirstData({ commit }, arr) {
            commit('SAVE_BUDGETFIRST_TREE', arr);
        },
        SaveBudgetReturnData({ commit }, arr) {
            commit('SAVE_BUDGETRETURN_TREE', arr);
        },

    }
};

export default budget;
