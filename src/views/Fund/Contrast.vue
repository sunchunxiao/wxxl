<template>
  <div class="con_container">
    <el-row
      class="time_header">
      <!-- 展开按钮 -->
      <div
        class="contrast_btn"
        @click="handleCollapse">
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
        @input="input"
        url="/fund/search"
        @search="handleSearch"
        v-model="searchBarValue"
        placeholder="组织编号/组织名称"
        :pt-options="['月', '季', '年']" />
    </el-row>
    <div class="contrast">
      <el-row
        v-if="fundTree"
        type="flex"
        class="content_row">
        <el-col
          :span="5"
          :class="{'tree_block_none':isCollapse}"
          class="tree_container">
          <div
            size="mini"
            class="clean_btn">
            <span
              @click="startChecked"
              class="select start_select ">开始对比</span>
            <span
              @click="cleanChecked"
              class="select clean_select">取消全部</span>
          </div>
          <!-- <div class="title_target">
            <span>毛利目标未达标数: <span class="title">{{ noStandardNum }}</span></span>
          </div> -->
          <div class="tree_content">
            <div class="company">
              <span class="left">{{ treeClone.name }}</span>
            </div>
            <el-tree
              ref="tree"
              check-strictly
              show-checkbox
              node-key="cid"
              :data="treeClone.children"
              empty-text="正在加载"
              :default-expanded-keys="nodeArr"
              :props="defaultProps"
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
                    <div class="margin-bottom-5">{{ data.name }} : {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
                    <div class="margin-bottom-5">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                    <div
                      v-if="data.children"
                      class="margin-bottom-5">宽度 : {{ data.children.length }}</div>
                  </div>
                  <span class="label">
                    <span class="label_left"><span v-if="data.type==2">* </span>{{ data.name }}</span>
                  </span>
                </el-tooltip>
                <div
                  :class="{progress: true, 'border-radius-0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
                  :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}" />
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col
          :span="19"
          class="overflow">
          <div
            v-loading="loading"
            class="min-height-400">
            <Card>
              <el-row class="margin-bottom-20">组织对比分析和平均值分析前端</el-row>
              <el-row v-if="hasConstarst">
                <slider
                  height="170px"
                  class="margin-bottom-20"
                  :min-move-num="50">
                  <template v-for="(item, index) in fundcompareArr">
                    <el-col
                      :key="index"
                      style="width:200px"
                      @click.native="clickIndex(0 ,index)">
                      <ConOrgComparisonAverage
                        :class="{'menu_list_opciaty':opcityIndex==index, 'menu_list_opciatyAll':opciatyBool}"
                        :title="item.subject_name"
                        :id="`${index}`"
                        :unit="getUnit(item, fundSubject)"
                        :data="item" />
                    </el-col>
                  </template>
                </slider>
                <ConOrgComparisonAverageBig
                  v-if="fundcompareArr.length > 0"
                  :title="fundcompareArr[index0].subject_name"
                  :data="fundcompareArr[index0]"
                  id="ConOrgComparisonAverage"
                  :unit="getUnit(fundcompareArr[index0], fundSubject)"
                  :index="index0" />
              </el-row>
              <el-row
                v-if="!loading&&!hasConstarst"
                class="please_select">
                请选择要对比的项目
              </el-row>
            </Card>
            <Card v-if="hasConstarstBack">
              <el-row class="margin-bottom-20">组织对比分析和平均值分析后端</el-row>
              <el-row
                v-if="fundcompareArrback.length>0">
                <slider
                  class="margin-bottom-20"
                  height="170px"
                  :min-move-num="50">
                  <template v-for="(item1, index) in fundcompareArrback">
                    <el-col
                      :key="index"
                      style="width:200px"
                      @click.native="clickIndex(1 ,index)">
                      <ConOrgComparisonAverage
                        :title="item1.subject_name"
                        :id="`fundcompareArrback${index}`"
                        :unit="getUnit(item1, fundBackSubject)"
                        :data="item1" />
                    </el-col>
                  </template>
                </slider>
                <ConOrgComparisonAverageBig
                  v-if="fundcompareArrback.length > 0"
                  :title="fundcompareArrback[index1].subject_name"
                  :data="fundcompareArrback[index1]"
                  :unit="getUnit(fundcompareArrback[index1], fundBackSubject)"
                  id="ConOrgComparisonAverage1"
                  :index="index1" />
              </el-row>
              <el-row
                v-if="!loading&&!fundcompareArrback.length"
                class="please_select">
                请选择要对比的项目
              </el-row>
            </Card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from '../../components/Card';
