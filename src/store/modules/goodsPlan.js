const plan = {
    state: {
        planprogress: {},
        planDepartment: {},
        planFactory: {},
        planCapacity:{},
    },
    mutations: {
        SAVE_PLANPROGRESS_OBJ: (state, obj) => {
            state.planprogress = obj;
        },
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
        SavePlanProgressData({ commit }, obj) {
            commit('SAVE_PLANPROGRESS_OBJ', obj);
        },
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
