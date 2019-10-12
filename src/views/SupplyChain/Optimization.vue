<template>
  <div class="opt_container">
    <el-row
      class="time_header">
      <!-- 展开按钮 -->
      <div
        class="contrast_btn"
        @click="handleCollpase">
        <img
          v-if="isCollapse"
          src="../../assets/collapse1.png"
          alt="">
        <img
          v-else
          src="../../assets/collapse.png"
          alt="">
      </div>
      <search-bar
        ref="child"
        @search="handleSearch"
        v-model="searchBarValue"
        placeholder="产品编号/产品名称"
        @input="input"
        url="/supply/search"
        :pt-options="['周', '月', '季', '年']" />
    </el-row>
    <div class="optimization">
      <el-row
        v-if="supplyTree"
        type="flex"
        class="content_row">
        <el-col
          :class="{'tree_block_none':isCollapse}"
          :span="5"
          class="tree_container">
          <div class="title">产供比环比增长率(策略有效性) </div>
          <div class="tree_content">
            <div
              @click="click"
              v-if="supplyTree"
              class="company">
              <span
                :class="['left','label',
                         {'is-active-zero':!(calculatePercent(treeClone.real_total, treeClone.target_total).percent) && activeCid == treeClone.cid}
              ]">{{ treeClone.name }}</span>
              <div
                :class="{comprogress: true,'is-active': activeCid == treeClone.cid,'border-radius-0': calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
                :style="{width: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne ? '105%' : `${calculatePercent(treeClone.real_total, treeClone.target_total).percent + 5}%`}" />
            </div>
            <el-tree
              ref="tree"
              node-key="cid"
              empty-text="正在加载"
              :expand-on-click-node="false"
              :data="treeClone.children"
              :props="defaultProps"
              :default-expanded-keys="nodeArr"
              @node-expand="nodeExpand"
              @node-click="handleNodeClick">
              <span
                class="custom-tree-node"
                slot-scope="{ node, data }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="right">
                  <div slot="content">
                    <div class="margin-bottom-5">{{ data.name }} (产供比环比增长率) : {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
                    <div class="margin-bottom-5">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                    <div
                      v-if="data.children"
                      class="margin-bottom-5">宽度 : {{ data.children.length }}</div>
                  </div>
                  <span class="label">
                    <span
                      :class="['label_left',
                               {'is-active-zero':!(calculatePercent(data.real_total, data.target_total).percent) && activeCid == data.cid}]">{{ data.name }}</span>
                  </span>
                </el-tooltip>
                <div
                  :class="{progress: true, 'is-active': activeCid == data.cid,'border-radius-0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
                  :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col
          :span="19"
          class="overflow">
          <Card
            v-loading="loading"
            class="min-height-400">
            <el-row class="margin-bottom-20 overview_title">策略优化</el-row>
            <el-row :gutter="20">
              <template v-for="(item,index) in supplyHistoryArr">
                <el-col
                  :span="getColSpan(item, index)"
                  :key="index">
                  <el-table
                    class="margin-bottom-20"
                    :span-method="arraySpanMethod(item.strategies)"
                    :data="item.strategies">
                    <el-table-column
                      :label="`周期: ${item.start_date} 至 ${item.end_date}`"
                      class="date">
                      <el-table-column
                        prop="subject_name"
                        label="指标" />
                      <el-table-column
                        prop="package"
                        label="影响因素" />
                      <el-table-column
                        prop="strategy"
                        label="应用策略" />
                      <el-table-column
                        prop="rank"
                        label="评选结果" />
                      <el-table-column
                        prop="ring_rate"
                        label="环比增长率">
                        <template slot-scope="scope">
                          <img
                            v-if="largerThanZero(scope.row)"
                            src="../../assets/opt1.png"
                            alt="">
                          <img
                            v-if="lessThanZero(scope.row)"
                            src="../../assets/opt2_down.png"
                            alt="">
                          <span
                            v-if="scope.row.ring_rate"
                            style="margin-left: 10px">{{ `${parseInt(scope.row.ring_rate*100)}` + '%' }}</span>
                          <span
                            v-else
                            style="margin-left: 10px">暂无</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </el-col>
              </template>
            </el-row>
            <el-row
              class="overview_select">
              {{ message }}
            </el-row>
          </Card>
        </el-col>
      </el-row>
      <el-row
        v-else
        class="overview_select">
        暂无数据
      </el-row>
    </div>
  </div>
