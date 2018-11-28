<template>
  <div class="contrast">
    <el-row>
      <search-bar 
        @search="handleSearch"
        ref="child"
        url="/org/search" />
    </el-row>
    <el-row 
      class="content_row" 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container">
        <div class="padding_top">
          <el-button 
            @click="cleanChecked"
            size="mini" 
            class="clean_btn">清空选择</el-button>
        </div>
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ organizationTree.name }}</span>
          <span
            v-if="organizationTree.children"
            class="right">{{ calculatePercent(organizationTree.real_total, organizationTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          empty-text="正在加载"
          ref="tree"
          node-key="cid"
          check-strictly
          :data="organizationTree.children" 
          :props="defaultProps" 
          :default-expanded-keys="nodeArr"
          show-checkbox
          @check-change="handleCheckChange">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <el-tooltip 
              class="item" 
              effect="dark" 
              placement="right"> 
              <div slot="content">
                <div class="tooltip_margin bold">品类:{{ data.name }}</div>
                <div class="tooltip_margin">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                <div 
                  v-if="data.children"
                  class="tooltip_margin">子项目数 : {{ data.children.length }}</div>
                <div>毛利目标达成率: {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
              </div>
              <span class="label">
                <span class="label_left">{{ data.name }}</span>
                <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
              </span>
            </el-tooltip>
            <!-- <span class="label">{{ data.name }}</span> -->
            
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="19" 
        class="overflow">
        <el-row v-loading="loading">
          <Card v-if="type==1||type==3">
            <el-row class="card-title">组织对比分析和平均值分析前端</el-row>
            <el-row v-if="orgcompareArr.length > 0">
              <el-col :span="6">
                <template v-for="(item, index) in orgcompareArr">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(0 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item.subject_name" 
                      :id="`${index}`" 
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="18" 
                v-if="orgcompareArr.length > 0">
                <ConOrgComparisonAverageBig 
                  :title="orgcompareArr[index0].subject_name" 
                  :data="orgcompareArr[index0]" 
                  id="ConOrgComparisonAverage"
                  :index="index0" />
              </el-col>
            </el-row>
            <el-row 
              v-else 
              class="please_select">
              请选择要对比的项目
            </el-row>
          </Card>
          <Card v-if="type==2||type==3">
            <el-row class="card-title">组织对比分析和平均值分析后端</el-row>
            <el-row v-if="orgcompareArrback.length > 0">
              <el-col :span="6">
                <template v-for="(item, index) in orgcompareArrback">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(1 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item.subject_name" 
                      :id="`${index+orgcompareArr.length}`" 
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="18" 
                v-if="orgcompareArrback.length > 0">
                <ConOrgComparisonAverageBig 
                  :title="orgcompareArrback[index1].subject_name" 
                  :data="orgcompareArrback[index1]" 
                  id="ConOrgComparisonAverage1"
                  :index="index0" />
              </el-col>
            </el-row>
            <el-row 
              v-else 
              class="please_select">
              请选择要对比的项目
            </el-row>
          </Card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import API from './api';
	import Card from '../../components/Card';
	import SearchBar from 'components/SearchBarOrg';
	// 组织对比分析和平均值分析
	import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
	import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';

    import { mapGetters } from 'vuex';
    const TREE_PROPS = {
        children: 'children',
        label: 'name'
    };
    // const TIMEPT = {
    //     '周': 'week',
    //     '月': 'month',
    //     '季': 'quarter',
    //     '年': 'year'
    // };

	export default {
		components: {
			Card,
			SearchBar,
			ConOrgComparisonAverage,
			ConOrgComparisonAverageBig
		},
		data() {
			return {
				form: {
					pt: '月',
					date: [],
					search: '',
					subject: 'S', // S: 销售额 P: 利润额
					version: '0'
				},
				loading: false,
				cid: 1,
				defaultProps: TREE_PROPS,
				index0: 0,
				index1: 0,
				length:0,
				type:3,
				val:{},
				post:1,
				nodeArr:[],
				cidObjArr:[],
				cidObjBackArr:[],
				cancelKey: '',
				isFirstLoad: true,
				debounce: null,
				debounceBack:null,
			};
		},
		computed: {
			...mapGetters(['organizationTree', 'orgprogressArr','orgprogressbackArr', 'orgcompareArr','orgcompareArrback']),
			hasTree() {
				return !_.isEmpty(this.organizationTree);
			}
		},
		watch: {
			cidObjArr(val) {
						if (val.length > 0) {
								this.debounce();
						} else if (val.length === 0) {
								this.$store.dispatch('ClearOrgCompareArr');
						}
			},
			cidObjBackArr(val) {
						if (val.length > 0) {
								this.debounceBack();
						} else if (val.length === 0) {
								this.$store.dispatch('ClearOrgBackCompareArr');
						}
			},				

		},
		created() {
            // 防抖函数 减少发请求次数
            this.debounce = _.debounce(this.getCompare, 1000);
            this.debounceBack = _.debounce(this.getCompareBack, 1000);
    },
		mounted() {
			if(this.organizationTree.children){
					let arr = [];
					let arrback = [];
					for(let i = 0; i < this.organizationTree.children.length; i++) {
							if(this.organizationTree.children[i].type==1){
													this.organizationTree.children[i] && arr.push(this.organizationTree.children[i]);
							}else if(this.organizationTree.children[i].type==2){
											this.organizationTree.children[i] && arrback.push(this.organizationTree.children[i]);
							} 
					}
					const checkKeys = arr.map(i => i.cid);
					const checkBackKeys = arrback.map(i => i.cid);
					const cc=[...checkKeys,...checkBackKeys];
					this.$refs.tree.setCheckedKeys(cc);
			}else{
					Promise.all([this.getTree(), this.getProgressbefore(),this.getProgressback()]).then(res => {
								// 树
                const treeData = res[0];
                const children = treeData.tree.children;
								let arr = [];
								let arrback = [];
                
								for(let i = 0; i < children.length; i++) {
									if(children[i].type==1){
												children[i] && arr.push(children[i]);
									}else if(children[i].type==2){
											children[i] && arrback.push(children[i]);
									} 
                }
								// this.cidObjArr = arr;
								// this.cidObjBackArr = arrback;
								const checkKeys = arr.map(i => i.cid);
								const checkBackKeys = arrback.map(i => i.cid);
								const cc=[...checkKeys,...checkBackKeys];
								
								this.$store.dispatch('SaveOrgTree', treeData.tree).then(() => {
                    this.$refs.tree.setCheckedKeys(cc);
                });

                const progressData = res[1];
                this.$store.dispatch('SaveOrgProgressData', progressData.data);
                // 后端指标
                const progressbackData = res[2];
								this.$store.dispatch('SaveOrgBackData', progressbackData.data);
						});
			}

		},

		methods: {
			
			getTree() {
						const params = {
								subject: this.form.subject,
								...this.getPeriodByPt(),
								version: this.form.version
						};
						return API.GetOrgTree(params);
			},
			getProgressbefore() {
					const params = {
							rType:1
					};
					return API.GetOrgSubject(params);
			},
			getProgressback() {
					const params = {
							rType:2
					};
					return API.GetOrgSubject(params);
			},
			getCompare() {
					if(!this.cidObjArr.length){
							return;
					}
					const promises = _.map(this.orgprogressArr, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
							_.forEach(resultList, (v, k) => {
									v.subject = this.orgprogressArr[k].subject;
									v.subject_name = this.orgprogressArr[k].subject_name;
							});
							const cidName = this.cidObjArr.map(o => o.name);
							// 只有当返回的跟当前选中的一样才更新 store
							if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
									this.$store.dispatch('SaveOrgCompareArr', resultList);
							}
					});
			},
			getCompareBack() {
					if(!this.cidObjBackArr.length){
							return;
					}
					const promises = _.map(this.orgprogressbackArr, o => this.getTrendback(o.subject));
					Promise.all(promises).then(resultList => {
							_.forEach(resultList, (v, k) => {
									v.subject = this.orgprogressbackArr[k].subject;
									v.subject_name = this.orgprogressbackArr[k].subject_name;
							});
							const cidName = this.cidObjBackArr.map(o => o.name);
							// 只有当返回的跟当前选中的一样才更新 store
							if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
									this.$store.dispatch('SaveOrgCompareArrback', resultList);
							}
					});
      },
			getTrend(subject) {
						let params = {
								...this.getPeriodByPt(),
								subject: subject,
								version: this.form.version,
								rType: 1
						};
						const checkKeys = this.cidObjArr.map(i => i.cid);
						params.targets = checkKeys.join(',');
						return API.GetOrgCompare(params);
			},

			getTrendback(subject) {
				let params = {
							...this.getPeriodByPt(),
							subject: subject,
							version: this.form.version,
					};
					const checkKeys = this.cidObjBackArr.map(i => i.cid);
					params.targets = checkKeys.join(',');
					return API.GetOrgCompare(params);
			},
			getPeriodByPt() {
						const {
								sDate,
								eDate
						} = this.getDateObj();
						// const {
						//     pt
						// } = this.form;
						// console.log(sDate,eDate);
						if(sDate && eDate) { // 计算时间周期
										return {
												pt:this.val.pt,
												sDate: this.val.sDate,
												eDate: this.val.eDate,
										};
						} else {
										return {
												pt:'月',
												sDate: '2018-01-01',
												eDate: '2018-05-01',
												// 先写死个时间
												// sDate: moment().startOf('week').format('YYYY-MM-DD'),
												// eDate: moment().format('YYYY-MM-DD'),
										};
						}
      },
			getDateObj() {
					const {
							date
					} = this.form;
					// console.log(this.val.eDate);
					if(this.val.sDate!=undefined&&this.val.eDate!=undefined){
							return {
							sDate: this.val.sDate,
							eDate: this.val.eDate,
					};
					}else{
							return {
							sDate: date[0] || '',
							eDate: date[1] || '',
					};
					}
      },
			handleSearch(val) {
				this.nodeArr = [];
        this.nodeArr.push(val.cid);
				this.loading = true;
				this.val = val;
				if(val.cid!=""){
						this.cid = val.cid;
				}else{
					this.getTree();
						this.getProgressbefore();	      
						this.getProgressback();
				}
				setTimeout(() => {		       
						this.loading = false;
				}, 1000);
						
		},
			cleanChecked() {
						this.cidObjArr = [];
						this.cidObjBackArr = [];
						this.$refs.tree.setCheckedKeys([]);
      },
			handleCheckChange(data, checked) {
				// this.type = data.type;
						// 取消选择多于 4 个的后面的值 这个是为了在 setCheckedKeys 时, 第四个以后的都会取消选择
						// 组件第二次加载的时候, tree.setCheckedKeys 后会调用 handleCheckChange 应该是 tree 的一个bug 所以我们暂时用一个标志来防止它进入后面的流程
						if(!checked && this.cancelKey && data.cid === this.cancelKey) {
								return;
						}
						if (checked) { // 如果选中
								if(data.type==2){
										// 如果有选中的节点 并且此次选择了不同pid的节点
										if (this.cidObjBackArr[0] && data.parent_id !== this.cidObjBackArr[0].parent_id) {
												this.warn('请选择相同父级下的进行对比');
												this.cancelKey = data.cid;

												const checkKeys = this.cidObjArr.map(i => i.cid);
												const checkBackKeys = this.cidObjBackArr.map(i => i.cid);
												const cc = [...checkKeys,...checkBackKeys];
												this.$refs.tree.setCheckedKeys(cc);
												return;
										}
										this.cidObjBackArr.push(data);
										// else if (this.cidObjArr.length === 4) {
										// 		this.warn('最多对比 4 条');
										// 		this.cancelKey = data.cid;
										// 		const checkKeys = this.cidObjArr.map(i => i.cid);
										// 		this.$refs.tree.setCheckedKeys(checkKeys);
										// }
								}else{
                    // 如果有选中的节点 并且此次选择了不同pid的节点
										if (this.cidObjArr[0] && data.parent_id !== this.cidObjArr[0].parent_id) {
												this.warn('请选择相同父级下的进行对比');
												this.cancelKey = data.cid;
												const checkKeys = this.cidObjArr.map(i => i.cid);
												const checkBackKeys = this.cidObjBackArr.map(i => i.cid);
												const cc = [...checkKeys,...checkBackKeys];
												this.$refs.tree.setCheckedKeys(cc);
												return;
										}
										this.cidObjArr.push(data);
										// 如果选中的个数不超过 4
										// if (this.cidObjArr.length < 4) {
										// 		this.cidObjArr.push(data);
										// } else if (this.cidObjArr.length === 4) {
										// 		this.warn('最多对比 4 条');
										// 		this.cancelKey = data.cid;
										// 		const checkKeys = this.cidObjArr.map(i => i.cid);
										// 		this.$refs.tree.setCheckedKeys(checkKeys);
										// }
								}
						} else { // 如果取消选择
								// 找到取消选择的下标
								if(data.type==2){
								// 找到取消选择的下标
								const index = _.findIndex(this.cidObjBackArr, item => item.cid === data.cid);
								this.cidObjBackArr.splice(index, 1);
								}else{
									const index = _.findIndex(this.cidObjArr, item => item.cid === data.cid);
                  this.cidObjArr.splice(index, 1);
								}
								
						}
			},
			warn(msg) {
					this.$message({
							message: msg,
							type: 'warning'
					});
      },
			clickIndex(i, idx) {
				this[`index${i}`] = idx;

			},
			calculatePercent(a, b) {
				if (b > 0) {
					const percent = parseInt(a / b * 100);
					const largerThanOne = (a / b) > 1;
					return {
						percent,
						largerThanOne
					};
				}else{
						const percent = 0;
						const largerThanOne = false;
						return {
								percent,
								largerThanOne
						};
				}
			},
		}
	};
</script>

<style lang="scss">
    @import '../Product/style/contrast.scss';
</style>
