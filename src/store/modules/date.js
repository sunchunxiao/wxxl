const date = {
    state: {
        date: {}
    },
    mutations: {
        SAVE_DATE: (state, date) => {
            state.date = date;
        }
    },
    actions: {
        SaveDate({ commit }, date) {
            commit('SAVE_DATE', date);
        }
    }
};

export default date;
