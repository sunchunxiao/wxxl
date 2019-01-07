<template>
  <div class="radar">
    <el-row
      v-if="productTree"
      class="content_radar-row"
      :gutter="20">
      <el-col
        :span="17"
        class="overflow">
        <el-row
          v-if="progressArr.length>0"
          v-loading="loading"
          class="">
          <Card>
            <el-row class="margin-bottom-20">目标达成情况总览</el-row>
            <slider
              height="250px"
              :min-move-num="50">
              <template v-for="(item, index) in progressArr">
                <el-col
                  :key="index"
                  :span="8">
                  <ProTargetAchievement
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </slider>
            <el-col
              v-if="rankArr.length > 0"
              :span="9"
              class="">
              <Radar
                :id="'select'"
                :data="rankArr[rankArr.length-1]" />
            </el-col>
          </Card>
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
import Slider from 'components/Slider';
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
import { calculatePercent, error, preOrder, find, addProperty } from 'utils/common';
//vuex
import { mapGetters } from 'vuex';
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const SUBJECT = 'P'; // S: 销售额 P: 利润额
export default {
    components: {
        "home":{
            template:`<div>111</div>`
        },
        "post":{
            template:`<div>222</div>`
        },
        Card,
        Slider,
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
            //tree
            cid: '',
            pt: '',
            error: error,
            find: find,
            preOrder: preOrder,
            addProperty: addProperty,
            calculatePercent: calculatePercent,
            showStragetyId: '',
            subject:'',
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
            treeClone: {},
            changeDate: {},
            findFatherId: '',
            tabs: ['home','post'],
            currView: 'home',
        };
    },
    computed: {
        ...mapGetters(['productTree', 'progressArr', 'trendArr', 'rankArr', 'structureArr', 'productDateArr','treePrograss']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        },
        hasStructure () {
            return !_.isEmpty(this.structureArr);
        },
        currentTabComponent: function() {
            return this.currView;
        }
    },
    tempalte:`111`,
    mounted () {
        // console.log(this.$store.state.product.tree1)
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
        getProgress() {
            this.loading = true;
            const params = {
                cid: this.cid,
                pt: this.getPt(),
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
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetProductTrend(params);
        },
        getStructure() {
            this.loading = true;
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            API.GetProductStructure(params).then(res => {
                this.$store.dispatch('SaveStructureArr', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        getRank() {
            if (this.getPt() === '日') {
                this.pt = '周';
            }else{
                this.pt = this.getPt();
            }
            this.loading = true;
            const params = {
                cid: this.cid,
                pt: this.pt,
                ...this.getPeriodByPt(),
            };
            API.GetProductRank(params).then(res => {
                this.$store.dispatch('SaveRankArr', res.data);
            }).finally(() => {
                this.loading = false;
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
            if (this.showStragetyId === cid && this.subject === subject) {
                return;
            }
            this.showStragetyId = cid;
            this.subject = subject;
            this.stragety = [];
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
