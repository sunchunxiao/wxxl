<template>
  <div class="overview">
    <el-row>
      <search-bar
        @search="handleSearch"
        @input="input"
        placeholder="渠道编号/渠道名称"
        ref="child"
        v-model="searchBarValue"
        url="/channel/search" />
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
          v-if="channelTree.children"
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
        <el-tree
          :data="treeClone.children"
          ref="tree"
          empty-text="正在加载"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="nid"
          @node-expand="nodeExpand"
          :default-expanded-keys="nodeArr"
          :highlight-current="highlight"
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

            <div
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
          </span>
        </el-tree>
      </el-col>
      <el-col
        :span="18"
        class="overflow">
        <el-row v-loading="loading">
          <Card>
            <el-row class="card-title">目标达成情况总览</el-row>
            <el-row>
              <el-col :span="15">
                <template v-for="(item, index) in channelProgressArr">
                  <el-col
                    :key="index"
                    :span="6">
                    <ProTargetAchievement
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="9"
                v-if="channelRankArr.length > 0"
                class="border-left">
                <Radar
                  :id="'select'"
                  :data="channelRankArr[channelRankArr.length-1]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10">
          <Card>
            <el-row class="card-title">目标-实际-差异趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in channelTrendArr">
                <el-col
                  :key="index"
                  :span="12"
                  @click.native="clickIndex(1 ,index)">
                  <ProTargetActualDiffTrend
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10">
          <Card>
            <el-row class="card-title">同比环比趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in channelTrendArr">
                <el-col
                  :key="index"
                  :span="12"
                  @click.native="clickIndex(2 ,index)">
                  <ProYearOnYearTrend
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in channelStructureArr">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                v-if="channelStructureArr.length>0"
                class="border-left">
                <ProportionalStructureAverageComparisonBig

                  id="ProportionalStructureAverageComparisonBig"
                  :data="channelStructureArr[index3]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10">
          <Card>
            <el-row class="card-title">智能评选和智能策略</el-row>
            <el-row>
              <el-col :span="14">
                <IntelligentSelection
                  id="heatmap"
                  @showStragety="showStragety"
                  :data="channelRankArr" />
              </el-col>
              <el-col :span="10">
                <div class="stragety">
                  <div class="stragety-title">智能策略</div>
                  <div class="stragety-box">
                    <div class="stragety-selected-title">{{ stragetyTitle }}</div>
                    <el-checkbox-group v-model="stragetyCheckList">
                      <el-checkbox
                        v-for="(item,index) in stragety"
                        :key="index"
                        :label="item.id"
                        @change="change">{{ item.strategy }}</el-checkbox>
                    </el-checkbox-group>
                    <el-button
                      type="primary"
                      @click="submit"
                      class="center">确 认</el-button>
                  </div>
                </div>
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
// 目标达成情况总览
import ProTargetAchievement from '../../components/ProTargetAchievement';
import Radar from '../../components/radar';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from '../../components/ProTargetActualDiffTrend';
// 同比环比趋势分析
import ProYearOnYearTrend from '../../components/ProYearOnYearTrend';

