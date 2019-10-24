const budget = {
    state: {
        // budgetFactory: {},
        budgetCapacity:{},
    },
    mutations: {
        // SAVE_BUDGETFACTORY_OBJ: (state, obj) => {
        //     state.budgetFactory = obj;
        // },
        SAVE_BUDGETCAPACITY_OBJ: (state, obj) => {
            state.budgetCapacity = obj;
        },

    },
    actions: {
        // SaveBudgetFactoryData({ commit }, obj) {
        //     commit('SAVE_BUDGETFACTORY_OBJ', obj);
        // },
        SaveBudgetCapacityData({ commit }, obj) {
            commit('SAVE_BUDGETCAPACITY_OBJ', obj);
        },
    }
};

export default budget;
