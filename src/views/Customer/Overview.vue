<template>
  <div class="overview">
    <el-row>
      <search-bar 
        @search="handleSearch"
        ref="child"
        url="/cus/search"/>
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
          v-if="customerTree.children"
          :class="{bac:isbac}"
          class="company">
          <span class="left label">{{ customerTree.name }}</span>
          <span
            :class="{percent: true, red: !calculatePercent(customerTree.real_total, customerTree.target_total).largerThanOne, blue: calculatePercent(customerTree.real_total, customerTree.target_total).largerThanOne}"
            class="right" >{{ calculatePercent(customerTree.real_total, customerTree.target_total).percent + '%' }}</span>
          <div 
            :class="{comprogress: true, 'border-radius0': calculatePercent(customerTree.real_total, customerTree.target_total).largerThanOne}"
            :style="{width: calculatePercent(customerTree.real_total, customerTree.target_total).largerThanOne ? '105%' : `${calculatePercent(customerTree.real_total, customerTree.target_total).percent + 5}%`}"/>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="customerTree.children" 
          ref="tree"
          empty-text="正在加载"
          :props="defaultProps" 
          node-key="cid"
          :expand-on-click-node="false"
          :default-expanded-keys="nodeArr"
          :highlight-current="highlight" 
          @node-click="handleNodeClick">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <el-tooltip 
              class="item" 
              effect="dark" 
              placement="right" > 
              <div slot="content">
                <div class="tooltip_margin">{{ data.name }}</div>
                <div>毛利目标达成率: {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
              </div>
              <span class="label">
                <span class="label_left">{{ data.name }}</span>
                <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
              </span>
            </el-tooltip>
            <!-- <span class="label">{{ data.name }}</span>
            <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span> -->
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" 
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"/>
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="18" 
        class="overflow">
        <el-row v-loading="loading">
          <Card>
            <el-row class="card-title">目标达成情况总览</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in cusprogressArr">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(0 ,index)">
                    <ProTargetAchievement 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                v-if="cusprogressArr.length > 0" 
                class="border-left">
                <ProTargetAchievementBig 
                  :id="'select'" 
                  :data="cusprogressArr[index0]"/>
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
              <template v-for="(item, index) in custrendArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(1 ,index)">
                  <ProTargetActualDiffTrend 
                    :id="`${index}`" 
                    :data="item"/>
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
              <template v-for="(item, index) in custrendArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(2 ,index)">
                  <ProYearOnYearTrend 
                    :id="`${index}`" 
                    :data="item"/>
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in cusstructureArr">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProportionalStructureAverageComparisonBig 
                  v-if="cusstructureArr.length>0"
                  id="ProportionalStructureAverageComparisonBig" 
                  :data="cusstructureArr[index3]"/>
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
                  id="heatmap" 
                  @showStragety="showStragety" 
                  :data="cusrankArr"/>
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
                      type="primary" 
                      @click="submit" 
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
    import Card from '../../components/Card';
    import SearchBar from 'components/SearchBarOrg';
    // 目标达成情况总览
    import ProTargetAchievement from '../../components/ProTargetAchievement';
    import ProTargetAchievementBig from '../../components/ProTargetAchievementBig';
    // 目标-实际-差异趋势分析
    import ProTargetActualDiffTrend from '../../components/ProTargetActualDiffTrend';
    
    // 同比环比趋势分析
    import ProYearOnYearTrend from '../../components/ProYearOnYearTrend';
    // import ProYearOnYearTrendBig from '../../components/ProYearOnYearTrendBig';
    // 比例结构与平均值对比分析
    import ProportionalStructureAverageComparison from '../../components/ProportionalStructureAverageComparison';
    import ProportionalStructureAverageComparisonBig from '../../components/ProportionalStructureAverageComparisonBig';
    // 智能评选和智能策略
    import IntelligentSelection from '../../components/IntelligentSelection';
    //vuex
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
            ProTargetAchievementBig,
            ProTargetActualDiffTrend,
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
                cid:1,
                loading: false,
                defaultProps: TREE_PROPS,
                // index
                index0: 0,
                index1: 0,
                index2: 0,
                index3: 0,
                // stragety
                stragetyCheckList: [],
                stragetyTitle: '',
                stragety: [],
                idArr:[],
                val:{},
				post:1,
                nodeArr:[],
                isbac:true,
                highlight:true,
            };
        },
        computed: {
            ...mapGetters(['customerTree','cusprogressArr','custrendArr','cusstructureArr','cusrankArr']),
            hasTree() {
                return !_.isEmpty(this.customerTree);
            }
        },
        mounted() {
            if(!this.hasTree) {
                this.getTree();
            }
            this.initFormDataFromUrl();
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
				this.getStructure();
				this.getRank();
			}
        },
        methods: {
            click(){
              if(this.cid==this.customerTree.cid){
					return;
              }else{
                  this.loading = true;
                //点击发送请求清除搜索框
                this.$refs.child.parentMsg(this.post);
                this.isbac = true;
                this.highlight = false;
                this.cid=this.customerTree.cid;
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
						subject: data1.subject,
						time_label: data1.time_label,
						strategies: this.idArr.join(',')
					};
					API.PostCusStrategyLog(data).then(() => {
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
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                };
                API.GetCusTree(params).then(res => {
                    //                  console.log(res.tree)
                    this.$store.dispatch('SaveCusTree', res.tree);
                });
            },
            getProgress() {
				const params = {
					cid: this.cid,
					...this.getPeriodByPt(),
				};
				API.GetCusProgress(params).then(res => {
					this.$store.dispatch('SaveCusProgressData', res.data);
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});
						this.$store.dispatch('SaveCusTrendArr', resultList);
					});
				});
            },
			getTrend(subject) {
				const params = {
					cid: this.cid,
					...this.getPeriodByPt(),
					subject: subject,
				};
				return API.GetCusTrend(params);
			},
            getStructure() {
				const params = {
					cid: this.cid,
					...this.getPeriodByPt(),
				};
				API.GetCusStructure(params).then(res => {
					this.$store.dispatch('SaveCusStructureArr', res.data);
				});
            },
            getRank() {
				const params = {
					cid: this.cid,
					...this.getPeriodByPt(),
				};
				API.GetCusRank(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveCusRankArr', res.data);
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
                        eDate: '2018-06-01',
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
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref
                });
                this.loading = true;
                this.val = val;
                if(val.cid!=""){
                    this.cid = val.cid;
                }else{
                    this.getTree();
                    this.getProgress();
                    this.getStructure();
                    this.getRank();
                }
                setTimeout(() => {		       
                    this.loading = false;
                }, 1000);
                
            },
            handleNodeClick(data) {
                this.isbac = false;
                this.highlight = true;
                this.$refs.child.parentMsg(this.post);
                if(this.cid === data.cid){
                    return ;
                }else if(data.children != undefined) {
                    this.cid = data.cid;
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }

			},
            calculatePercent(a, b) {
                if(b > 0) {
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
				// console.log(cid, brand, name, rank);
				this.stragetyTitle = `${brand} - ${name} - ${rank}`;
				const params = {
					cid: cid,
					subject: subject,
					time_label: time_label,
				};

				API.GetCusStrategy(params).then(res => {
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
   @import '../Product/style/overview.scss'
</style>
