<template>
  <div class="overview">
    <el-row>
      <search-bar 
        @search="handleSearch"
        ref="child"
        url="/product/search" />
    </el-row>
    <el-row 
      class="content_row padding_top " 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container1">
        <div class="homeSlider">
          <div class="slider_header">首页</div>
          <div class="slider_menu">
            <div class="menu_company"><span class="company_before" /> 公司关键经营指标</div>
            <template v-for="(item,index) in menuData">
              <a 
                class="menu_list"
                :href="item.path"
                @click="select(index)"
                :class="{'menu_list_select':style==index}"
                :key="item.path">{{ item.title }}
                <img 
                  class="menu_list_img"
                  src="../../assets/right.png" 
                  alt=""></a>
            </template>
          </div>
        </div>
      </el-col>
      <el-col 
        :span="18" 
        class="overflow common">
        <el-row id="#company">
          <span 
            class="common-title">
            公司关键经营指标
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="card-title">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in progressArr">
                      <el-col 
                        :key="index">
                        <ProTargetAchievement 
                          :id="`${index}`" 
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in trendArr">
                  <el-col 
                    :key="index" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index}`" 
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row
          id="produce" 
          v-loading="loading" 
          class="margin-top-50">
          <span class="common-title">
            产品效率-单品平均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="card-title">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieDataProduce">
                      <el-col 
                        v-if="progressArr.length>0"
                        :key="index">
                        <ProTargetAchievement 
                          :id="`${index+progressArr.length}`" 
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in trend">
                  <el-col 
                    v-if="trendArr.length>0"
                    :key="index" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index+trendArr.length}`" 
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row 
          id="channel"
          v-loading="loading" 
          class="margin-top-50">
          <span class="common-title">
            渠道效率-单店平均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="card-title">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieData1">
                      <el-col 
                        v-if="progressArr.length>0"
                        :key="index">
                        <ProTargetAchievement 
                          :id="`${index+progressArr.length*2}`" 
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataChannel">
                  <el-col 
                    v-if="trendArr.length>0"
                    :key="index" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index+trendArr.length*2}`" 
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row 
          id="customer"
          v-loading="loading" 
          class="margin-top-50">
          <span class="common-title">
            客户效率-消费者人均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="card-title">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieCustomer">
                      <el-col 
                        v-if="progressArr.length>0"
                        :key="index" 
                        @click.native="clickIndex(0 ,index)">
                        <ProTargetAchievement 
                          :id="`${index+progressArr.length*3}`" 
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataCustomer">
                  <el-col 
                    v-if="trendArr.length>0"
                    :key="index" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index+trendArr.length*3}`" 
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row 
          id="organization"
          v-loading="loading" 
          class="margin-top-50">
          <span class="common-title">
            组织效率-企业人均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="card-title">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieOrganization">
                      <el-col 
                        v-if="progressArr.length>0"
                        :key="index" 
                        @click.native="clickIndex(0 ,index)">
                        <ProTargetAchievement 
                          :id="`${index+progressArr.length*4}`" 
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataOrganization">
                  <el-col 
                    v-if="trendArr.length>0"
                    :key="index" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index+trendArr.length*4}`" 
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row 
          id="fund"
          v-loading="loading" 
          class="margin-top-50">
          <span class="common-title">
            资金效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="card-title">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieFund">
                      <el-col 
                        v-if="progressArr.length>0"
                        :key="index" 
                        @click.native="clickIndex(0 ,index)">
                        <ProTargetAchievement 
                          :id="`${index+progressArr.length*5}`" 
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataFund">
                  <el-col 
                    v-if="trendArr.length>0"
                    :key="index" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index+trendArr.length*5}`" 
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import API from './api';
    import Card from 'components/Card';
    import SearchBar from 'components/SearchBar';
	import moment from 'moment';
	// 目标达成情况总览
	import ProTargetAchievement from 'components/ProTargetAchievement';
	import ProTargetAchievementBig from 'components/ProTargetAchievementBig';
	// 目标-实际-差异趋势分析
	import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
	// 同比环比趋势分析
	import ProYearOnYearTrend from 'components/ProYearOnYearTrend';
	// 比例结构与平均值对比分析
	import ProportionalStructureAverageComparison from 'components/ProportionalStructureAverageComparison';
	import ProportionalStructureAverageComparisonBig from 'components/ProportionalStructureAverageComparisonBig';
	// 智能评选和智能策略
		import IntelligentSelection from 'components/IntelligentSelection';
		
		// mock
		import { dataProduce,dataChannel,dataCustomer,dataOrganization,dataFund } from './mock/trendData.js';
		import { pieChannel,pieDataProduce,pieCustomer,pieOrganization,pieFund } from './mock/pieData.js';
    
    import { mapGetters } from 'vuex';
    const TREE_PROPS = {
        children: 'children',
        label: 'name'
    };
    const MENUDATA = [{
      title:'产品效率',
      path:'#produce',
    },
    {
      title:'渠道效率',
      path:'#channel',
    },
    {
      title:'客户效率',
      path:'#customer',
    },
    {
      title:'组织效率',
      path:'#organization',
    },
    {
      title:'资金效率',
      path:'#fund',
    },
    ];
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
                    pt: '', // 周期类型
                    date: [], // date
                    search: '', // 暂时没有接口 先这样
                    subject: 'S', // S: 销售额 P: 利润额
                },
                menuData: MENUDATA,
								pieData1:pieChannel(),
								pieDataProduce:pieDataProduce(),
								pieCustomer:pieCustomer(),
								pieOrganization:pieOrganization(),
								pieFund:pieFund(),
								trend:dataProduce(),
								dataChannel:dataChannel(),
								dataCustomer:dataCustomer(),
								dataOrganization:dataOrganization(),
								dataFund:dataFund(),
								// mockData
                // pieData: mockPieData(),
								cid: 1,
                defaultProps: TREE_PROPS,
                loading: false,
                // index
                index0: 0,
                index1: 0,
                index2: 0,
                index3: 0,
                // stragety
                stragetyCheckList: [],
                stragetyTitle: '',
                stragety: [],
                checked1: true,
                idArr: [],
                val:{},
                post:1,
                nodeArr:[],
                isbac:true,
                highlight:true,
                style:undefined
            };
        },
        computed: {
            ...mapGetters(['productTree','trendArr','rankArr','structureArr','progressArr', 'channelProgressArr','channelTrendArr'])
            // hasTree() {
            //     return !_.isEmpty(this.productTree);
            // }
        },
        mounted() {
            this.getProgress();
            this.getStructure();
            this.getRank();
        },
        watch: {
            // form: [
            //     {
            //         handler: function() {
            //             this.getTree();
            //         },
            //         deep: true,
            //     },
            //     {
            //         handler: function(val, oldVal) {
            //             console.log(val, oldVal);
            //             this.getProgress();
            //         },
            //         deep: true,
            //     }
            // ],
            cid: function() {
                // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
                // 暂时先在这里做
                this.getProgress();
                this.getStructure();
                this.getRank();
            }
        },
        methods: {
					select(index){
            this.style = index;
          },
            click(){
                if(this.cid==this.productTree.cid){
                    return;
                }else{
                    this.loading = true;
                    //点击发送请求清除搜索框
                    this.$refs.child.clearKw();
                    this.isbac = true;
                    this.highlight = false;
                    this.cid=this.productTree.cid;
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
                        rank: data1.rank,
                        subject: data1.subject,
                        time_label: data1.time_label,
                        strategies: this.idArr.join(',')
                    };
                    API.PostProductSave(data).then(() => {
                        this.$message({
                            showClose: true,
                            message: '保存成功'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                        duration: 1500
                    });
                });

            },

            initFormDataFromUrl() {
                const {
                    pt = '月', sDate = '', eDate = '', subject = 'S', cid = '1',
                } = this.$route.query;
                let formData = {
                    pt: pt,
                    subject: subject,
                };
                if(moment(sDate).isValid() && moment(eDate).isValid()) {
                    formData.date = [sDate, eDate];
                }
                this.cid = cid;
                this.form = { ...this.form,
                    ...formData
                };
            },
            getTree() {
                const params = {
                    // pt: this.form.pt,
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                };
                API.GetProductTree(params).then(res => {
                    this.$store.dispatch('SaveProductTree', res.tree);
                });
            },
            getProgress() {
                // console.log(this.val);
                const params = {
                    cid: this.cid,
                    ...this.getPeriodByPt(),
                };
                API.GetProductProgress(params).then(res => {
                    this.$store.dispatch('SaveProgressData', res.data);
                    const promises = _.map(res.data, o => this.getTrend(o.subject));
                    Promise.all(promises).then(resultList => {
                        _.forEach(resultList, (v, k) => {
                            v.subject = res.data[k].subject;
                            v.subject_name = res.data[k].subject_name;
                        });
                        this.$store.dispatch('SaveTrendArr', resultList);
                    });
                });
            },
            getTrend(subject) {
                const params = {
                    cid: this.cid,
                    // pt: this.form.pt,
                    ...this.getPeriodByPt(),
                    subject: subject
                };
                return API.GetProductTrend(params);
            },
            getStructure() {
                const params = {
                    cid: this.cid,
                    ...this.getPeriodByPt(),
                };
                API.GetProductStructure(params).then(res => {
                    //              console.log(res.data);
                    this.$store.dispatch('SaveStructureArr', res.data);
                });
            },
            getRank() {
                const params = {
                    cid: this.cid,
                    // pt: this.form.pt,
                    ...this.getPeriodByPt(),
                };
                API.GetProductRank(params).then(res => {
                    //              console.log(res.data);
                    this.$store.dispatch('SaveRankArr', res.data);
                });
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
                    // if(pt === '日') {
                    //     return {
                    //         sDate,
                    //         eDate
                    //     };
                    // }
                    // let unit = TIMEPT[pt];
                    // if(unit) {
                    //     return {
                    //         sDate: moment(sDate).startOf(unit).format('YYYY-MM-DD'),
                    //         eDate: moment(eDate).endOf(unit).format('YYYY-MM-DD')
                    //     };
                    // } else {
                        return {
                            pt:this.val.pt,
                            sDate: this.val.sDate,
                            eDate: this.val.eDate,
                            // 先写死个时间
                            // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                            // eDate: moment().format('YYYY-MM-DD'),
                        };
                    // }
                } else {
                    return {
                        pt:'日',
                        sDate: '2018-01-01',
                        eDate: '2018-01-31',
                        // 先写死个时间
                        // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                        // eDate: moment().format('YYYY-MM-DD'),
                    };
                }
            },
            handleSearch(val) {
                // 默认公司的背景色
                this.isbac = false;
                this.nodeArr = [];
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
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
                this.$refs.child.clearKw();
                if(this.cid === data.cid){
                    return ;
                }else if(data.children != undefined) {
                    this.cid = data.cid;
                    this.loading = true;
                    //                  setTimeout(() => {
                    //                      this.getProgress();
                    //                      this.getStructure();
                    //                      this.getRank();
                    //                  }, 300);
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
				}
				return {};
			},
			clickIndex(i, idx) {
				this[`index${i}`] = idx;
			},
			showStragety(data) {
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
					rank: rank,
					time_label: time_label,
				};

				API.GetProductMatch(params).then(res => {
					this.stragetyCheckList = [];
					this.stragety = res.data;
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].is_selected == 1) {
							this.stragetyCheckList.push(res.data[i].id);
							// console.log(this.stragetyCheckList)
						}
					}
					// this.$store.dispatch('SaveRankArr', res.data);
				});

			}
		}
	};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
