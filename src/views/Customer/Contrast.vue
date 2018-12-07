<template>
  <div class="contrast">
    <el-row>
      <search-bar
        ref="child"
        @input="input"
        @search="handleSearch"
        url="/cus/search"
        placeholder="客户编号/客户名称"
        :pt-options="['日', '周', '月', '季', '年']" />
    </el-row>
    <el-row
      class="content_row"
      :gutter="20">
      <el-col
        :span="4"
        class="tree_container">
        <div class="padding_top">
          <el-button
            @click="cleanChecked"
            size="mini"
            class="clean_btn">清空选择</el-button>
        </div>
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ treeClone.name }}</span>
          <span
            v-if="treeClone.children"
            class="right">{{ calculatePercent(treeClone.real_total, treeClone.target_total).percent + '%' }}</span>
        </div>
        <el-tree
          ref="tree"
          node-key="cid"
          check-strictly
          show-checkbox
          empty-text="正在加载"
          :data="treeClone.children"
          :props="defaultProps"
          :default-expanded-keys="nodeArr"
          @node-expand="nodeExpand"
          @check-change="handleCheckChange">
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }">
            <el-tooltip
              class="item"
              effect="dark"
              placement="right">
              <div slot="content">
                <div class="margin-bottom-5 bold">品类:{{ data.name }}</div>
                <div class="margin-bottom-5">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                <div
                  v-if="data.children"
                  class="margin-bottom-5">子项目数 : {{ data.children.length }}</div>
                <div>毛利目标达成率: {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
              </div>
              <span class="label">
                <span class="label_left">{{ data.name }}</span>
                <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
              </span>
            </el-tooltip>

            <div
              :class="{progress: true, 'border-radius-0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
          </span>
        </el-tree>
      </el-col>
      <el-col
        :span="19"
        v-loading="loading"
        class="overflow">
        <el-row>
          <Card>
            <el-row class="margin-bottom-20">组织对比分析和平均值分析</el-row>
            <el-row v-if="cuscompareArr.length>0">
              <el-col :span="6">
                <template v-for="(item, index) in cuscompareArr">
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
              <el-col :span="18">
                <ConOrgComparisonAverageBig
                  v-if="cuscompareArr.length > 0"
                  :title="cuscompareArr[index0].subject_name"
                  :data="cuscompareArr[index0]"
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
            },
            cid:'',
            defaultProps: TREE_PROPS,
            index0: 0,
            loading:false,
            val:{},
            post:1,
            nodeArr:[],
            cidTarget:[10,20,30],
            cidObjArr:[],
            cancelKey: '',
            debounce: null,
            treeClone:{},
        };
    },
    computed: {
        ...mapGetters(['customerTree','cusprogressArr','cuscompareArr']),
        hasTree() {
            return !_.isEmpty(this.customerTree);
        }
    },
    watch: {
        cidObjArr(val) {
            if (val.length > 0) {
                this.debounce();
            } else if (val.length === 0) {
                this.$store.dispatch('ClearCusCompare');
            }
        },
        cid(){
            this.getTreePrograss();
        }
    },
    created() {
    // 防抖函数 减少发请求次数
        this.debounce = _.debounce(this.getCompare, 1000);
    },
    mounted() {
        if (this.customerTree.children){
            this.cid = this.customerTree.cid;
            this.treeClone = _.cloneDeep(this.customerTree);
            let arr = [];
            for (let i = 0; i < 3; i++) {
                this.customerTree.children[i] && arr.push(this.customerTree.children[i]);
            }
            const checkKeys = arr.map(i => i.cid);
            this.$store.dispatch('SaveCusTree', this.customerTree).then(() => {
                this.$refs.tree.setCheckedKeys(checkKeys);
            });
        } else {
            this.promise();
        }
    },
    methods: {
        promise(){
            Promise.all([this.getTree(), this.getProgress()]).then(res => {
                // 树
                const treeData = res[0];
                this.cid = treeData.tree.cid;
                this.treeClone = _.cloneDeep(treeData.tree);
                const children = this.treeClone.children;
                let arr = [];
                for(let i = 0; i < 3; i++) {
                    children[i] && arr.push(children[i]);
                }
                const checkKeys = arr.map(i => i.cid);
                this.$store.dispatch('SaveCusTree', treeData.tree).then(() => {
                    this.$refs.tree.setCheckedKeys(checkKeys);
                });
                // 指标
                const progressData = res[1];
                this.$store.dispatch('SaveCusProgressData', progressData.data);
            });
        },
        preOrder(node,cid){
            for (let i of node){
                if (i.cid == cid) {
                    return i;
                }
                if (i.children && i.children.length){
                    if (this.preOrder(i.children, cid)) {
                        return this.preOrder(i.children,cid);
                    }
                }
            }
        },
        input (val) {
            this.form.date = val;
        },
        getTree() {
            const params = {
                subject: this.form.subject,
                ...this.getPeriodByPt(),
            };
            return API.GetCusTree(params);
        },
        getTreePrograss(){
            const params = {
                subject:this.form.subject,
                ...this.getPeriodByPt(),
                nid:this.cid,
            };
            API.GetCusTreePrograss(params).then(res=>{
                let obj = this.preOrder([this.treeClone], this.cid);
                if (obj.cid === this.cid){
                    obj.real_total = res.data[this.cid].real;
                    obj.target_total = res.data[this.cid].target;
                }
                for (let i of obj.children){
                    if (res.data.hasOwnProperty(i.cid)){
                        i.real_total = res.data[i.cid].real;
                        i.target_total = res.data[i.cid].target;

                    }
                }
            });
        },
        getProgress() {
            const params = {
                cid: 1,
                ...this.getPeriodByPt(),
            };
            return API.GetCusProgress(params);
        },
        getCompare() {
            this.loading = true;
            if(!this.cidObjArr.length){
                return;
            }
            const promises = _.map(this.cusprogressArr, o => this.getTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.cusprogressArr[k].subject;
                    v.subject_name = this.cusprogressArr[k].subject_name;
                });
                const cidName = this.cidObjArr.map(o => o.name);
                // console.log(cidName);
                // 只有当返回的跟当前选中的一样才更新 store
                if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
                    this.$store.dispatch('SaveCusCompareArr', resultList);
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend(subject) {
            let params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            const checkKeys = this.cidObjArr.map(i => i.cid);
            params.targets = checkKeys.join(',');
            return API.GetCusCompare(params);
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
                    sDate: '2018-05-01',
                    eDate: '2018-06-30',
                };
            }
        },
        getDateObj () {
            const {
                date
            } = this.form;
            // console.log(this.val.sDate,date);
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
        handleSearch(val) {
            this.nodeArr = [];
            this.nodeArr.push(val.cid);
            this.val = val;
            if (!val.cid){
                if (this.cid!=this.customerTree.cid){
                    this.cid = this.customerTree.cid;
                    this.treeClone = _.cloneDeep(this.customerTree);
                }
                this.getCompare();
            } else {
                this.cid = val.cid;
            }
        },
        cleanChecked() {
            this.cidObjArr = [];
            this.$refs.tree.setCheckedKeys([]);
        },
        nodeExpand(data){
            this.cid = data.cid;
            this.isbac = false;
            this.highlight = true;
        },
        handleCheckChange(data, checked) {
            // 取消选择多于 4 个的后面的值 这个是为了在 setCheckedKeys 时, 第四个以后的都会取消选择
            if (!checked && this.cancelKey && data.cid === this.cancelKey) {
                return;
            }
            if (checked) { // 如果选中
                // 如果有选中的节点 并且此次选择了不同pid的节点
                if (this.cidObjArr[0] && data.parent_id !== this.cidObjArr[0].parent_id) {
                    this.warn('请选择相同父级下的进行对比');
                    this.cancelKey = data.cid;
                    const checkKeys = this.cidObjArr.map(i => i.cid);
                    this.$refs.tree.setCheckedKeys(checkKeys);
                    return;
                }
                // 如果选中的个数不超过 4
                if (this.cidObjArr.length < 4) {
                    this.cidObjArr.push(data);
                } else if (this.cidObjArr.length === 4) {
                    this.warn('最多对比 4 条');
                    this.cancelKey = data.cid;
                    const checkKeys = this.cidObjArr.map(i => i.cid);
                    this.$refs.tree.setCheckedKeys(checkKeys);
                }
            } else { // 如果取消选择
                // 找到取消选择的下标
                const index = _.findIndex(this.cidObjArr, item => item.cid === data.cid);
                this.cidObjArr.splice(index, 1);
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
                const percent = (a / b * 100).toFixed(0) - 0;//将percent转化为number
                const largerThanOne = (a / b) > 1;
                return {
                    percent,
                    largerThanOne
                };
            } else {
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
