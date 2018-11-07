<template>
  <div class="optimization">
    <el-row>
      <search-bar 
        ref="child"
        @search="handleSearch" 
        url="/product/search"/>
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
          :class="{bac:isbac}"
          class="company">
          <span class="left label">{{ channelTree.name }}</span>
          <span
            v-if="channelTree.children"
            :class="{percent: true, red: !calculatePercent(channelTree.real_total, channelTree.target_total).largerThanOne, blue: calculatePercent(channelTree.real_total, channelTree.target_total).largerThanOne}"
            class="right" >{{ calculatePercent(channelTree.real_total, channelTree.target_total).percent + '%' }}</span>
          <div 
            :class="{comprogress: true, 'border-radius0': calculatePercent(channelTree.real_total, channelTree.target_total).largerThanOne}"
            :style="{width: calculatePercent(channelTree.real_total, channelTree.target_total).largerThanOne ? '100%' : `${calculatePercent(channelTree.real_total, channelTree.target_total).percent + 5}%`}"/>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          ref="tree"
          node-key="cid"
          :expand-on-click-node="false"
          :highlight-current="highlight" 
          :data="channelTree.children" 
          :props="defaultProps" 
          :default-expanded-keys="nodeArr"
          @node-click="handleNodeClick" 
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
        :span="18" 
        v-loading="loading"
        class="overflow">
        <Card>
          <el-row :gutter="10">
            <template v-for="(item,index) in channelHistoryArr">
              <el-col 
                :span="12" 
                :key="index">
                <el-table 
                  :data="item.strategies" 
                  size="mini" 
                  :span-method="arraySpanMethod(item.strategies)">
                  <el-table-column :label="`${item.start_date} - ${item.end_date}`">
                    <el-table-column 
                      prop="subject" 
                      label="指标"/>
                    <el-table-column 
                      prop="package" 
                      label="影响因素"/>
                    <el-table-column 
                      prop="strategy" 
                      label="应用策略"/>
                    <el-table-column 
                      prop="rank" 
                      label="评选结果"/>
                    <el-table-column 
                      prop="ring_rate" 
                      label="环比增长率">
                      <template slot-scope="scope">
                        <img 
                          v-if="largerThanZero(scope.row.ring_rate)" 
                          src="../../assets/opt1.png" 
                          alt="">
                        <img 
                          v-if="lessThanZero(scope.row.ring_rate)" 
                          src="../../assets/opt2.png" 
                          alt="">
                        <span style="margin-left: 10px">{{ `${parseInt(scope.row.ring_rate*100)}` + '%' }}</span>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </el-col>
            </template>
          </el-row>

        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import API from './api';
    import _ from 'lodash';
    import Card from '../../components/Card';
    import SearchBar from 'components/SearchBar';
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
                    pt: '日',
                    date: [],
                    search: '',
                    subject: 'S', // S: 销售额 P: 利润额
                    version: '0'
                },
                cid:1,
                loading:false,
                defaultProps: TREE_PROPS,
                time: '7.30 - 8.05',
                index0: 0,
                val:{},
				post:1,
                nodeArr:[],
                isbac:true,
                highlight:true,
            };
        },
        computed: {
            ...mapGetters(['channelTree','channelHistoryArr']),
            hasTree() {
                return !_.isEmpty(this.channelTree);
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
                this.getHistory();
			}
        },
        mounted() {
            if(!this.hasTree) {
                this.getTree();
            }
            this.getHistory();
        },
        methods: {
            click(){
                if(this.cid==this.channelTree.nid){
						return;
				}else{
                        this.loading = true;
                        //点击发送请求清除搜索框
                        this.$refs.child.parentMsg(this.post);
                        this.isbac = true;
                        this.highlight = false;
                        this.cid=this.channelTree.nid;
                        setTimeout(() => {		       
                                this.loading = false;
                        }, 1000);
                }
                
            },
            getHistory() {
				const params = {
					nid:this.cid,
					pt: this.form.pt,
					...this.getPeriodByPt(),
				};
				API.GetChannelHistory(params).then(res => {
					this.$store.dispatch('SaveChannelHistory', res.data);
				});
			},
            getTree() {
                const params = {
                    pt: this.form.pt,
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                    version: this.form.version
                };
                API.GetChannelTree(params).then(res => {
                    this.$store.dispatch('SaveChannelTree', res.tree);
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
										pt:'日',
										sDate: '2018-01-01',
										eDate: '2018-01-07',
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
            largerThanZero(val) {
                return val && _.isNumber(parseFloat(val)) && parseFloat(val) > 0;
            },
            lessThanZero(val) {
                return val && _.isNumber(parseFloat(val)) && parseFloat(val) < 0;
            },
            arraySpanMethod(strategies) {
				if (!strategies || strategies.length === 0) {
					return;
				}
				const group = _.groupBy(strategies, o => {
					return o.subject;
				});
				const newStrategies = _.cloneDeep(strategies);
				for(let i = 1; i < newStrategies.length; i++) {
					let prev = newStrategies[i-1];
					let current = newStrategies[i];
					if (current.subject === prev.subject) {
						current.hidden = true;
					}
				}
				return ({
					row,
					rowIndex,
					columnIndex
				}) => {
					const rowSpan = group[row.subject].length;
					if ([0, 3, 4].includes(columnIndex)) {
						if(!newStrategies[rowIndex].hidden) {
							return [rowSpan, 1];
						} else {
							return [0, 0];
						}
					}
				};
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
                        this.getHistory();
                    }
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
            },
            handleNodeClick(data) {
                this.isbac = false;
                this.highlight = true;
                this.$refs.child.parentMsg(this.post);
                if(this.cid === data.nid){
                    return ;
                }else{
                    this.cid = data.nid;
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
    @import '../Product/style/optimization.scss'
</style>
