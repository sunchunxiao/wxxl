<template>
  <div class="contrast">
    <el-row>
      <search-bar
        @input="input"
        @search="handleSearch"
        placeholder="渠道编号/渠道名称"
        v-model="searchBarValue"
        ref="child"
        url="/channel/search" />
    </el-row>
    <el-row
      v-if="channelTree"
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
          <span class="left">{{ treeClone.name }}</span>
          <span
            v-if="treeClone.children"
            class="right">{{ calculatePercent(treeClone.real_total, treeClone.target_total).percent + '%' }}</span>
        </div>
        <el-tree
          empty-text="正在加载"
          check-strictly
          ref="tree"
          :data="treeClone.children"
          :props="defaultProps"
          node-key="nid"
          show-checkbox
          :highlight-current="highlight"
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
        <Card>
          <el-row class="margin-bottom-20">组织对比分析和平均值分析</el-row>
          <el-row v-if="channelCompareArr.length>0">
            <el-col :span="6">
              <template v-for="(item, index) in channelCompareArr">
                <el-col
                  :key="index"
                  :span="12"
                  @click.native="clickIndex(0 ,index)">
                  <ConOrgComparisonAverage
                    :title="item.subject_name"
                    :id="`${index}`"
                    :data="channelCompareArr[index]" />
                </el-col>
              </template>
            </el-col>
            <el-col
              :span="18">
              <ConOrgComparisonAverageBig
                :title="channelCompareArr[index0].subject_name"
                :data="channelCompareArr[index0]"
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
      </el-col>
    </el-row>
    <el-row
      v-else
      class="overview_select">
      暂无数据
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
//tree 百分比计算
import { calculatePercent } from 'utils/common';
import { mapGetters } from 'vuex';
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const SUBJECT = 'P'; // S: 销售额 P: 利润额

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
                version: '0'
            },
            cid:'',
            loading:false,
            calculatePercent:calculatePercent,
            defaultProps: TREE_PROPS,
            index0: 0,
            val:{},
            post:1,
            nodeArr:[],
            cidObjArr:[],
            cancelKey: '',
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
        ...mapGetters(['channelTree','channelProgressArr','channelCompareArr']),
        hasTree() {
            return !_.isEmpty(this.channelTree);
        }
    },
    watch: {
        cidObjArr(val) {
            if (val.length > 0) {
                this.debounce();
            } else if (val.length === 0) {
                this.$store.dispatch('ClearChannelCompareArr');
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
        //获取初始时间
        this.changeDate = this.searchBarValue;
        if (this.channelCompareArr.length){
            this.cid = this.channelTree.nid;
            this.treeClone = _.cloneDeep(this.channelTree);
            let arr = [];
            for (let i = 0; i < 3; i++) {
                this.treeClone.children[i] && arr.push(this.treeClone.children[i]);
            }
            const checkKeys = arr.map(i => i.nid);
            this.$store.dispatch('SaveChannelTree', this.channelTree).then(() => {
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
                if(treeData.tree){
                    this.cid = treeData.tree.nid;
                    this.treeClone = _.cloneDeep(treeData.tree);
                    const children = treeData.tree.children;
                    let arr = [];
                    for (let i = 0; i < 3; i++) {
                        children[i] && arr.push(children[i]);
                    }
                    const checkKeys = arr.map(i => i.nid);
                    this.$store.dispatch('SaveChannelTree', treeData.tree).then(() => {
                        this.$refs.tree.setCheckedKeys(checkKeys);
                    });
                    // 指标
                    const progressData = res[1];
                    this.$store.dispatch('SaveChannelProgress', progressData.data);
                }
            });
        },
        preOrder(node,cid){
            for (let i of node){
                if (i.nid == cid) {
                    return i;
                }
                if (i.children && i.children.length){
                    if (this.preOrder(i.children, cid)) {
                        return this.preOrder(i.children,cid);
                    }
                }
            }
        },
        input(val){
            this.form.date = val;
        },
        getTree() {
            const params = {
                subject: SUBJECT,
                ...this.getPeriodByPt(),
            };
            return API.GetChannelTree(params);
        },
        //获取百分比数据
        getTreePrograss(){
            const params = {
                subject: SUBJECT,
                ...this.getPeriodByPt(),
                nid: this.cid
            };
            API.GetChannelTreePrograss(params).then(res=>{
                let obj = this.preOrder([this.treeClone], this.cid);
                if (obj.nid === this.cid){
                    obj.real_total = res.data[this.cid].real;
                    obj.target_total = res.data[this.cid].target;
                }
                for (let i of obj.children){
                    if (res.data.hasOwnProperty(i.nid)){
                        i.real_total = res.data[i.nid].real;
                        i.target_total = res.data[i.nid].target;
                    }
                }
            });
        },
        getProgress() {
            const params = {
                chId :1,
                ...this.getPeriodByPt(),
            };
            return API.GetChannelProgress(params);
        },
        getCompare() {
            this.loading = true;
            if(!this.cidObjArr.length){
                return;
            }
            const promises = _.map(this.channelProgressArr, o => this.getTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.channelProgressArr[k].subject;
                    v.subject_name = this.channelProgressArr[k].subject_name;
                });
                const cidName = this.cidObjArr.map(o => o.name);
                // 只有当返回的跟当前选中的一样才更新 store
                if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
                    this.$store.dispatch('SaveChannelCompareArr', resultList);
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
            const checkKeys = this.cidObjArr.map(i => i.nid);
            params.targets = checkKeys.join(',');
            return API.GetChannelCompare(params);
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
                };
            }
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
        handleSearch(val) {
            this.nodeArr = [];
            this.val = val;
            if (!val.cid){
                this.getTreePrograss();
                this.getCompare();
            } else {
                //搜索相同的id,改变时间
                if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate){
                    this.getTreePrograss();
                    this.getCompare();
                }
                this.changeDate = this.searchBarValue;
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
                this.cid = val.cid;
            }
        },
        cleanChecked() {
            this.cidObjArr = [];
            this.$refs.tree.setCheckedKeys([]);
        },
        nodeExpand(data){
            this.cid = data.nid;
            this.isbac = false;
            this.highlight = true;
        },
        handleCheckChange(data, checked) {
            // 取消选择多于 4 个的后面的值 这个是为了在 setCheckedKeys 时, 第四个以后的都会取消选择
            if (!checked && this.cancelKey && data.nid === this.cancelKey) {
                return;
            }
            if (checked) { // 如果选中
                // 如果有选中的节点 并且此次选择了不同pid的节点
                if (this.cidObjArr[0] && data.parent_id !== this.cidObjArr[0].parent_id) {
                    this.warn('请选择相同父级下的进行对比');
                    this.cancelKey = data.nid;
                    const checkKeys = this.cidObjArr.map(i => i.nid);
                    this.$refs.tree.setCheckedKeys(checkKeys);
                    return;
                }
                // 如果选中的个数不超过 4
                if (this.cidObjArr.length < 4) {
                    this.cidObjArr.push(data);
                } else if (this.cidObjArr.length === 4) {
                    this.warn('最多对比 4 条');
                    this.cancelKey = data.nid;
                    const checkKeys = this.cidObjArr.map(i => i.nid);
                    this.$refs.tree.setCheckedKeys(checkKeys);
                }
            } else { // 如果取消选择
                // 找到取消选择的下标
                const index = _.findIndex(this.cidObjArr, item => item.nid === data.nid);
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
    }
};
</script>

<style lang="scss">
    @import '../Product/style/contrast.scss';
</style>
