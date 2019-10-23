const budget = {
    state: {
        budgetDepartment: {},
        budgetFactory: {},
        budgetCapacity:{},
    },
    mutations: {
        SAVE_BUDGETDEPART_OBJ: (state, obj) => {
            state.budgetDepartment = obj;
        },
        SAVE_BUDGETFACTORY_OBJ: (state, obj) => {
            state.budgetFactory = obj;
        },
        SAVE_BUDGETCAPACITY_OBJ: (state, obj) => {
            state.budgetCapacity = obj;
        },

    },
    actions: {
        SaveBudgetDepartmentData({ commit }, obj) {
            commit('SAVE_BUDGETDEPART_OBJ', obj);
        },
        SaveBudgetFactoryData({ commit }, obj) {
            commit('SAVE_BUDGETFACTORY_OBJ', obj);
        },
        SaveBudgetCapacityData({ commit }, obj) {
            commit('SAVE_BUDGETCAPACITY_OBJ', obj);
        },
    }
};

export default budget;
