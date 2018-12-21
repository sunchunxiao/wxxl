<template>
  <div class="overview">
    <el-row>
      <search-bar
        ref="child"
        @input="input"
        @search="handleSearch"
        url="/product/search"
        placeholder="产品编号/产品名称"
        v-model="searchBarValue"
        :pt-options="['日', '周', '月', '季', '年']" />
    </el-row>
    <el-row
      v-if="productTree"
      class="content_row"
      :gutter="20">
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
            <span
              :class="{percent: true, red: !calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne, blue: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
              class="right">{{ calculatePercent(treeClone.real_total, treeClone.target_total).percent + '%' }}</span>
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
                <span
                  :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
              </span>
            </el-tooltip>
            <div
              :class="{progress: true, 'border-radius-0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
          </span>
        </el-tree>
      </el-col>
      <el-col
        :span="18"
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <vue-lazy-component>
            <Card>
              <el-row class="margin-bottom-20">目标达成情况总览</el-row>
              <el-row>
                <el-col :span="15">
                  <template v-for="(item, index) in progressArr">
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
                  v-if="rankArr.length > 0"
                  :span="9"
                  class="border-left-2-gray">
                  <Radar
                    :id="'select'"
                    :data="rankArr[rankArr.length-1]" />
                </el-col>
              </el-row>
            </Card>
          </vue-lazy-component>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10 min-height-400">
          <vue-lazy-component>
            <Card>
              <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
              <el-row>
                <template v-for="(item, index) in trendArr">
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
          </vue-lazy-component>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10 min-height-400">
          <vue-lazy-component>
            <Card>
              <el-row class="margin-bottom-20">同比环比趋势分析</el-row>
              <el-row>
                <template v-for="(item, index) in trendArr">
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
          </vue-lazy-component>
        </el-row>
        <el-row
          v-if="hasStructure"
          v-loading="loading"
          class="margin-top-10 min-height-400">
          <vue-lazy-component>
            <Card>
              <el-row class="margin-bottom-20">比例结构与平均值对比分析</el-row>
              <el-row>
                <el-col :span="16">
                  <template v-for="(item, index) in structureArr">
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
                  class="border-left-2-gray">
                  <ProportionalStructureAverageComparisonBig
                    v-if="structureArr.length>0"
                    id="ProportionalStructureAverageComparisonBig"
                    :data="structureArr[index3]" />
                </el-col>
              </el-row>
            </Card>
          </vue-lazy-component>
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10 min-height-400">
          <vue-lazy-component>
            <Card>
              <el-row class="margin-bottom-20">智能评选和智能策略</el-row>
              <el-row>
                <el-col :span="14">
                  <IntelligentSelection
                    id="rank"
                    @changeTime="changeTime"
                    @showStragety = "showStragety"
                    :data="rankArr" />
                </el-col>
                <el-col :span="10">
                  <div class="stragety">
                    <div class="stragety-title">智能策略</div>
                    <div class="stragety-box">
                      <div class="margin-bottom-10">{{ stragetyTitle }}</div>
                      <el-checkbox-group v-model="stragetyCheckList">
                        <el-checkbox
                          v-for="(item,index) in stragety"
                          :key="index"
                          :label="item.id"
                          @change="change">{{ item.strategy }}</el-checkbox>
                      </el-checkbox-group>
                      <el-button
                        @click="submit"
                        type="primary"
                        class="center">确 认</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </Card>
          </vue-lazy-component>
        </el-row>
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
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
import Radar from 'components/radar';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
// 同比环比趋势分析
import ProYearOnYearTrend from 'components/ProYearOnYearTrend';
// 比例结构与平均值对比分析
import ProportionalStructureAverageComparison from 'components/ProportionalStructureAverageComparison';
import ProportionalStructureAverageComparisonBig from 'components/ProportionalStructureAverageComparisonBig';
// 智能评选和智能策略
import IntelligentSelection from 'components/IntelligentSelection';
//tree 百分比计算
import { calculatePercent, error } from 'utils/common';
//vuex
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
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            cid: '',
            //tree
            calculatePercent: calculatePercent,
            error: error,
            defaultProps: TREE_PROPS,
            loading: false,
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
            treeClone:{},
            changeDate:{},
            searchId:''
        };
    },
    computed: {
        ...mapGetters(['productTree', 'progressArr', 'trendArr', 'rankArr', 'structureArr', 'productDateArr','treePrograss']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        },
        hasStructure () {
            return !_.isEmpty(this.structureArr);
        }
    },
    mounted () {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        if (!this.hasTree) {
            this.$nextTick(() => {
                this.getTree();
            });
        } else {
            this.treeClone = _.cloneDeep(this.productTree);
            this.cid = this.productTree.cid;
        }
    },
    watch: {
        cid() {
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
            this.allRequest();
        }
    },
    methods: {
        allRequest() {
            this.getTreePrograss();
            this.getProgress();
            this.getStructure();
            this.getRank();
        },
        preOrder(node,cid) {
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
        input(val) {
            this.form.date = val;
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
        change() {
            this.idArr = [];
            for (let i of this.stragetyCheckList) {
                let stragetyObj = this.stragety.find(el => {
                    return el.id == i;
                });
                this.idArr.push(stragetyObj.id);
            }
        },
        submit() {
            let data1 = JSON.parse(localStorage.data);
            if(this.stragety.length){
                this.$confirm('确认?', {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    const data = {
                        cid: data1.cid,
                        rank: data1.rank,
                        subject: data1.subject,
                        time_label: data1.time_label,
                        strategies: this.idArr.join(',')
                    };
                    API.PostProductSave(data).then(() => {
                        this.$message({
                            showClose: true,
                            message: '保存成功'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                        duration: 1500
                    });
                });
            }else{
                this.error('无应用策略');
            }
        },
        addProperty(data) {//树结构添加属性
            for (let i of data) {
                data.map(o => {
                    o.hasData = false;
                });
                if (i.children && i.children.length) {
                    if (this.addProperty(i.children)) {
                        return this.addProperty(i.children);
                    }
                }
            }
        },
        forProperty(data,cid) {//树结构变换属性
            for (let i of data) {
                // console.log(i,cid);
                if (i.cid == cid) {
                    i.hasData = true;
                    return i;
                }
                if (i.children && i.children.length) {
                    if (this.forProperty(i.children, cid)) {
                        return this.forProperty(i.children, cid);
                    }
                }
            }
        },
        parentId(node,cid) {//找父节点id
            for (let i of node){
                // console.log(i);
                if (i.cid == cid) {
                    if(i.hasData == false){
                        this.parentId(node,i.parent_id);
                        return i.parent_id;
                    }
                }
                if (i.children && i.children.length) {
                    if (this.parentId(i.children, cid)) {
                        return this.parentId(i.children,cid);
                    }
                }
            }
        },
        dataRequest(cid) {
            this.getTreePrograss(cid);
            // let obj = this.parentId([this.treeClone], this.searchId);
            // console.log(obj);
            // this.parentId([this.treeClone], obj.parent_id);
            // this.getTreePrograss(obj.parent_id);
            // let obj1 = this.parentId([this.treeClone], obj.parent_id);
            // console.log(obj1,obj1.parent_id);
        },
        //树结构
        getTree() {
            const params = {
                subject: SUBJECT,
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
                    // console.log(this.treeClone);
                }
                this.$store.dispatch('SaveProductTree', res.tree);
            });
        },
        //获取百分比数据
        getTreePrograss(cid) {
            // console.log(cid);
            let id;
            if (cid) {
                id = cid;
            } else {
                id = this.cid;
            }
            const params = {
                subject: SUBJECT,
                ...this.getPeriodByPt(),
                nid: id
            };
            API.GetProductTreeProduct(params).then(res => {
                let obj = this.preOrder([this.treeClone], id);
                this.forProperty([this.treeClone], id);//插入数据的hasData为true
                if (obj.cid === id) {
                    obj.real_total = res.data[id].real;
                    obj.target_total = res.data[id].target;
                }
                if (obj.children) {
                    for (let i of obj.children) {
                        if (_.has(res.data, i.cid)) {
                            this.forProperty([this.treeClone], i.cid);
                            i.real_total = res.data[i.cid].real;
                            i.target_total = res.data[i.cid].target;
                        }
                    }
                }
                // console.log(this.treeClone);
            });
        },
        getProgress() {
            this.loading = true;
            const params = {
                cid: this.cid,
                ...this.getPeriodByPt(),
            };
            API.GetProductProgress(params).then(res => {
                this.$store.dispatch('SaveProgressData', res.data);
                const promises = _.map(res.data, o => this.getTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend(subject) {
            this.loading = true;
            const params = {
                cid: this.cid,
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetProductTrend(params);
        },
        getStructure() {
            this.loading = true;
            const params = {
                cid: this.cid,
                ...this.getPeriodByPt(),
            };
            API.GetProductStructure(params).then(res => {
                this.$store.dispatch('SaveStructureArr', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        getRank() {
            this.loading = true;
            const params = {
                cid: this.cid,
                ...this.getPeriodByPt(),
            };
            API.GetProductRank(params).then(res => {
                this.$store.dispatch('SaveRankArr', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        getDateObj() {
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
        getPeriodByPt() {
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
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        handleSearch(val) {
            this.searchId = val.cid;
            // console.log(this.searchId);
            this.highlight = true;
            this.nodeArr = [];
            this.val = val;
            if (!val.cid){
                this.isbac = true;
                this.highlight = false;
                if (this.cid) {//数据tree不为null时
                    if (this.cid !== this.productTree.cid){
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
                }
                this.changeDate = this.searchBarValue;
                this.cid = val.cid;
                this.isbac = false;
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
                this.dataRequest(this.searchId);
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
        clickIndex(i, idx) {
            this[`index${i}`] = idx;
        },
        changeTime() {
            this.stragetyTitle = '';
            this.stragety = [];
        },
        showStragety(data) {
            localStorage.setItem("data", JSON.stringify(data));
            const {
                cid,
                brand,
                name,
                subject,
                time_label,
                rank
            } = data;
            this.stragetyTitle = `${brand} - ${name} - ${rank}`;
            const params = {
                cid: cid,
                subject: subject,
                rank: rank,
                time_label: time_label,
            };
            API.GetProductMatch(params).then(res => {
                this.stragetyCheckList = [];
                this.idArr = [];
                this.stragety = res.data;
                const checked = 1;//1是选中,0是不选中
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].is_selected === checked) {
                        this.stragetyCheckList.push(res.data[i].id);
                        this.idArr.push(res.data[i].id);
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
@import './style/overview.scss';
</style>
