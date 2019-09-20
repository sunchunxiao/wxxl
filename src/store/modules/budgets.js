const budgets = {
    state: {
        budgetsNowDataArr:[],
        budgetsFirstDataArr:[],
        budgetsreturnDataArr:[],
    },
    mutations: {
        SAVE_BUDGETSNOW_TREE: (state, arr) => {
            state.budgetsNowDataArr = arr;
        },
        SAVE_BUDGETSFIRST_TREE: (state, arr) => {
            state.budgetsFirstDataArr = arr;
        },
        SAVE_BUDGETSRETURN_TREE: (state, arr) => {
            state.budgetsreturnDataArr = arr;
        },

    },
    actions: {
        SaveBudgetsNowData({ commit }, arr) {
            commit('SAVE_BUDGETSNOW_TREE', arr);
        },
        SaveBudgetsFirstData({ commit }, arr) {
            commit('SAVE_BUDGETSFIRST_TREE', arr);
        },
        SaveBudgetsreturnData({ commit }, arr) {
            commit('SAVE_BUDGETSRETURN_TREE', arr);
        },

    }
};

export default budgets;