import SearchBar from 'components/SearchBar';
import Slider from 'components/Slider';
//data 指标
import { fund, fundBack } from '../../data/subject';
// 组织对比分析和平均值分析
import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';
//tree 百分比计算
import { calculatePercent, error, preOrder, find, addProperty, echartAndSliderResize } from 'utils/common';
import { mapGetters } from 'vuex';
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const SUBJECT = 'P'; // S: 销售额 P: 利润额

export default {
    components: {
        Card,
        Slider,
        SearchBar,
        ConOrgComparisonAverage,
        ConOrgComparisonAverageBig
    },
    data() {
        return {
            form: {
                pt: '月',
                date: {},
                search: '',
                version: '0'
            },
            //data
            fundSubject: fund(),
            fundBackSubject: fundBack(),
            loading: false,
            cid:'',
            error:error,
            find: find,
            preOrder: preOrder,
            addProperty: addProperty,
            calculatePercent:calculatePercent,
            defaultProps: TREE_PROPS,
            index0: 0,
            index1: 0,
            type:3,
            val:{},
            nodeArr:[],
            cidObjArr:[],
            cidObjBackArr:[],
            cancelKey: '',
            isFirstLoad: true,
            debounce: null,
            debounceBack:null,
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
            changeDate: {},
            treeClone:{},
            findFatherId: '',
            style: 0,
            opcityIndex: undefined,
            opciatyBool: false,
            isCollapse: false,
            treeProgressLoading: true,
            noStandardObj: {},
            noStandardNum: 0,
            isFirstCheck: true,
            initCheckKeys: []
        };
    },
    computed: {
        ...mapGetters(['fundTree', 'fundcompareArr', 'fundcompareArrback', 'fundLastcidObjArr', 'fundLastcidObjArrBack']),
        hasConstarst () {
            return !_.isEmpty(this.fundcompareArr);
        },
        hasConstarstBack () {
            return !_.isEmpty(this.fundcompareArrback);
        },
        num () {
            if (this.cidObjArr.length || this.cidObjBackArr.length) {
                return this.cidObjArr.length + this.cidObjBackArr.length;
            } else {
                return 0;
            }
        },
    },
    watch: {
        cidObjArr(val) {
            if (val.length > 0) {
                // for (let i of val) {
                //     this.cid = i.cid;
                // }
                // this.debounce();
            } else if (val.length === 0) {
                this.$store.dispatch('ClearFundCompareArr');
            }
        },
        cidObjBackArr(val) {
            if (val.length > 0) {
                // for (let i of val) {
                //     this.cid = i.cid;
                // }
                // this.debounceBack();
            } else if (val.length === 0) {
                this.$store.dispatch('ClearFundBackCompareArr');
            }
        },
        cid() {
            this.getTreePrograss();
        }
    },
    created() {
        // 防抖函数 减少发请求次数
        this.debounce = _.debounce(this.getCompare, 0);
        this.debounceBack = _.debounce(this.getCompareBack, 0);
    },
    mounted() {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        if (this.fundcompareArr.length) {
            this.cid = this.fundTree.cid;
            this.treeClone = _.cloneDeep(this.fundTree);
            this.addProperty([this.treeClone]);
            let arr = [];
            let arrback = [];
            for(let i = 0; i < this.treeClone.children.length; i++) {
                if(this.treeClone.children[i].type === 1 || this.treeClone.children[i].type === 3){
                    this.treeClone.children[i] && arr.push(this.treeClone.children[i]);
                }else if(this.treeClone.children[i].type === 2){
                    this.treeClone.children[i] && arrback.push(this.treeClone.children[i]);
                }
            }
            const checkKeys = arr.map(i => i.cid);
            const checkBackKeys = arrback.map(i => i.cid);
            const allCheckKeys = [...checkKeys,...checkBackKeys];
            this.initCheckKeys = allCheckKeys;
            this.$store.dispatch('SaveFundTree', this.fundTree).then(() => {
                this.$refs.tree.setCheckedKeys(allCheckKeys);
                let promiseArr = [];
                for (let i of allCheckKeys) {
                    promiseArr.push(this.getTreePrograss(i, false));
                }
                this.isFirstCheck = false;
                Promise.all(promiseArr).then(() => {
                    this.getNoStandardNum();
                });
            });
            this.debounce();
            this.debounceBack();
        }else{
            this.promise();
        }
    },
    destroyed() {
        this.$store.dispatch('SaveFundCompareArrback', []);
    },
    methods: {
        getNoStandardNum() {
            let num = 0;
            for (let i in this.noStandardObj) {
                num += this.noStandardObj[i];
            }
            this.noStandardNum = num;
        },
        getUnit(item, sujectData) {
            let obj = sujectData.find(el => {
                return el.subject == item.subject && el.subject_name == item.subject_name;
            });
            return obj ? obj.subject_unit : "";
        },
        promise() {
            Promise.all([this.getTree()]).then(res => {
                // 树
                const treeData = res[0];
                this.cid = treeData.tree.cid;
                this.treeClone = _.cloneDeep(treeData.tree);
                this.addProperty([this.treeClone]);
                const children = this.treeClone.children;
                let arr = [];
                let arrback = [];
                for(let i = 0; i < children.length; i++) {
                    if(children[i].type === 1 || children[i].type === 3){
                        children[i] && arr.push(children[i]);
                    }else if(children[i].type === 2){
                        children[i] && arrback.push(children[i]);
                    }
                }
                const checkKeys = arr.map(i => i.cid);
                const checkBackKeys = arrback.map(i => i.cid);
                const allCheckKeys = [...checkKeys,...checkBackKeys];
                this.initCheckKeys = allCheckKeys;
                this.$store.dispatch('SaveFundTree', treeData.tree).then(() => {
                    this.$refs.tree.setCheckedKeys(allCheckKeys);
                    let promiseArr = [];
                    for (let i of allCheckKeys) {
                        promiseArr.push(this.getTreePrograss(i, false));
                    }
                    Promise.all(promiseArr).then(() => {
                        this.isFirstCheck = false;
                        this.getNoStandardNum();
                    });
                });
                this.debounce();
                this.debounceBack();
            });
        },
        handleCollapse () {
            this.isCollapse = !this.isCollapse;
            setTimeout(() =>{
                echartAndSliderResize();
            }, 300);
        },
        startChecked() {
            this.val = this.searchBarValue;
            if (this.changeDate.sDate !== this.val.sDate || this.changeDate.eDate !== this.val.eDate) {
                const allCidArr = [...this.cidObjArr, ...this.cidObjBackArr];
                let promiseArr = [];
                for (let i of allCidArr) {
                    promiseArr.push(this.getTreePrograss(i.cid, false));
                }
                Promise.all(promiseArr).then(() => {
                    this.getNoStandardNum();
                });
                this.debounce();
                this.debounceBack();
            }
            this.changeDate = this.searchBarValue;
            this.$refs.child.clearKw();
            const bool = JSON.stringify(this.fundLastcidObjArr) == JSON.stringify(this.cidObjArr);
            const boolBack = JSON.stringify(this.fundLastcidObjArrBack) == JSON.stringify(this.cidObjBackArr);
            if (!bool) {
                this.debounce();
            }
            if (!boolBack) {
                this.debounceBack();
            }
        },
        cleanChecked() {
            this.noStandardObj = {};
            this.noStandardNum = 0;
            this.cidObjArr = [];
            this.cidObjBackArr = [];
            this.$refs.tree.setCheckedKeys([]);
            this.$store.dispatch('SaveFundCidObj',_.cloneDeep(this.cidObjArr));
            this.$store.dispatch('SaveFundCidObjBack',_.cloneDeep(this.cidObjBackArr));
        },
        allRequest() {
            this.getTreePrograss();
            this.getCompare();
            this.getCompareBack();
        },
        input (val) {
            this.form.date = val;
        },
        findParent(node,cid) {//找父节点id
            let hasfatherCid = [];
            this.find(cid, node, hasfatherCid);
            for (let i of hasfatherCid) {
                this.getTreePrograss(i);
            }
        },
        getTree() {
            const params = {
                subject: SUBJECT,
                ...this.getPeriodByPt(),
                version: this.form.version
            };
            return API.GetFundTree(params);
        },
        //获取百分比数据
        getTreePrograss(cid, isGetNoStandardNum = true) {
            let id;
            if (cid) {
                id = cid;
            } else {
                id = this.cid;
            }
            const params = {
                subject: SUBJECT,
                ...this.getPeriodByPt(),
                nid: id,
                version: this.form.version
            };
            return new Promise((resolve,reject) => {
                API.GetFundTreePrograss(params).then(res=>{
                    let obj = this.preOrder([this.treeClone], id);
                    let arr = [];
                    const allCidArr = [...this.cidObjArr, ...this.cidObjBackArr];
                    for (let i of allCidArr) {
                        arr.push(i.cid);
                    }
                    if(obj.cid == id) {
                        obj.hasData = true;//插入数据的hasData为true
                        obj.real_total = res.data[id].real;
                        obj.target_total = res.data[id].target;
                    }
                    if (obj.children) {
                        if (_.includes(arr, obj.cid)) {
                            this.noStandardObj[obj.cid] = 0;
                        }
                        for (let i of obj.children) {
                            if (_.has(res.data, i.cid)) {
                                i.real_total = res.data[i.cid].real;
                                i.target_total = res.data[i.cid].target;
                                if (_.includes(arr, obj.cid)) {
                                    if (!this.calculatePercent(i.real_total,i.target_total).largerThanOne) {
                                        this.noStandardObj[obj.cid] ++;
                                        if (isGetNoStandardNum) {
                                            this.getNoStandardNum();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            });

        },
        getCompare() {
            if (!this.cidObjArr.length) {
                return;
            }
            this.loading = true;
            const promises = _.map(this.fundSubject, o => this.getTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.fundSubject[k].subject;
                    v.subject_name = this.fundSubject[k].subject_name;
                });
                const cidName = this.cidObjArr.map(o => o.name);
                let lastCidObjArr = [];
                for (let i of resultList[0].nodes) {
                    let obj = this.cidObjArr.find(el => el.name == i);
                    if (obj) {
                        lastCidObjArr.push(obj);
                    }
                }
                this.$store.dispatch('SaveFundCidObj',_.cloneDeep(lastCidObjArr));
                // 只有当返回的跟当前选中的一样才更新 store
                if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
                    this.$store.dispatch('SaveFundCompareArr', resultList);
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend(subject) {
            let params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version: this.form.version,
            };
            const checkKeys = this.cidObjArr.map(i => i.cid);
            params.targets = checkKeys.join(',');
            return API.GetFundCompare(params);
        },
        getCompareBack() {
            if (!this.cidObjBackArr.length) {
                return;
            }
            this.loading = true;
            const promises = _.map(this.fundBackSubject, o => this.getTrendback(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.fundBackSubject[k].subject;
                    v.subject_name = this.fundBackSubject[k].subject_name;
                });
                const cidName = this.cidObjBackArr.map(o => o.name);
                let lastCidObjArr = [];
                for (let i of resultList[0].nodes) {
                    let obj = this.cidObjBackArr.find(el => el.name == i);
                    if (obj) {
                        lastCidObjArr.push(obj);
                    }
                }
                this.$store.dispatch('SaveFundCidObjBack',_.cloneDeep(lastCidObjArr));
                // 只有当返回的跟当前选中的一样才更新 store
                if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
                    this.$store.dispatch('SaveFundCompareArrback', resultList);
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrendback(subject) {
            let params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version: this.form.version,
            };
            const checkKeys = this.cidObjBackArr.map(i => i.cid);
            params.targets = checkKeys.join(',');
            return API.GetFundCompare(params);
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
                    pt: '月',
                    sDate: '2018-03-01',
                    eDate: '2018-06-30',
                };
            }
        },
        handleSearch(val) {
            this.findFatherId = val.cid;
            this.nodeArr = [];
            this.val = val;
            const allCidArr = [...this.cidObjArr, ...this.cidObjBackArr];
            if (!val.cid) {
                if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate) {
                    let promiseArr = [];
                    for (let i of allCidArr) {
                        promiseArr.push(this.getTreePrograss(i.cid, false));
                    }
                    Promise.all(promiseArr).then(() => {
                        this.getNoStandardNum();
                    });
                    this.allRequest();

                }
            } else {
                //搜索相同的id,改变时间
                if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate) {
                    for (let i of allCidArr) {
                        this.getTreePrograss(i.cid);
                    }
                    this.allRequest();
                    // this.treeClone = _.cloneDeep(this.fundTree);
                }
                this.cid = val.cid;
                this.findParent([this.treeClone], this.findFatherId);
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
            }
            this.changeDate = this.searchBarValue;
        },
        nodeExpand(data) {
            this.cid = data.cid;
        },
        handleCheckChange(data, checked) {
            const type = 2;//1是前端,2是后端
            if (!checked) {
                delete this.noStandardObj[data.cid];
                this.getNoStandardNum();
            }
            // 取消选择多于 4 个的后面的值 这个是为了在 setCheckedKeys 时, 第四个以后的都会取消选择
            // 组件第二次加载的时候, tree.setCheckedKeys 后会调用 handleCheckChange 应该是 tree 的一个bug 所以我们暂时用一个标志来防止它进入后面的流程
            if (!checked && this.cancelKey && data.cid === this.cancelKey) {
                const index = _.findIndex(this.cidObjArr, item => item.cid === data.cid);
                if (index >= 0) {
                    this.cidObjArr.splice(index, 1);
                }
                return;
            }
            if (checked) { // 如果选中
                if (data.type === type) {
                    // 如果有选中的节点 并且此次选择了不同pid的节点
                    if (this.cidObjBackArr[0] && data.parent_id !== this.cidObjBackArr[0].parent_id) {
                        this.warn('请选择相同父级下的后端进行对比');
                        this.cancelKey = data.cid;
                        const checkKeys = this.cidObjArr.map(i => i.cid);
                        const checkBackKeys = this.cidObjBackArr.map(i => i.cid);
                        const allCheckKeys = [...checkKeys,...checkBackKeys];
                        this.$refs.tree.setCheckedKeys(allCheckKeys);
                        return;
                    }
                    this.cidObjBackArr.push(data);
                    if (!this.isFirstCheck || !this.initCheckKeys.includes(data.cid)) {
                        this.cid = data.cid;
                    }
                    // else if (this.cidObjArr.length === 4) {
                    // 		this.warn('最多对比 4 条');
                    // 		this.cancelKey = data.cid;
                    // 		const checkKeys = this.cidObjArr.map(i => i.cid);
                    // 		this.$refs.tree.setCheckedKeys(checkKeys);
                    // }
                } else {
                    // 如果有选中的节点 并且此次选择了不同pid的节点
                    if (this.cidObjArr[0] && data.parent_id !== this.cidObjArr[0].parent_id) {
                        this.warn('请选择相同父级下的前端进行对比');
                        this.cancelKey = data.cid;
                        const checkKeys = this.cidObjArr.map(i => i.cid);
                        const checkBackKeys = this.cidObjBackArr.map(i => i.cid);
                        const allCheckKeys = [...checkKeys,...checkBackKeys];
                        this.$refs.tree.setCheckedKeys(allCheckKeys);
                        return;
                    }
                    this.cidObjArr.push(data);
                    if (!this.isFirstCheck || !this.initCheckKeys.includes(data.cid)) {
                        this.cid = data.cid;
                    }
                    // 如果选中的个数不超过 4
                    // if (this.cidObjArr.length < 4) {
                    //      this.cidObjArr.push(data);
                    // } else if (this.cidObjArr.length === 4) {
                    // 		this.warn('最多对比 4 条');
                    // 		this.cancelKey = data.cid;
                    // 		const checkKeys = this.cidObjArr.map(i => i.cid);
                    // 		this.$refs.tree.setCheckedKeys(checkKeys);
                    // }
                }
                if (data.hasData) {
                    if (data.children) {
                        this.noStandardObj[data.cid] = 0;
                        for (let i of data.children) {
                            if (!this.calculatePercent(i.real_total,i.target_total).largerThanOne) {
                                this.noStandardObj[data.cid] ++;
                                this.getNoStandardNum();
                            }
                        }
                    }
                }
            } else { // 如果取消选择
                // 找到取消选择的下标
                if (data.type === type) {
                    // 找到取消选择的下标
                    const index = _.findIndex(this.cidObjBackArr, item => item.cid === data.cid);
                    this.cidObjBackArr.splice(index, 1);
                } else {
                    const index = _.findIndex(this.cidObjArr, item => item.cid === data.cid);
                    this.cidObjArr.splice(index, 1);
                }
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
            this.opcityIndex = idx;
            this.opciatyBool = true;
        },
    }
};
</script>

<style lang="scss">
@import '../Product/style/contrast.scss';
@import '../../style/tree.scss';
</style>
