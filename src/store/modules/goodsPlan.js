const plan = {
    state: {
        planDepartment: {},
        planFactory: {},
        planCapacity:{},
    },
    mutations: {
        SAVE_PLANDEPART_OBJ: (state, obj) => {
            state.planDepartment = obj;
        },
        SAVE_PLANFACTORY_OBJ: (state, obj) => {
            state.planFactory = obj;
        },
        SAVE_PLANCAPACITY_OBJ: (state, obj) => {
            state.planCapacity = obj;
        },
    },
    actions: {
        SavePlanDepartmentData({ commit }, obj) {
            commit('SAVE_PLANDEPART_OBJ', obj);
        },
        SavePlanFactoryData({ commit }, obj) {
            commit('SAVE_PLANFACTORY_OBJ', obj);
        },
        SavePlanCapacityData({ commit }, obj) {
            commit('SAVE_PLANCAPACITY_OBJ', obj);
        },
    }
};

export default plan;
