
const product = {
    state: {
      tree: {}
    },
    mutations: {
      SAVE_PRODUCT_TREE: (state, tree) => {
        state.tree = tree;
      }
    },
    actions: {
      SaveProductTree ({ commit }, tree) {
        commit('SAVE_PRODUCT_TREE', tree);
      }
    }
  };
  
  export default product;
  