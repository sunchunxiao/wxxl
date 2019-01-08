<template>
  <div class="container">
    <el-row
      class="time_header">
      <search-bar
        ref="child"
        @search="handleSearch"
        url="/product/search"
        placeholder="产品编号/产品名称"
        v-model="searchBarValue"
        :pt-options="['日', '周', '月', '季', '年']" />
    </el-row>
    <div class="overview">
      <el-row
        v-if="productTree"
        class="content_row">
        <el-col
          :span="5"
          class="tree_container">
          <div v-if="hasTree">
            <div class="title">毛利目标达成率</div>
            <div
              @click="click"
              v-if="productTree.children"
              :class="{bac:isbac}"
              class="company">
              <span class="left label">{{ treeClone.name }}</span>
              <div
                :class="{comprogress: true, 'border-radius-0': calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
                :style="{width: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne ? '105%' : `${calculatePercent(treeClone.real_total, treeClone.target_total).percent + 5}%`}" />
            </div>
          </div>
          <el-tree
            ref="tree"
            :data="treeClone.children"
            empty-text="正在加载"
            node-key="cid"
            :expand-on-click-node="false"
            :highlight-current="highlight"
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
                  <div class="margin-bottom-5 bold">品类:{{ data.name }}</div>
                  <div class="margin-bottom-5">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                  <div
                    v-if="data.children"
                    class="margin-bottom-5">子项目数 : {{ data.children.length }}</div>
                  <div>毛利目标达成率: {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
                </div>
                <span class="label">
                  <span class="label_left">{{ data.name }}</span>
                </span>
              </el-tooltip>
              <div
                :class="{progress: true, 'border-radius-0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
                :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
            </span>
          </el-tree>
        </el-col>
        <el-row
          class="common-overflow"
          :span="18">
          <div class="common-wrap">
            <span
              class="span"
              :key="item.id"
              v-for="item in tabs"
              :class="{'bacground':currView==item.id}"
              @click="handleClick(item.id)"><span class="dot" />{{ item.value }}</span>
          </div>
          <component
            :cid="cid"
            :val="val"
            :is="currentTabComponent" />
        </el-row>
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
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import viewRadar from './Radar.vue';
import Diff from './Diff.vue';
import Trend from './Trend.vue';
import Structure from './Structure.vue';
import Rank from './Rank.vue';

//tree 百分比计算
import { calculatePercent, error, preOrder, find, addProperty } from 'utils/common';
//vuex
import { mapGetters } from 'vuex';
const OVER_TABS = [{
    id: 'reach',
    value: '目标达成情况总览'
},{
    id: 'diff',
    value: '目标-实际-差异趋势分析'
},{
    id: 'trend',
    value: '同比环比趋势分析'
},{
    id: 'structure',
    value: '比例结构与平均值对比分析'
},{
    id: 'rank',
    value: '智能评选和智能策略'
}];
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const SUBJECT = 'P'; // S: 销售额 P: 利润额
export default {
    components: {
        "reach": viewRadar,
        "diff": Diff,
        "trend": Trend,
        "structure": Structure,
        "rank": Rank,
        Card,
        SearchBar,
    },
    data () {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            //tree
            cid: '',
            pt: '',
            //js
            error: error,
            find: find,
            preOrder: preOrder,
            addProperty: addProperty,
            calculatePercent: calculatePercent,
            defaultProps: TREE_PROPS,
            loading: false,
            // stragety
            val: {},
            nodeArr: [],
            isbac: true,
            highlight: true,
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
            treeClone: {},
            changeDate: {},
            findFatherId: '',
            //views
            tabs: OVER_TABS,
            currView: '',
            style: 0
        };
    },
    computed: {
        ...mapGetters(['productTree']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        },
        currentTabComponent: function() {
            return this.currView;
        }
    },
    watch: {
        cid() {
            this.allRequest();
        }
    },
    mounted () {
        this.val = this.searchBarValue;
        this.currView = this.$route.params.name;
        //获取初始时间
        this.changeDate = this.searchBarValue;
        if (!this.hasTree) {
            this.$nextTick(() => {
                this.getTree();
            });
        } else {
            this.treeClone = _.cloneDeep(this.productTree);
            this.cid = this.productTree.cid;
            this.addProperty([this.treeClone]);
        }
    },
    methods: {
        handleClick(id) {
            this.currView = id;
            this.$router.push(`/product/overview/${id}`);
        },
        allRequest() {
            this.getTreePrograss();
        },
        click() {
            if (this.cid === this.productTree.cid) {
                return;
            } else {
                //点击发送请求清除搜索框
                this.$refs.child.clearKw();
                this.isbac = true;
                this.highlight = false;
                this.cid = this.productTree.cid;
            }
        },
        findParent(node,cid) {//找父节点id
            let hasfatherCid = [];
            this.find(cid, node, hasfatherCid);
            for (let i of hasfatherCid) {
                this.getTreePrograss(i);
            }
        },
        //树结构
        getTree() {
            const params = {
                subject: SUBJECT,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            API.GetProductTree(params).then(res => {
                //选择的日期没有数据,res.tree可能为null
                if(res.tree){
                    if (!this.productTree || !this.productTree.cid) {
                        this.cid = res.tree.cid;
                    }
                    this.treeClone = _.cloneDeep(res.tree);
                    this.addProperty([this.treeClone]);
                }
                this.$store.dispatch('SaveProductTree', res.tree);
            });
        },
        //获取百分比数据
        getTreePrograss(cid) {
            let id;
            if (cid) {
                id = cid;
            } else {
                id = this.cid;
            }
            const params = {
                subject: SUBJECT,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                nid: id
            };
            API.GetProductTreeProduct(params).then(res => {
                let obj = this.preOrder([this.treeClone], id);
                if (obj.cid === id) {
                    obj.hasData = true;//插入数据的hasData为true
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
            });
        },

        getPt() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                this.pt = this.val.pt;
            }else{
                this.pt = date.pt;
            }
            return this.pt;
        },
        getDateObj() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                return {
                    sDate: this.val.sDate,
                    eDate: this.val.eDate,
                };
            } else {
                return {
                    sDate: date.sDate,
                    eDate: date.eDate,
                };
            }
        },
        getPeriodByPt() {
            const {
                // pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    // pt: pt,
                    sDate: sDate,
                    eDate: eDate,
                };
            } else {
                return {
                    pt: '日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-31',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        handleSearch(val) {
            this.findFatherId = val.cid;
            this.highlight = true;
            this.nodeArr = [];
            this.val = val;
            if (!val.cid) {
                this.isbac = true;
                this.highlight = false;
                if (this.cid) {//数据tree不为null时
                    if (this.cid !== this.productTree.cid) {
                        this.cid = this.productTree.cid;
                        this.treeClone = _.cloneDeep(this.productTree);
                    } else {
                        //公司根节点
                        this.allRequest();
                    }
                } else {
                    this.getTree();//数据tree为空时,没有id
                }
            } else {//精确搜索
                //搜索相同的id,改变时间
                if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate) {
                    this.allRequest();
                    this.treeClone = _.cloneDeep(this.productTree);
                }
                this.changeDate = this.searchBarValue;
                this.cid = val.cid;
                this.findParent([this.treeClone], this.findFatherId);
                this.isbac = false;
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
                //如果是根节点
                if (this.cid === this.productTree.cid) {
                    this.isbac = true;
                    this.highlight = false;
                }
            }
        },
        nodeExpand(data) {
            this.cid = data.cid;
            this.isbac = false;
            this.highlight = true;
        },
        handleNodeClick(data) {
            if (this.searchBarValue.sDate && this.searchBarValue.eDate) {
                this.isbac = false;
                this.highlight = true;
                this.$refs.child.clearKw();
                if (this.cid === data.cid) {
                    return;
                }
                this.cid = data.cid;
            } else {
                this.highlight = false;
                this.error('请选择日期');
            }
        },
    }
};
</script>

<style lang="scss">
@import './style/overview.scss';
</style>
