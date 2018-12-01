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
              :class="{comprogress: true, 'border-radius0': calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne}"
              :style="{width: calculatePercent(treeClone.real_total, treeClone.target_total).largerThanOne ? '105%' : `${calculatePercent(treeClone.real_total, treeClone.target_total).percent + 5}%`}" />
          </div>
        </div>
        <!-- 有多个tree -->
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
                <div class="tooltip_margin bold">品类:{{ data.name }}</div>
                <div class="tooltip_margin">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                <div
                  v-if="data.children"
                  class="tooltip_margin">子项目数 : {{ data.children.length }}</div>
                <div>毛利目标达成率: {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
              </div>
              <span class="label">
                <span class="label_left">{{ data.name }}</span>
                <span
                  v-if="data.real_total"
                  :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
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
                class="border-left">
                <Radar
                  :id="'select'"
                  :data="rankArr[rankArr.length-1]" />
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
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10">
          <Card>
            <el-row class="card-title">同比环比趋势分析</el-row>
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
        </el-row>
        <el-row
          v-loading="loading"
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析</el-row>
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
                class="border-left">
                <ProportionalStructureAverageComparisonBig
                  v-if="structureArr.length>0"
                  id="ProportionalStructureAverageComparisonBig"
                  :data="structureArr[index3]" />
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
                  id="rank"
                  @showStragety="showStragety"
                  :data="rankArr" />
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
                      @click="submit"
                      type="primary"
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
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import moment from 'moment';
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

import { mapGetters } from 'vuex';
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};

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
                subject: 'S', // S: 销售额 P: 利润额
            },
            cid: '',
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
            changeDate:''
        };
    },
    computed: {
        ...mapGetters(['productTree', 'progressArr', 'trendArr', 'rankArr', 'structureArr', 'productDateArr','treePrograss']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        }
    },
    mounted () {
        //获取初始值时间
        this.changeDate = this.searchBarValue.eDate;
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
        cid () {
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
            this.getTreePrograss();
            this.getProgress();
            this.getStructure();
            this.getRank();
        },
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
        click () {
            if (this.cid == this.productTree.cid) {
                return;
            } else {
                //点击发送请求清除搜索框
                this.$refs.child.clearKw();
                this.isbac = true;
                this.highlight = false;
                this.cid = this.productTree.cid;
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
        //树结构
        getTree () {
            const params = {
                // pt: this.form.pt,
                subject: this.form.subject,
                ...this.getPeriodByPt(),
            };
            API.GetProductTree(params).then(res => {
                if (this.productTree.cid == undefined) {
                    this.cid = res.tree.cid;
                }
                this.treeClone = _.cloneDeep(res.tree);
                this.$store.dispatch('SaveProductTree', res.tree);
            });
        },
        //获取百分比数据
        getTreePrograss(){
            this.loading = true;
            const params = {
                subject:this.form.subject,
                ...this.getPeriodByPt(),
                nid:this.cid
            };
            API.GetProductTreeProduct(params).then(res=>{
                let obj = this.preOrder([this.treeClone], this.cid);
                // console.log(obj,obj.cid,this.cid,res.data);
                if(obj.cid == this.cid){
                    obj.real_total = res.data[this.cid].real;
                    obj.target_total = res.data[this.cid].target;
                }
                for(let i of obj.children){
                    if(res.data.hasOwnProperty(i.cid)){
                        i.real_total = res.data[i.cid].real;
                        i.target_total = res.data[i.cid].target;
                    }
                }
                this.$store.dispatch('SaveProductTreePrograss', res.data);
            }).finally(() => {
                this.loading = false;
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
        getTrend (subject) {
            const params = {
                cid: this.cid,
                // pt: this.form.pt,
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetProductTrend(params);
        },
        getStructure () {
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
        getRank () {
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
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        handleSearch(val) {
            this.highlight = true;
            this.nodeArr = [];
            this.val = val;
            if(!val.cid){
                //时间没有改变不发送请求
                if(this.changeDate==this.searchBarValue.eDate){
                    return;
                }
                //记录最后一次选择的时间,对比时间是否改变
                this.changeDate = this.searchBarValue.eDate;
                this.isbac = true;
                this.highlight = false;
                //时间改变重新加载树,回到根节点
                if(this.cid!=this.productTree.cid){
                    this.cid = this.productTree.cid;
                    this.treeClone = _.cloneDeep(this.productTree);
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
                //如果是根节点
                if(this.cid==this.productTree.cid){
                    this.isbac = true;
                    this.highlight = false;
                }
            }

        },
        nodeExpand(data){
            this.cid = data.cid;
            this.isbac = false;
            this.highlight = true;
        },
        handleNodeClick (data) {
            if(this.searchBarValue.sDate&&this.searchBarValue.eDate){
                this.val = this.searchBarValue;
                this.isbac = false;
                this.highlight = true;
                this.$refs.child.clearKw();
                if (this.cid === data.cid) {
                    return;
                } else if (data.children != undefined) {
                    this.cid = data.cid;
                }
            }else{
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
                cid: cid,
                subject: subject,
                rank: rank,
                time_label: time_label,
            };

            API.GetProductMatch(params).then(res => {
                this.stragetyCheckList = [];
                this.stragety = res.data;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].is_selected == 1) {
                        this.stragetyCheckList.push(res.data[i].id);
                        // console.log(this.stragetyCheckList)
                    }
                }
                // this.$store.dispatch('SaveRankArr', res.data);
            });

        }
    }
};
</script>

<style lang="scss">
@import './style/overview.scss';
</style>
