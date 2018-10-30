const customer = {
    state: {
        tree: {},
        cusprogressArr: [],
        custrendArr: [],
		cusstructureArr:[],
		cusrankArr: [],
    },
    mutations: {
        SAVE_CUESTOMER_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_CUSPROGRESS_ARR: (state, arr) => {
			state.cusprogressArr = arr;
        },
        SAVE_CUSTREND_ARR: (state, arr) => {
			state.custrendArr = arr;
		},
		SAVE_CUSSTRUCTURE_ARR: (state, arr) => {
			state.cusstructureArr = arr;
		},
		SAVE_CUSRANK_ARR: (state, arr) => {
			state.cusrankArr = arr;
		},
    },
    actions: {
        SaveCusTree({ commit }, tree) {
            commit('SAVE_CUESTOMER_TREE', tree);
        },
        SaveCusProgressData({ commit }, arr) {
			commit('SAVE_CUSPROGRESS_ARR', arr);
        },
        SaveCusTrendArr({ commit }, arr) {
			commit('SAVE_CUSTREND_ARR', arr);
		},
		SaveCusStructureArr({ commit }, arr) {
			commit('SAVE_CUSSTRUCTURE_ARR', arr);
		},
		SaveCusRankArr({ commit }, arr) {
			commit('SAVE_CUSRANK_ARR', arr);
		},
    }
};

export default customer;