</template>

<script>
import API from './api';
import SearchBar from 'components/SearchBar';
import Card from '../../components/Card';
// 组织对比分析和平均值分析
import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';
//tree 百分比计算
import { calculatePercent, error, preOrder, find, addProperty,subjuctReverse } from 'utils/common';

import { mapGetters } from 'vuex';
const SUBJECT = 'CP'; // S: 销售额 P: 利润额
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
// const TIMEPT = {
// 	'周': 'week',
// 	'月': 'month',
// 	'季': 'quarter',
// 	'年': 'year'
// };

export default {
    components: {
        Card,
        SearchBar,
        ConOrgComparisonAverage,
        ConOrgComparisonAverageBig
    },
    data () {
        return {
            form: {
                date: [],
                search: '',
                version: '0'
            },
            cid: 0,
            loading: false,
            error: error,
            find: find,
            preOrder: preOrder,
            addProperty: addProperty,
            calculatePercent: calculatePercent,
            subjuctReverse:subjuctReverse,
            defaultProps: TREE_PROPS,
            index0: 0,
            val: {},
            nodeArr: [],
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
            treeClone: {},
            changeDate: {},
            findFatherId: '',
            isCollapse: false,
            message: '',
            treeProgressLoading: true
        };
    },
    computed: {
        ...mapGetters(['supplyTree','supplyHistoryArr']),
        hasTree () {
            return !_.isEmpty(this.supplyTree);
        },
        activeCid() {
            return this.cid;
        },
        noStandard() {
            let numArr = [];
            if (this.cid) {
                //找节点
                let obj = this.preOrder([this.treeClone], this.cid);
                if (obj.children) {
                    for (let i of obj.children) {
                        if (i.real_total && i.target_total) {
                            const bool = this.calculatePercent(i.real_total,i.target_total).largerThanOne;
                            if (!bool) {
                                numArr.push(this.calculatePercent(i.real_total,i.target_total).largerThanOne);
                            }
                        } else if (!this.treeProgressLoading) {
                            numArr.push(this.calculatePercent(i.real_total,i.target_total).largerThanOne);
                        } else {
                            return;
                        }
                    }
                }
            }
            return numArr.length;
        }
    },
    watch: {
        cid: function () {
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
            this.getTreePrograss();
            this.getHistory();
        },
    },
    mounted () {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        if (!this.hasTree) {
            this.getTree();
        } else {
            this.treeClone = _.cloneDeep(this.supplyTree);
            this.cid = this.supplyTree.cid;
            this.addProperty([this.treeClone]);
        }
    },
    methods: {
        getColSpan(item,index) {
            if (item.strategies && item.strategies.length) {
                return 24;
            }
            if (this.supplyHistoryArr[index+1] && this.supplyHistoryArr[index+1].strategies.length && ((index + 1) % 2)) {
                return 24;
            }
            return 12;
        },
        handleCollpase () {
            this.isCollapse = !this.isCollapse;
        },
        allRequest() {
            this.getTreePrograss();
            this.getHistory();
        },
        input (val) {
            this.form.date = val;
        },
        click () {
            if (this.cid === this.supplyTree.cid) {
                return;
            } else {
                //点击发送请求清除搜索框
                this.$refs.child.clearKw();
                this.cid = this.supplyTree.cid;
            }
        },
        getHistory () {
            this.loading = true;
            const params = {
                cid: this.cid,
                // subject: SUBJECT,
                ...this.getPeriodByPt(),
            };
            API.GetSupplyHistory(params).then(res => {
                this.$store.dispatch('SaveSupplyHistory', res.data);
                if (!res.data.length) {
                    this.message = '暂无数据';
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        findParent(node,cid) {//找父节点id
            let hasfatherCid = [];
            this.find(cid, node, hasfatherCid);
            for (let i of hasfatherCid) {
                this.getTreePrograss(i);
            }
        },
        getTree () {
            this.loading = true;
            const params = {
                subject: SUBJECT,
                ...this.getPeriodByPt(),
            };
            API.GetSupplyTree(params).then(res => {
                if (res.tree) {
                    if (!this.supplyTree || !this.supplyTree.cid) {
                        this.cid = res.tree.cid;
                    }
                    this.treeClone = _.cloneDeep(res.tree);
                    this.addProperty([this.treeClone]);
                }
                this.$store.dispatch('SaveSupplyTree', res.tree);
            }).finally(() => {
                this.loading = false;
            });
        },
        //获取百分比数据
        getTreePrograss (cid) {
            let id;
            if (cid) {
                id = cid;
            } else {
                id = this.cid;
            }
            const params = {
                subject: 'PSR',//PSR产供比
                ...this.getPeriodByPt(),
                nid: id
            };
            this.treeProgressLoading = true;
            API.GetSupplyTreeProgress(params).then(res => {
                let obj = this.preOrder([this.treeClone], id);
                if (obj.cid === id) {
                    obj.hasData = true; //插入数据的hasData为true
                    obj.real_total = res.data[id].real;
                    obj.target_total = res.data[id].target;
                }
                if (obj.children) {
                    for (let i of obj.children) {
                        if (_.has(res.data, i.cid)) {
                            i.real_total = res.data[i.cid].real;
                            i.target_total = res.data[i.cid].target;
                        }
                    }
                }
                this.treeProgressLoading = false;
            });
        },
        getDateObj () {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                return {
                    pt: this.val.pt,
                    sDate: this.val.sDate,
                    eDate: this.val.eDate,
                };
            } else {
                return {
                    pt: date.pt,
                    sDate: date.sDate,
                    eDate: date.eDate,
                };
            }
        },
        getPeriodByPt () {
            const {
                pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    pt: pt,
                    sDate: sDate,
                    eDate: eDate,
                };
            } else {
                return {
                    pt: '日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-07',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        largerThanZero (val) {
            if (this.subjuctReverse(val.subject)) {
                return val.ring_rate && _.isNumber(parseFloat(val.ring_rate * 100)) && parseFloat(val.ring_rate) < 0;
            } else {
                return val.ring_rate && _.isNumber(parseFloat(val.ring_rate * 100)) && parseFloat(val.ring_rate) > 0;
            }
        },
        lessThanZero (val) {
            if (this.subjuctReverse(val.subject)) {
                return val.ring_rate && _.isNumber(parseFloat(val.ring_rate * 100)) && parseFloat(val.ring_rate) > 0;

            } else {
                return val.ring_rate && _.isNumber(parseFloat(val.ring_rate * 100)) && parseFloat(val.ring_rate) < 0;
            }
        },
        arraySpanMethod (strategies) {
            if (!strategies || strategies.length === 0) {
                return;
            }
            const group = _.groupBy(strategies, o => {
                return o.subject;
            });
            const newStrategies = _.cloneDeep(strategies);
            for (let i = 1; i < newStrategies.length; i++) {
                let prev = newStrategies[i - 1];
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
                    if (!newStrategies[rowIndex].hidden) {
                        return [rowSpan, 1];
                    } else {
                        return [0, 0];
                    }
                }
            };
        },
        handleSearch(val) {
            this.findFatherId = val.cid;
            this.nodeArr = [];
            this.val = val;
            if (!val.cid) {
                //数据为空时,没有id
                if(this.cid){
                    if (this.cid !== this.supplyTree.cid) {
                        this.cid = this.supplyTree.cid;
                        this.treeClone = _.cloneDeep(this.supplyTree);
                    } else {
                        this.allRequest();
                    }
                }else{
                    this.getTree();
                }
            } else {
                //搜索相同的id,改变时间
                if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate) {
                    this.allRequest();
                    this.treeClone = _.cloneDeep(this.supplyTree);
                }
                this.changeDate = this.searchBarValue;
                this.cid = val.cid;
                this.findParent([this.treeClone], this.findFatherId);
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
            }
        },
        nodeExpand (data) {
            this.cid = data.cid;
        },
        handleNodeClick (data) {
            if (this.searchBarValue.sDate && this.searchBarValue.eDate) {
                this.val = this.searchBarValue;
                this.$refs.child.clearKw();
                if (this.cid === data.cid) {
                    return;
                } else {
                    this.cid = data.cid;
                }
            } else {
                this.error('请选择日期');
            }
        },
        clickIndex (i, idx) {
            this[`index${i}`] = idx;
        },
    }

};
</script>
<style lang="scss">
@import '../Product/style/optimization.scss';
@import '../../style/tree.scss';
</style>
