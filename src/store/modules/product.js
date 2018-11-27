
const product = {
    state: {
      tree: {},
      treePrograss:[],
      progressArr: [],
      trendArr: [],
      rankArr: [],
      structureArr:[],
      compareArr:[],
      historyArr:[],
      strategyArr:[],
      productDateArr:{}
    },
    mutations: {
      SAVE_PRODUCT_TREE: (state, tree) => {
        state.tree = tree;
      },
      SAVE_TREEPRODUCT_TREE: (state, arr) => {
        state.treePrograss = arr;
      },
      SAVE_PROGRESS_ARR: (state, arr) => {
        state.progressArr = arr;
      },
      SAVE_TREND_ARR: (state, arr) => {
        state.trendArr = arr;
      },
      SAVE_RANK_ARR: (state, arr) => {
        state.rankArr = arr;
      },
      SAVE_STRUCTURE_ARR: (state, arr) => {
        state.structureArr = arr;
      },
      SAVE_COMPARE_ARR: (state, arr) => {
        state.compareArr = arr;
      },
      CLEAR_COMPARE_ARR: state => {
        state.compareArr = [];
      },
      SAVE_HISTORY_ARR: (state, arr) => {
        state.historyArr = arr;
      },
			SAVE_STRATEGYARR_ARR: (state, arr) => {
				state.strategyArr = arr;
      },
      SAVE_PRODUCEDATE_ARR: (state, arr) => {
				state.productDateArr = arr;
			},

    },
    actions: {
      SaveProductTree ({ commit }, tree) {
        commit('SAVE_PRODUCT_TREE', tree);
      },
      SaveProductTreePrograss ({ commit,state },data) {
        // console.log(state.tree,data);
        // const { tree } = state;
        const treeClone = _.cloneDeep(state.tree);
                                          
        // function preOrder(node){
        //   console.log(node);
        //   var childs = node,item;      
        //   for(var i=0; i < childs.length ; i++){
        //       item = childs[i];
        //       if(item.cid == i){
        //       //递归先序遍历子节点
        //          return preOrder(item);
        //       }
        //   }
        // }
        
        for(let i in data){
          // console.log(i);
        //   preOrder(treeClone.children);
          
        //   _.find(preOrder,o=>{
        //       if(o.cid==i){
        //         _.forEach(o.children,(v)=>{
        //           console.log(v);
        //           if(v.cid==i){
        //             v.real_total = data[i].real;
        //             v.target_total = data[i].target;
        //           }
        //         });
                    
        //       }
        //   });

          treeClone.children.find(el => {
            if(el.cid==i){
              el.real_total = data[i].real;
              el.target_total = data[i].target;
            }
            // return el.id == i;
          });
          if(treeClone.cid==i){
            treeClone.real_total = data[i].real;
            treeClone.target_total = data[i].target;
          }
        }
        commit('SAVE_PRODUCT_TREE',treeClone);
        
      },
      SaveProgressData({ commit }, arr) {
        commit('SAVE_PROGRESS_ARR', arr);
      },
      SaveTrendArr({ commit }, arr) {
        commit('SAVE_TREND_ARR', arr);
      },
      SaveRankArr({ commit }, arr) {
        commit('SAVE_RANK_ARR', arr);
      },
      SaveStructureArr({ commit }, arr) {
        commit('SAVE_STRUCTURE_ARR', arr);
      },
      SaveCompareArr({ commit }, arr) {
        commit('SAVE_COMPARE_ARR', arr);
      },
      SaveProductHistory({ commit }, arr) {
        commit('SAVE_HISTORY_ARR', arr);
      },
			SaveProductStrategy({ commit }, arr) {
				commit('SAVE_STRATEGYARR_ARR', arr);
      },
      ClearCompareArr({ commit }) {
        commit('CLEAR_COMPARE_ARR');
      },
      SaveProductDate({ commit },arr) {
        commit('SAVE_PRODUCEDATE_ARR', arr );
      }
    }
  };

  export default product;