// 比例结构与平均值对比分析
import ProportionalStructureAverageComparison from '../../components/ProportionalStructureAverageComparison';
import ProportionalStructureAverageComparisonBig from '../../components/ProportionalStructureAverageComparisonBig';
// 智能评选和智能策略
import IntelligentSelection from '../../components/IntelligentSelection';

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
        ProYearOnYearTrend,
        ProportionalStructureAverageComparison,
        ProportionalStructureAverageComparisonBig,
        IntelligentSelection,
        ProTargetAchievement,
        Radar,
        ProTargetActualDiffTrend,
    },
    data () {
        return {
            form: {
                pt: '日',
                date: [],
                search: '',
                subject: 'S', // S: 销售额 P: 利润额
                version: '0'
            },
            cid: '',
            loading: false,
            defaultProps: TREE_PROPS,
            // index
            index0: 0,
            index1: 0,
            index2: 0,
            index3: 0,
            // stragety
            stragetyCheckList: [],
            stragetyTitle: '',
            stragety: [],
            idArr: [],
            val: {},
            post: 1,
            nodeArr: [],
            isbac: true,
            highlight: true,
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
            treeClone: {},
        };
    },
    computed: {
        ...mapGetters(['channelTree', 'channelProgressArr', 'channelTrendArr', 'channelRankArr', 'channelStructureArr']),
        hasTree () {
            return !_.isEmpty(this.channelTree);
        }
    },
    watch: {
        form: {
            handler: function () { },
            deep: true
        },
        cid: function () {
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
            this.getTreePrograss();
            this.getProgress();
            this.getStructure();
            this.getRank();
        }
    },
    mounted () {
        if (!this.hasTree) {
            this.getTree();
        } else {
            this.treeClone = _.cloneDeep(this.channelTree);
            this.cid = this.channelTree.nid;
        }
    // this.initFormDataFromUrl();
    },
    methods: {
        preOrder (node, cid) {
            for (let i of node) {
                if (i.nid == cid) {
                    return i;
                }
                if (i.children && i.children.length) {
                    if (this.preOrder(i.children, cid)) {
                        return this.preOrder(i.children, cid);
                    }
                }
            }
        },
        input (val) {
            this.form.date = val;
        },
        click () {
            if (this.cid == this.channelTree.nid) {
                return;
            } else {
                //点击发送请求清除搜索框
                this.$refs.child.clearKw();
                this.isbac = true;
                this.highlight = false;
                this.cid = this.channelTree.nid;
            }

        },
        change () {
            this.idArr = [];
            for (let i of this.stragetyCheckList) {
                let stragetyObj = this.stragety.find(el => {
                    return el.id == i;
                });
                this.idArr.push(stragetyObj.id);
            }
            // console.log(this.stragetyCheckList, this.idArr);
        },
        submit () {
            let data1 = JSON.parse(localStorage.data);
            this.$confirm('确认?', {
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                const data = {
                    nid: data1.cid,
                    rank: data1.rank,
                    subject: data1.subject,
                    time_label: data1.time_label,
                    strategies: this.idArr.join(',')
                };
                API.PostChannelSave(data).then(() => {
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: '保存成功'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '保存失败',
                        duration: 1500
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
        getTree () {
            const params = {
                subject: this.form.subject,
                ...this.getPeriodByPt(),
                version: this.form.version
            };
            API.GetChannelTree(params).then(res => {
                if (this.channelTree.cid == undefined) {
                    this.cid = res.tree.nid;
                }
                this.treeClone = _.cloneDeep(res.tree);
                this.$store.dispatch('SaveChannelTree', res.tree);
            });
        },
        //获取百分比数据
        getTreePrograss () {
            const params = {
                subject: this.form.subject,
                ...this.getPeriodByPt(),
                nid: this.cid
            };
            API.GetChannelTreePrograss(params).then(res => {
                let obj = this.preOrder([this.treeClone], this.cid);
                // console.log(obj,this.cid,res.data);
                if (obj.nid == this.cid) {
                    obj.real_total = res.data[this.cid].real;
                    obj.target_total = res.data[this.cid].target;
                }
                for (let i of obj.children) {
                    if (res.data.hasOwnProperty(i.nid)) {
                        i.real_total = res.data[i.nid].real;
                        i.target_total = res.data[i.nid].target;

                    }
                }
            });
        },
        getProgress () {
            this.loading = true;
            const params = {
                chId: this.cid,
                ...this.getPeriodByPt(),
            };
            API.GetChannelProgress(params).then(res => {
                this.$store.dispatch('SaveChannelProgress', res.data);
                const promises = _.map(res.data, o => this.getTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveChannelTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend (subject) {
            const params = {
                chId: this.cid,
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetChannelTrend(params);
        },
        getStructure () {
            this.loading = true;
            const params = {
                chId: this.cid,
                subject: this.form.subject,
                ...this.getPeriodByPt(),
            };
            API.GetChannelStructure(params).then(res => {
                this.$store.dispatch('SaveChannelStructureArr', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        getRank () {
            this.loading = true;
            const params = {
                chId: this.cid,
                ...this.getPeriodByPt(),
            };
            API.GetChannelRank(params).then(res => {
                this.$store.dispatch('SaveChannelRankArr', res.data);
            }).finally(() => {
                this.loading = false;
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
                    pt: '日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-31',
                };
            }
        },
        initFormDataFromUrl () {
            const {
                pt = '月', sDate = '', eDate = '', subject = 'S', cid = '1',
            } = this.$route.query;
            let formData = {
                pt: pt,
                subject: subject,
            };
            if (moment(sDate).isValid() && moment(eDate).isValid()) {
                formData.date = [sDate, eDate];
            }
            this.cid = cid;
            this.form = { ...this.form,...formData };
        },
        handleSearch (val) {
            this.highlight = true;
            this.nodeArr = [];
            this.val = val;
            if (!val.cid) {
                this.isbac = true;
                this.highlight = false;
                if (this.cid != this.channelTree.nid) {
                    this.cid = this.channelTree.nid;
                    this.treeClone = _.cloneDeep(this.channelTree);
                }else{
                    this.getTreePrograss();
                    this.getProgress();
                    this.getStructure();
                    this.getRank();
                }
            } else {
                this.isbac = false;
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
                this.cid = val.cid;
                if (this.cid == this.channelTree.nid) {
                    this.isbac = true;
                    this.highlight = false;
                }
            }
        },
        nodeExpand (data) {
            this.cid = data.nid;
            this.isbac = false;
            this.highlight = true;
        },
        handleNodeClick (data) {
            if (this.searchBarValue.sDate && this.searchBarValue.eDate) {
                this.val = this.searchBarValue;
                this.isbac = false;
                this.highlight = true;
                this.$refs.child.clearKw();
                if (this.cid === data.nid) {
                    return;
                } else if (data.children != undefined) {
                    this.cid = data.nid;
                }
            } else {
                this.highlight = false;
                this.$message({
                    type: 'error',
                    message: '请选择日期',
                    duration: 2000
                });
            }

        },
        calculatePercent (a, b) {
            if (b > 0) {
                const percent = parseInt(a / b * 100);
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
        clickIndex (i, idx) {
            this[`index${i}`] = idx;
        },
        showStragety (data) {
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
                nid: cid,
                subject: subject,
                rank: rank,
                time_label: time_label,
            };
            API.GetChannelMatch(params).then(res => {
                this.stragetyCheckList = [];
                this.stragety = res.data;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].is_selected == 1) {
                        this.stragetyCheckList.push(res.data[i].id);
                        // console.log(this.stragetyCheckList)
                    }
                }
            });

        }
    }
};
</script>

<style lang="scss">
@import '../Product/style/overview.scss';
</style>
