const fund = {
    state: {
        tree: {},
        fundprogressArr: [],
        fundtrendArr: [],
        fundstructureArr1:[],
        fundstructureArr2:[],
        fundrankArr: [],
        fundcompareArr: [],
        fundcompareArrback: [],
        fundhistoryArr:[],
    },
    mutations: {
        SAVE_FUND_TREE: (state, tree) => {
            state.tree = tree;
        },
        SAVE_FUNDPROGRESS_ARR: (state, arr) => {
			state.fundprogressArr = arr;
        },
        SAVE_FUNDTREND_ARR: (state, arr) => {
			state.fundtrendArr = arr;
        },
        SAVE_FUNDSTRUCTURE_ARR1: (state, arr) => {
			state.fundstructureArr1 = arr;
        },
        SAVE_FUNDSTRUCTURE_ARR2: (state, arr) => {
			state.fundstructureArr2 = arr;
        },
        SAVE_RANKRANK_ARR: (state, arr) => {
			state.fundrankArr = arr;
        },
        SAVE_FUNDCOMPARE_ARR: (state, arr) => {
			state.fundcompareArr = arr;
        },
        SAVE_FUNDCOMPAREBACK_ARR: (state, arr) => {
			state.fundcompareArrback = arr;
        },
        SAVE_FUNDHISTORY_ARR: (state, arr) => {
			state.fundhistoryArr = arr;
		},
    },
    actions: {
        SaveFundTree({ commit }, tree) {
            commit('SAVE_FUND_TREE', tree);
        },
        SaveFundProgressData({ commit }, arr) {
			commit('SAVE_FUNDPROGRESS_ARR', arr);
        },
        SaveFundTrendArr({ commit }, arr) {
			commit('SAVE_FUNDTREND_ARR', arr);
        },
        SaveFundStructureArr1({ commit }, arr) {
			commit('SAVE_FUNDSTRUCTURE_ARR1', arr);
        },
        SaveFundStructureArr2({ commit }, arr) {
			commit('SAVE_FUNDSTRUCTURE_ARR2', arr);
        },
        SaveFundRankArr({ commit }, arr) {
			commit('SAVE_RANKRANK_ARR', arr);
        },
        SaveFundCompareArr({ commit }, arr) {
            
			commit('SAVE_FUNDCOMPARE_ARR', arr);
        },
        SaveFundCompareArrback({ commit }, arr) {
			commit('SAVE_FUNDCOMPAREBACK_ARR', arr);
        },
        SaveFundtHistory({ commit }, arr) {
			commit('SAVE_FUNDHISTORY_ARR', arr);
		},
    }
};

export default fund;
