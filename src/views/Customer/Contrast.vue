<template>
  <div class="contrast">
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
        :span="4" 
        class="tree_container">
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ customerTree.name }}</span>
          <span class="right">{{ calculatePercent(customerTree.real_total, customerTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="customerTree.children" 
          :props="defaultProps" 
          :default-expanded-keys="nodeArr"
          @node-click="handleNodeClick" 
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
        :span="20" 
        class="overflow">
        <el-row>
          <Card>
            <el-row class="card-title">组织对比分析和平均值分析</el-row>
            <el-row>
              <el-col :span="6">
                <template v-for="(item, index) in cuscompareArr">
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
                  v-if="cuscompareArr.length > 0"
                  :title="cuscompareArr[index0].subject_name" 
                  :data="cuscompareArr[index0]" 
                  id="ConOrgComparisonAverage" 
                  :index="index0"/>
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
    import SearchBar from 'components/SearchBar';
    // 组织对比分析和平均值分析
    import ConOrgComparisonAverage from '../../components/ConOrgnization';
    import ConOrgComparisonAverageBig from '../../components/ConOrgnizationBig';

    import mockPieData from './mock/pieData.js';
    import mockComparisonAverageData from './mock/comparisonAverageData.js';
    import tree from './mock/productTreeData.js';

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
                cid:1,
                tree: tree,
                treeData: tree.data.children,
                defaultProps: TREE_PROPS,
                pieData: mockPieData(),
                comparisonAverageData: mockComparisonAverageData(),
                index0: 0,
                val:{},
				post:1,
				nodeArr:[]
            };
        },
        computed: {
            ...mapGetters(['customerTree','cuscompareArr']),
            hasTree() {
                return !_.isEmpty(this.customerTree);
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
					this.getProgress();
			}
        },
        
        mounted() {
            if(!this.hasTree) {
                this.getTree();
            }
            this.getProgress();
        },
        methods: {
            getTree() {
                const params = {
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                    version: this.form.version
                };
                API.GetCusTree(params).then(res => {
                    //                  console.log(res.tree)
                    this.$store.dispatch('SaveCusTree', res.tree);
                });
            },
            getProgress() {
				const params = {
					rType:0
				};
				API.GetCusSubject(params).then(res => {
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
                        });
						this.$store.dispatch('SaveCusCompareArr', resultList);
					});
				});
			},
			getTrend(subject) {
				const params = {
					cid: this.cid,
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version,
					rType: 1
				};
				return API.GetCusCompare(params);
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
                        pt:'日',
                        sDate: '2018-10-25',
                        eDate: '2018-11-02',
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
            handleSearch(val) {
                this.nodeArr = [];
                this.nodeArr.push(val.cid);
                this.loading = true;
                this.val = val;
                if(val.cid!=""){
                    this.cid = val.cid;
                }else{
                    this.getTree();
                    this.getProgress();
                }
                setTimeout(() => {		       
                    this.loading = false;
                }, 1000);
                
            },
            handleNodeClick(data) {
                this.$refs.child.parentMsg(this.post);
                if(data.children != undefined) {
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
                }
                return {};
            },
        }
    };
</script>

<style lang="scss">
    @import '../Product/style/contrast.scss';
</style>
