<template>
  <div class="optimization">
    <el-row>
      <search-bar
        ref="child"
        @input="input"
        url="/org/search"
        @search="handleSearch"
        v-model="searchBarValue"
        placeholder="组织编号/组织名称"
        :pt-options="['月', '季', '年']" />
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
          v-if="fundTree.children"
          :class="{bac:isbac}"
          class="company">
          <span class="left label">{{ treeClone.name }}</span>
          <span
            :class="{percent: true, red: !calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne, blue: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
            class="right">{{ calculatePercent(treeClone.real_total, treeClone.target_total).percent + '%' }}</span>
          <div
            :class="{comprogress: true, 'border-radius0': calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
            :style="{width: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne ? '105%' : `${calculatePercent(treeClone.real_total, treeClone.target_total).percent + 5}%`}" />
        </div>
        <!-- 有多个tree -->
        <el-tree
          ref="tree"
          node-key="cid"
          empty-text="正在加载"
          :props="defaultProps"
          :data="treeClone.children"
          :highlight-current="highlight"
          :expand-on-click-node="false"
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
        v-loading="loading"
        class="overflow">
        <Card>
          <el-row :gutter="10">
            <template v-for="(item,index) in fundhistoryArr">
              <el-col
                :span="12"
                :key="index">
                <el-table
                  :data="item.strategies"
                  size="mini"
                  :span-method="arraySpanMethod2(item.strategies)">
                  <el-table-column :label="`${item.start_date} - ${item.end_date}`">
                    <el-table-column
                      prop="subject_name"
                      label="指标" />
                    <el-table-column
                      prop="inf_name"
                      label="影响因素" />
                    <el-table-column
                      prop="strategy"
                      label="应用策略" />
                    <el-table-column
                      prop="rank_name"
                      label="评选结果" />
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
                        <span style="margin-left: 10px">{{ scope.row.ring_rate + '%' }}</span>
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
            cid:'',
            loading:false,
            defaultProps: TREE_PROPS,
            time: '7.30 - 8.05',
            index0: 0,
            val:{},
            post:1,
            nodeArr:[],
            isbac:true,
            highlight:true,
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
            treeClone:{},
        };
    },
    computed: {
        ...mapGetters(['fundTree','fundhistoryArr']),
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
            this.getTreePrograss();
            this.getHistory();
        }
    },
    mounted() {
        if(!this.hasTree) {
            this.getTree();
        }else{
            this.treeClone = _.cloneDeep(this.fundTree);
            this.cid = this.fundTree.cid;
        }
    },
    methods: {
        preOrder(node,cid){
            for(let i of node){
                if (i.cid == cid) {
                    return i;
                }
                if(i.children && i.children.length){
                    if (this.preOrder(i.children, cid)) {
                        return this.preOrder(i.children,cid);
                    }
                }
            }
        },
        input (val) {
            this.form.date = val;
        },
        click(){
            if(this.cid==this.fundTree.cid){
                return;
            }else{
                this.loading = true;
                //点击发送请求清除搜索框
                this.$refs.child.clearKw();
                this.isbac = true;
                this.highlight = false;
                this.cid=this.fundTree.cid;
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            }
        },
        getHistory() {
            const params = {
                cid:this.cid,
                version: this.form.version,
                ...this.getPeriodByPt(),
            };
            API.GetFundStrategiesOpt(params).then(res => {
                this.$store.dispatch('SaveFundtHistory', res.data);
            });
        },
        getTree() {
            const params = {
                subject: this.form.subject,
                ...this.getPeriodByPt(),
                version: this.form.version
            };
            API.GetFundTree(params).then(res => {
                if (this.fundTree.cid == undefined) {
                    this.cid = res.tree.cid;
                }
                this.treeClone = _.cloneDeep(res.tree);
                this.$store.dispatch('SaveFundTree', res.tree);
            });
        },
        //获取百分比数据
        getTreePrograss(){
            const params = {
                subject:this.form.subject,
                ...this.getPeriodByPt(),
                nid:this.cid,
                version:this.form.version
            };
            API.GetFundTreePrograss(params).then(res=>{
                let obj = this.preOrder([this.treeClone], this.cid);
                // console.log(obj,obj.cid,this.cid,res.data);
                if(obj.cid == this.cid){
                    obj.real_total = res.data[this.cid].real;
                    obj.target_total = res.data[this.cid].target;
                }
                if (obj.children) {
                    for(let i of obj.children){
                        if(res.data.hasOwnProperty(i.cid)){
                            i.real_total = res.data[i.cid].real;
                            i.target_total = res.data[i.cid].target;

                        }
                    }
                }
            });
        },
        getDateObj () {
            const {
                date
            } = this.form;
            // console.log(this.val.sDate,date);
            if (this.val.sDate != undefined && this.val.eDate != undefined) {
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
                    pt: '月',
                    sDate: '2018-03-01',
                    eDate: '2018-06-30',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        largerThanZero(val) {
            return val && _.isNumber(parseFloat(val)) && parseFloat(val) >= 0;
        },
        lessThanZero(val) {
            return val && _.isNumber(parseFloat(val)) && parseFloat(val) < 0;
        },
        arraySpanMethod2(strategies) {
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
            this.loading = true;
            this.val = val;
            if(val.cid!=""){
                this.cid = val.cid;
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree 元素的ref  绑定的node-key
                });
                if(this.cid==this.fundTree.cid){
                    this.isbac = true;
                    this.highlight = false;
                }
            }else{
                this.isbac = true;
                this.highlight = false;
                if(this.cid!=this.fundTree.cid){
                    this.cid = this.fundTree.cid;
                    this.treeClone = _.cloneDeep(this.fundTree);
                }else{
                    this.getTreePrograss();
                    this.getHistory();
                }
            }
            setTimeout(() => {
                this.loading = false;
            }, 1000);

        },
        nodeExpand(data){
            this.cid = data.cid;
            this.isbac = false;
            this.highlight = true;
        },
        handleNodeClick(data) {
            this.isbac = false;
            this.highlight = true;
            this.$refs.child.clearKw();
            this.type = data.type;
            if(this.cid === data.cid){
                return ;
            }else {
                this.cid = data.cid;
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            }
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
