<template>
  <div class="overview">
    <el-row>
      <search-bar 
        @search="handleSearch"
        ref="child"
        placeholder="产品"
        url="/org/search" />
    </el-row>
    <el-row 
      class="content_row" 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container">
        <div class="title">毛利目标达成率</div>
        <div
          @click="click" 
          v-if="organizationTree.children"
          :class="{bac:isbac}"
          class="company">
          <span class="left label">{{ organizationTree.name }}</span>
          <span
            :class="{percent: true, red: !calculatePercent(organizationTree.real_total, organizationTree.target_total).largerThanOne, blue: calculatePercent(organizationTree.real_total, organizationTree.target_total).largerThanOne}"
            class="right">{{ calculatePercent(organizationTree.real_total, organizationTree.target_total).percent + '%' }}</span>
          <div 
            :class="{comprogress: true, 'border-radius0': calculatePercent(organizationTree.real_total, organizationTree.target_total).largerThanOne}"
            :style="{width: calculatePercent(organizationTree.real_total, organizationTree.target_total).largerThanOne ? '105%' : `${calculatePercent(organizationTree.real_total, organizationTree.target_total).percent + 5}%`}" />
          
        </div>
        <!-- 有多个tree -->
        <el-tree 
          ref="tree"
          empty-text="正在加载"
          :data="organizationTree.children" 
          :props="defaultProps" 
          node-key="cid"
          :expand-on-click-node="false" 
          :default-expanded-keys="nodeArr"
          :highlight-current="highlight" 
          @node-click="handleNodeClick">
          <div 
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
  
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
          </div>
          
        </el-tree>
      </el-col>
      <el-col 
        :span="18" 
        class="overflow">
        <el-row v-loading="loading">
          <Card>
            <el-row class="card-title">目标达成情况总览</el-row>
            <el-row>
              <el-col :span="15">
                <template v-for="(item, index) in orgprogressArr">
                  <el-col 
                    :key="index" 
                    :span="6">
                    <ProTargetAchievement 
                      :id="`${index}`" 
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col 
                v-if="orgrankArr.length > 0" 
                :span="9" 
                class="border-left">
                <Radar 
                  :id="'select'" 
                  :data="orgrankArr[orgrankArr.length-1]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">目标-实际-差异趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in orgtrendArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(1 ,index)">
                  <ProTargetActualDiffTrend 
                    :id="`${index}`" 
                    :data="item" />
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">同比环比趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in orgtrendArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(2 ,index)">
                  <ProYearOnYearTrend 
                    :id="`${index}`" 
                    :data="item" />
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-if="type==1||type==3" 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析前端</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in orgstructureArr1">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison 
                      :id="`${index}`" 
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProportionalStructureAverageComparisonBig 
                  id="ProportionalStructureAverageComparisonBig" 
                  v-if="orgstructureArr1.length>0"
                  :data="orgstructureArr1[index3]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-if="type==2||type==3" 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析后端</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item1, index) in orgstructureArr2">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(4 ,index)">
                    <ProportionalStructureAverageComparison 
                      :id="`${index+orgstructureArr1.length}`" 
                      :data="item1" />
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProportionalStructureAverageComparisonBig 
                  v-if="orgstructureArr2.length>0" 
                  id="ProportionalStructureAverageComparisonBig1" 
                  :data="orgstructureArr2[index4]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">智能评选和智能策略</el-row>
            <el-row>
              <el-col :span="14">
                <IntelligentSelection 
                  id="rank" 
                  @showStragety="showStragety" 
                  :data="orgrankArr" />
              </el-col>
              <el-col :span="10">
                <div class="stragety">
                  <div class="stragety-title">智能策略</div>
                  <div class="stragety-box">
                    <div class="stragety-selected-title">{{ stragetyTitle }}</div>
                    <el-checkbox-group v-model="stragetyCheckList">
                      <el-checkbox 
                        v-for="(item,index) in stragety" 
                        :key="index" 
                        :label="item.id" 
                        @change="change">{{ item.strategy }}</el-checkbox>
                    </el-checkbox-group>
                    <el-button 
                      @click="submit" 
                      type="primary" 
                      class="center">确 认</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </Card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import API from './api';
	import moment from 'moment';
	import SearchBar from 'components/SearchBarOrg';
	import Card from '../../components/Card';
	// 目标达成情况总览
	import ProTargetAchievement from '../../components/ProTargetAchievement';
	import Radar from '../../components/radar';
	// 目标-实际-差异趋势分析
	import ProTargetActualDiffTrend from '../../components/ProTargetActualDiffTrend';
	// import ProTargetActualDiffTrendBig from '../../components/ProTargetActualDiffTrendBig';
	// 同比环比趋势分析
	import ProYearOnYearTrend from '../../components/ProYearOnYearTrend';
	
	// 比例结构与平均值对比分析
	import ProportionalStructureAverageComparison from '../../components/ProportionalStructureAverageComparison';
	import ProportionalStructureAverageComparisonBig from '../../components/ProportionalStructureAverageComparisonBig';
	// 智能评选和智能策略
	import IntelligentSelection from '../../components/IntelligentSelection';

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
			ProYearOnYearTrend,
			// ProYearOnYearTrendBig,
			ProportionalStructureAverageComparison,
			ProportionalStructureAverageComparisonBig,
			IntelligentSelection,
			ProTargetAchievement,
			Radar,
			ProTargetActualDiffTrend,
			// ProTargetActualDiffTrendBig
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
				cid: 0,
				loading: false,
				defaultProps: TREE_PROPS,
				// index
				index0: 0,
				index1: 0,
				index2: 0,
				index3: 0,
				index4: 0,
				// stragety
				stragetyCheckList: [],
				stragetyTitle: '',
				stragety: [],
				type: 3,
				idArr: [],
				val:{},
				post:1,
				nodeArr:[],
				isbac:true,
				highlight:true,
				a:false,
				name:[{
					name:'aa'
				},{
					name:'bb'
				}]
			};
		},
		computed: {
			...mapGetters(['organizationTree', 'orgprogressArr', 'orgtrendArr', 'orgstructureArr1', 'orgstructureArr2',
				'orgrankArr'
			]),
			hasTree() {
				return !_.isEmpty(this.organizationTree);
			}
		},
		mounted() {
			
			if(!this.hasTree) {
					this.getTree();
			}else{
					this.cid = this.organizationTree.cid;
			}
			// this.initFormDataFromUrl();
		},
		watch: {
			form: {
				handler: function() {},
				deep: true
			},
			cid: function() {
				// 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
				// 暂时先在这里做
				this.getProgress();
				this.getStructure1();
				this.getStructure2();
				this.getRank();
			}
		},
		methods: {
			click(){
				this.$refs.child.clearKw();
				if(this.cid==this.organizationTree.cid){
								return;
						}else{
								//点击发送请求清除搜索框
								this.loading = true;
                this.isbac = true;
                this.highlight = false;
								this.cid=this.organizationTree.cid;
								setTimeout(() => {		       
										this.loading = false;
								}, 1000);
						}
      },
			change() {
						this.idArr = [];
						for (let i of this.stragetyCheckList) {
								let stragetyObj = this.stragety.find(el => {
										return el.id == i;
								});
								this.idArr.push(stragetyObj.id);
						}
						// console.log(this.stragetyCheckList, this.idArr);
      },
			submit() {
				let data1 = JSON.parse(localStorage.data);

				this.$confirm('确认?', {
					confirmButtonText: '保存',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					const data = {
						cid: data1.cid,
						// rank:this.Rank(data1.rank),
						subject: data1.subject,
						time_label: data1.time_label,
						strategies: this.idArr.join(',')
					};
					API.PostOrgStrategyLog(data).then(() => {
						this.$message({
							showClose: true,
							message: '保存成功'
						});
						// console.log(res.api_info)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
						duration: 1500
					});
				});

			},
			getTree() {
				const params = {
					// pt: this.form.pt,
					subject: this.form.subject,
					...this.getPeriodByPt(),
					version: this.form.version
				};
				API.GetOrgTree(params).then(res => {
					if(this.organizationTree.cid==undefined){
							this.cid = res.tree.cid;
					}
					// this.cid = res.tree.cid;
					this.type = res.tree.type;
					this.$store.dispatch('SaveOrgTree', res.tree);
				});
			},
			getProgress() {
				const params = {
					// pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version
				};
				API.GetOrgProgress(params).then(res => {
					this.$store.dispatch('SaveOrgProgressData', res.data);
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});

						this.$store.dispatch('SaveOrgTrendArr', resultList);
					});
				});
			},
			getTrend(subject) {
				const params = {
					cid: this.cid,
					// pt: this.form.pt,
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version
				};
				return API.GetOrgTrend(params);
			},
			//前端
			getStructure1() {
				// console.log(this.type)
				const params = {
					// pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version,
					rType: 1
				};
				API.GetOrgStructure(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveOrgStructureArr1', res.data);
				});
			},
			//后端
			getStructure2() {
				// console.log(this.type)
				const params = {
					// pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version,
					rType: 2
				};
				API.GetOrgStructure(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveOrgStructureArr2', res.data);
				});
			},
			getRank() {
				const params = {
					cid: this.cid,
					// pt: this.form.pt,
					version: this.form.version,
					...this.getPeriodByPt(),
				};
				API.GetOrgRank(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveOrgRankArr', res.data);
				});
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
			initFormDataFromUrl() {
				const {
					pt = '月', sDate = '', eDate = '', subject = 'S', cid = '1',
				} = this.$route.query;
				let formData = {
					pt: pt,
					subject: subject,
				};
				if (moment(sDate).isValid() && moment(eDate).isValid()) {
					formData.date = [sDate, eDate];
				}
				this.cid = cid;
				this.form = { ...this.form,
					...formData
				};
			},
			handleSearch(val) {
				// 默认公司的背景色
				this.isbac = false;
				this.nodeArr = [];
				
				this.loading = true;
				this.val = val;
				if(val.cid!=""){
						this.cid = val.cid;
						this.nodeArr.push(val.cid);
				
						this.$nextTick(() => {
								this.$refs.tree.setCurrentKey(val.cid); // treeBox 元素的ref   value 绑定的node-key
						});
						if(this.cid==this.organizationTree.cid){
								this.isbac = true;
								this.highlight = false;
						}
				}else{
					if(this.cid==this.organizationTree.cid){
								this.isbac = true;
								this.highlight = false;
						}
						this.getProgress();
						this.getStructure1();
						this.getStructure2();
						this.getRank();
				}
				setTimeout(() => {		       
						this.loading = false;
				}, 1000);
						
				},
			handleNodeClick(data) {
				this.isbac = false;
				this.highlight = true;
				this.loading = true;
				this.$refs.child.clearKw();
				this.type = data.type;
				if(this.cid === data.cid){
            return ;
        }else if (data.children != undefined) {
					this.cid = data.cid;
					setTimeout(() => {
						this.loading = false;
					}, 1000);
				}

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
			clickIndex(i, idx) {
				this[`index${i}`] = idx;
			},
			Rank(score) {
				if (score =='差') {
					return 4;
				}
				if (score == '中') {
					return 3;
				}
				if (score =='良') {
					return 2;
				}
				if (score =='优') {
					return 1;
				}
				return 4;
			},
			showStragety(data) {
				// console.log(data)
				localStorage.setItem("data", JSON.stringify(data));
				const {
					cid,
					brand,
					name,
					subject,
					time_label,
					rank
				} = data;

				// console.log(cid, brand, name, rank)
				this.stragetyTitle = `${brand} - ${name} - ${rank}`;
				const params = {
					cid: cid,
					subject: subject,
					time_label: time_label,
				};

				API.GetOrgStrategy(params).then(res => {
					// console.log(res.data)
					this.stragetyCheckList = [];
					this.stragety = res.data;
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].status == 1) {
							this.stragetyCheckList.push(res.data[i].id);
							// console.log(this.stragetyCheckList)
						}
					}
				});

			}
		}
	};
</script>

<style lang="scss">
		@import '../Product/style/overview.scss';
		// .el-tooltip__popper.is-dark{
		// 		background: rgba(0, 0, 0, 0.5)!important;
		// 		font-size: 14px;
		// 		font-weight:500;
		// }
</style>
