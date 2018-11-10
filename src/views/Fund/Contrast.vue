<template>
  <div class="contrast">
    <el-row>
      <search-bar 
        @search="handleSearch"
        ref="child"
        url="/fund/search"/>
    </el-row>
    <el-row 
      class="content_row" 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container">
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ fundTree.name }}</span>
          <span
            v-if="fundTree.children"
            class="right">{{ calculatePercent(fundTree.real_total, fundTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="fundTree.children" 
          empty-text="正在加载"
          :props="defaultProps" 
          :default-expanded-keys="nodeArr"
          @node-click="handleNodeClick"
          check-strictly
          show-checkbox 
          @check-change="handleCheckChange">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <span class="label">{{ data.name }}</span>
            <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" 
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"/>
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="19" 
        class="overflow">
        <el-row v-loading="loading">
          <Card v-if="type==1||type==3">
            <el-row class="card-title">组织对比分析和平均值分析前端</el-row>
            <el-row>
              <el-col :span="6">
                <template v-for="(item, index) in fundcompareArr">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(0 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item.subject_name"  
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col :span="18">
                <ConOrgComparisonAverageBig 
                  v-if="fundcompareArr.length > 0"
                  :title="fundcompareArr[index0].subject_name" 
                  :data="fundcompareArr[index0]" 
                  id="ConOrgComparisonAverage" 
                  :index="index0"/>
              </el-col>
            </el-row>
          </Card>
          <Card v-if="type==2||type==3">
            <el-row class="card-title">组织对比分析和平均值分析后端</el-row>
            <el-row>
              <el-col :span="6">
                <template v-for="(item1, index) in fundcompareArrback">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(1 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item1.subject_name" 
                      :id="`${index+fundcompareArr.length}`" 
                      :data="item1"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="18" 
                v-if="fundcompareArrback.length > 0">
                <ConOrgComparisonAverageBig 
                  :title="fundcompareArrback[index1].subject_name" 
                  :data="fundcompareArrback[index1]" 
                  id="ConOrgComparisonAverage1" 
                  :index="index1"/>
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
                cid:1,
                defaultProps: TREE_PROPS,
                index0: 0,
                index1: 0,
                type:3,
                val:{},
				post:1,
                nodeArr:[],
                idTarget:[2,3],
				idback:[4,5],
            };
        },
        computed: {
            ...mapGetters(['fundTree','fundcompareArr','fundcompareArrback']),
            hasTree() {
                return !_.isEmpty(this.fundTree);
            }
        },
        watch: {
            form: {
                handler: function() {},
                deep: true
            },
            cid: function() {
					// 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
					// 暂时先在这里做
					this.getProgressbefore();
					this.getProgressback();
			}
        },
        mounted() {
            if(!this.hasTree) {
                this.getTree();
            }
            this.getProgressbefore();
            this.getProgressback();
        },
        methods: {
            getTree() {
                const params = {
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                    version: this.form.version
                };
                API.GetFundTree(params).then(res => {
                    this.$store.dispatch('SaveFundTree', res.tree);
                });
            },
            getProgressbefore() {
				const params = {
					rType:1
				};
				API.GetFundSubject(params).then(res => {
                    // this.$store.dispatch('SaveOrgProgressData', res.data);
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList1 => {
						_.forEach(resultList1, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
                        });
						this.$store.dispatch('SaveFundCompareArr', resultList1);
					});
				});
            },
            getTrend(subject) {
				const params = {
					targets: this.idTarget.join(),
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version,
					rType: 1
				};
				return API.GetFundCompare(params);
            },
            getProgressback() {
				const params = {
					rType:2
				};
				API.GetFundSubject(params).then(res => {
					const promises = _.map(res.data, o => this.getTrendback(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});
						this.$store.dispatch('SaveFundCompareArrback', resultList);
					});
				});
			},
			getTrendback(subject) {
				const params = {
					targets: this.idback.join(),
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version,
					rType: 2
				};
				return API.GetFundCompare(params);
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
            handleNodeClick(data) {
				this.$refs.child.parentMsg(this.post);
				this.type = data.type;
				if (data.children != undefined) {
					this.cid = data.cid;
					this.loading = true;
					
					setTimeout(() => {
						this.loading = false;
					}, 1000);
				}
			},
            handleCheckChange() {
            },
            clickIndex(i, idx) {
                this[`index${i}`] = idx;
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
        }
    };
</script>

<style lang="scss">
    @import '../Product/style/contrast.scss';
</style>
