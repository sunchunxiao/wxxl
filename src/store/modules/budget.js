const budget = {
    state: {
        budgetprogress: {},
        budgetDepartment: {},
        budgetFactory: {},
        budgetCapacity:{},
    },
    mutations: {
        SAVE_BUDGETPROGRESS_OBJ: (state, obj) => {
            state.budgetprogress = obj;
        },
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
        SaveBudgetProgressData({ commit }, obj) {
            commit('SAVE_BUDGETPROGRESS_OBJ', obj);
        },
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
