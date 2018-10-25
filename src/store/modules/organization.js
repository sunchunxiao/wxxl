
const organization = {
    state: {
      orgtree: {},
    },
    mutations: {
      SAVE_ORGANIZATION_TREE: (state, orgtree) => {
        state.orgtree = orgtree;
      },
    },
    actions: {
      SaveOrgTree ({ commit }, orgtree) {
        commit('SAVE_ORGANIZATION_TREE', orgtree);
      },
    }
  };
  
  export default organization;
  
