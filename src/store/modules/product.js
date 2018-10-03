
const product = {
    state: {
      customerInfoArr: []
    },
    mutations: {
      SAVE_CUSTOMERINFO: (state, customerInfo) => {
        state.customerInfoArr = customerInfo;
      }
    },
    actions: {
      SaveCustomerInfo ({ commit }, customerInfo) {
        commit('SAVE_CUSTOMERINFO', customerInfo);
      }
    }
  };
  
  export default product;
  