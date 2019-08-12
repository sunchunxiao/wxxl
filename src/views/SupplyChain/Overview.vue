<template>
  <div class="container">
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
        url="/org/search"
        placeholder="组织编号/组织名称"
        v-model="searchBarValue"
        :pt-options="['月', '季', '年']" />
    </el-row>
    <div class="overview">
      <el-row
        v-if="organizationTree"
        type="flex"
        class="content_row">
        <el-col
          :span="5"
          :class="{'tree_block_none':isCollapse}"
          class="tree_container">
          <!-- <div class="title">毛利润额目标达成率</div> -->
          <div class="title">毛利润额目标未达标数 :{{ noStandard }} </div>
          <div class="tree_content">
            <div
              @click="click"
              v-if="organizationTree.children"
              class="company">
              <span
                :class="['left','label',
                         {'is-active-zero':!(calculatePercent(treeClone.real_total, treeClone.target_total).percent) && activeCid == treeClone.cid}]">
                {{ treeClone.name }}
              </span>
              <div
                :class="{comprogress: true, 'is-active': activeCid == treeClone.cid,'border-radius-0': calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
                :style="{width: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne ? '105%' : `${calculatePercent(treeClone.real_total, treeClone.target_total).percent + 5}%`}" />
            </div>
            <el-tree
              ref="tree"
              :data="treeClone.children"
              empty-text="正在加载"
              node-key="cid"
              :expand-on-click-node="false"
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
                    <div class="margin-bottom-5">{{ data.name }} : {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
                    <div class="margin-bottom-5">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                    <div
                      v-if="data.children"
                      class="margin-bottom-5">宽度 : {{ data.children.length }}</div>
                  </div>
                  <span class="label">
                    <span
                      :class="['label-left',
                               {'is-active-zero':!(calculatePercent(data.real_total, data.target_total).percent) && activeCid == data.cid}]"><span v-if="data.type==2">* </span>{{ data.name }}</span>
                  </span>
                </el-tooltip>
                <div
                  :class="{progress: true, 'is-active': activeCid === data.cid, 'border-radius-0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
                  :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col
          class="common-overflow"
          :span="19">
          <div class="common-wrap">
            <span
              class="span"
              :key="item.id"
              v-for="item in tabs"
              :class="{'bacground':currView==item.id}"
              @click="handleClick(item.id)"><span class="dot" />{{ item.value }}</span>
          </div>
          <component
            @changeCid="handleChangeCid"
            :cid="cid"
            :type="type"
            :val="val"
            :is="currentTabComponent" />
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
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import viewRadar from './OverviewMenu/Radar.vue';
import Diff from './OverviewMenu/Diff.vue';
import Trend from './OverviewMenu/Trend.vue';
import Structure from './OverviewMenu/Structure.vue';
import Rank from './OverviewMenu/Rank.vue';

//tree 百分比计算
import { calculatePercent, error, preOrder, find, addProperty, echartAndSliderResize } from 'utils/common';
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
        'reach': viewRadar,
        'diff': Diff,
        'trend': Trend,
        'structure': Structure,
        'rank': Rank,
        Card,
        SearchBar
    },
    data () {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            version: 0,
            //tree
            cid: '',
            type: 0, // 前后端类型, 1,3属于前端,2:后端
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
            style: 0,
            isCollapse: false,
            treeProgressLoading: true
        };
    },
    computed: {
        ...mapGetters(['organizationTree']),
        hasTree () {
            return !_.isEmpty(this.organizationTree);
        },
        currentTabComponent: function() {
            return this.currView;
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
                        } else if(!this.treeProgressLoading) {
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
            this.treeClone = _.cloneDeep(this.organizationTree);
            this.cid = this.organizationTree.cid;
            this.type = this.organizationTree.type;
            this.addProperty([this.treeClone]);
        }
    },
    methods: {
        handleChangeCid(cid) {
            this.cid = cid;
            this.nodeArr = [];
            this.nodeArr.push(this.cid);
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.cid); // tree元素的ref 绑定的node-key
            });
        },

        handleCollpase () {
            this.isCollapse = !this.isCollapse;
            setTimeout(() =>{
                echartAndSliderResize();
            }, 300);
        },
        handleClick(id) {
            this.currView = id;
            this.$router.push(`/supplyChain/overview/${id}`);
        },
        allRequest() {
            this.getTreePrograss();
        },
        click() {
            if (this.cid === this.organizationTree.cid) {
                return;
            } else {
                //点击发送请求清除搜索框
                this.$refs.child.clearKw();
                this.cid = this.organizationTree.cid;
                this.type = this.organizationTree.type;
            }
        },
        findParent(node,cid) { //找父节点id
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
                version: this.version
            };
            API.GetOrgTree(params).then(res => {
                //选择的日期没有数据,res.tree可能为null
                if (res.tree) {
                    if (!this.organizationTree || !this.organizationTree.cid) {
                        this.cid = res.tree.cid;
                    }
                    this.treeClone = _.cloneDeep(res.tree);
                    this.addProperty([this.treeClone]);
                }
                this.$store.dispatch('SaveOrgTree', res.tree);
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
                nid: id,
                version: this.version
            };
            this.treeProgressLoading = true;
            API.GetOrgTreePrograss(params).then(res => {
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
                this.treeProgressLoading = false;
            });
        },
        getPt() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                this.pt = this.val.pt;
            } else {
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
            this.nodeArr = [];
            this.val = val;
            if (!val.cid) {
                if (this.cid) {//数据tree不为null时
                    if (this.cid !== this.organizationTree.cid) {
                        this.cid = this.organizationTree.cid;
                        this.type = this.organizationTree.type;
                        this.treeClone = _.cloneDeep(this.organizationTree);
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
                    this.treeClone = _.cloneDeep(this.organizationTree);
                }
                this.changeDate = this.searchBarValue;
                this.cid = val.cid;
                this.type = val.type;
                this.findParent([this.treeClone], this.findFatherId);
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
            }
        },
        nodeExpand(data) {
            this.cid = data.cid;
            this.type = data.type;
        },
        handleNodeClick(data) {
            if (this.searchBarValue.sDate && this.searchBarValue.eDate) {
                this.$refs.child.clearKw();
                if (this.cid === data.cid) {
                    return;
                }
                this.cid = data.cid;
                this.type = data.type;
            } else {
                this.error('请选择日期');
            }
        },
    }
};
</script>

<style lang="scss">
@import '../Product/style/overview.scss';
@import '../../style/tree.scss';
</style>
