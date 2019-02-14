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
        @search="handleSearch"
        v-model="searchBarValue"
        placeholder="渠道编号/渠道名称"
        url="/channel/search" />
    </el-row>
    <div class="contrast">
      <el-row
        v-if="channelTree"
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
          <div class="title_target">
            <span>毛利目标未达标数: <span class="title">{{ noStandardNum }}</span></span>
          </div>
          <div class="tree_content">
            <div class="company">
              <span class="left">{{ treeClone.name }}</span>
            </div>
            <el-tree
              ref="tree"
              check-strictly
              show-checkbox
              node-key="nid"
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
                    <div class="margin-bottom-5">品类:{{ data.name }} : {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
                    <div class="margin-bottom-5">在架时间 : {{ `${getPeriodByPt().sDate}至${getPeriodByPt().eDate}` }}</div>
                    <div
                      v-if="data.children"
                      class="margin-bottom-5">宽度 : {{ data.children.length }}</div>
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
          </div>
        </el-col>
        <el-col
          :span="19"
          class="overflow">
          <div
            v-loading="loading"
            class="min-height-400">
            <Card>
              <el-row class="margin-bottom-20">产品对比分析和平均值分析</el-row>
              <el-row v-if="channelCompareArr.length">
                <slider
                  height="170px"
                  :min-move-num="50">
                  <template v-for="(item, index) in channelCompareArr">
                    <el-col
                      :key="index"
                      style="width:200px">
                      <ConOrgComparisonAverage
                        :class="{'menu_list_opciaty':opcityIndex==index, 'menu_list_opciatyAll':opciatyBool}"
                        @click.native="clickIndex(index)"
                        :id="`${index}`"
                        :unit="getUnit(item)"
                        :data="item" />
                    </el-col>
                  </template>
                </slider>
                <Card>
                  <ConOrgComparisonAverageBig
                    :title="channelCompareArr[index0].subject_name"
                    :data="channelCompareArr[index0]"
                    :unit="getUnit(channelCompareArr[index0])"
                    id="ConOrgComparisonAverage"
                    :index="index0" />
                </Card>
              </el-row>
              <div
                class="please_select"
                v-if="!loading&&!channelCompareArr.length">
                请选择要对比的项目
              </div>
            </Card>
          </div>
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
import SearchBar from 'components/SearchBar';
import Slider from 'components/Slider';
import Card from '../../components/Card';
// 组织对比分析和平均值分析
import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';
//data 指标
import { channel } from '../../data/subject';
//tree 百分比计算
import { calculatePercent, error, preOrder, find, addProperty, echartAndSliderResize } from 'utils/common';
//vuex
import { mapGetters } from 'vuex';
const BTN = ['开始对比','取消选择'];
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
                date: [],
            },
            cid: '',
            btn: BTN,
            //data
            channelSubject: channel(),
            error: error,
            find: find,
            preOrder: preOrder,
            addProperty: addProperty,
            calculatePercent: calculatePercent,
            defaultProps: TREE_PROPS,
            index0: 0,
            loading: false,
            cidObjArr: [],
            cancelKey: '',
            debounce: null,
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
        ...mapGetters(['channelTree','channelCompareArr', 'channelLastcidObjArr']),
        hasTree() {
            return !_.isEmpty(this.channelTree);
        },
        num () {
            if (this.cidObjArr.length) {
                return this.cidObjArr.length;
            } else {
                return 0;
            }
        },
    },
    watch: {
        cidObjArr(val) {
            if (val.length > 0) {
                // for (let i of val) {
                //     this.cid = i.nid;
                // }
            } else if (val.length == 0) {
                this.$store.dispatch('ClearChannelCompareArr');
            }
        },
        cid() {
            this.getTreePrograss();
        }
    },
    created() {
    // 防抖函数 减少发请求次数
        this.debounce = _.debounce(this.getCompare, 0);
    },
    mounted() {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        if (this.channelCompareArr.length) {
            this.cid = this.channelTree.nid;
            this.treeClone = _.cloneDeep(this.channelTree);
            this.addProperty([this.treeClone]);
            let arr = [];
            for (let i = 0; i < 3; i++) {
                this.treeClone.children[i] && arr.push(this.treeClone.children[i]);
            }
            const checkKeys = arr.map(i => i.nid);
            this.initCheckKeys = checkKeys;
            this.$store.dispatch('SaveChannelTree', this.channelTree).then(() => {
                this.$refs.tree.setCheckedKeys(checkKeys);
                let promiseArr = [];
                for (let i of checkKeys) {
                    promiseArr.push(this.getTreePrograss(i, false));
                }
                this.isFirstCheck = false;
                Promise.all(promiseArr).then(() => {
                    this.getNoStandardNum();
                });
            });
            this.debounce();
        } else {
            this.promise();
        }
    },
    methods: {
        getNoStandardNum() {
            let num = 0;
            for (let i in this.noStandardObj) {
                num += this.noStandardObj[i];
            }
            this.noStandardNum = num;
        },
        getUnit(item) {
            let obj = this.channelSubject.find(el => {
                return el.subject == item.subject && el.subject_name == item.subject_name;
            });
            return obj ? obj.subject_unit : "";
        },
        promise() {
            Promise.all([this.getTree()]).then(res => {
                // 树
                const treeData = res[0];
                if (treeData.tree) {
                    this.cid = treeData.tree.nid;
                    this.treeClone = _.cloneDeep(treeData.tree);
                    this.addProperty([this.treeClone]);
                    const children = treeData.tree.children;
                    let arr = [];
                    for (let i = 0; i < 3; i++) {
                        children[i] && arr.push(children[i]);
                    }
                    const checkKeys = arr.map(i => i.nid);
                    this.initCheckKeys = checkKeys;
                    this.$store.dispatch('SaveChannelTree', treeData.tree).then(() => {
                        this.$refs.tree.setCheckedKeys(checkKeys);
                        let promiseArr = [];
                        for (let i of checkKeys) {
                            promiseArr.push(this.getTreePrograss(i, false));
                        }
                        Promise.all(promiseArr).then(() => {
                            this.isFirstCheck = false;
                            this.getNoStandardNum();
                        });
                    });
                }
                this.debounce();
            });
        },
        startChecked() {
            this.val = this.searchBarValue;
            if (this.changeDate.sDate !== this.val.sDate || this.changeDate.eDate !== this.val.eDate) {
                let promiseArr = [];
                for (let i of this.cidObjArr) {
                    promiseArr.push(this.getTreePrograss(i.nid, false));
                }
                Promise.all(promiseArr).then(() => {
                    this.getNoStandardNum();
                });
                this.debounce();
            }
            this.changeDate = this.searchBarValue;
            this.$refs.child.clearKw();
            const bool = JSON.stringify(this.channelLastcidObjArr) == JSON.stringify(this.cidObjArr);
            if (bool) {
                return;
            }
            this.debounce();
        },
        cleanChecked () {
            this.noStandardObj = {};
            this.noStandardNum = 0;
            this.cidObjArr = [];
            this.$refs.tree.setCheckedKeys([]);
            this.$store.dispatch('SaveChannelCidObj',_.cloneDeep(this.cidObjArr));
        },
        handleCollapse () {
            this.isCollapse = !this.isCollapse;
            setTimeout(() =>{
                echartAndSliderResize();
            }, 300);
        },
        allRequest() {
            this.getTreePrograss();
            this.getCompare();
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
            };
            return API.GetChannelTree(params);
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
                nid: id
            };
            return new Promise((resolve,reject) => {
                API.GetChannelTreePrograss(params).then(res => {
                    let obj = this.preOrder([this.treeClone], id);
                    let arr = [];
                    for(let i of this.cidObjArr){
                        arr.push(i.nid);
                    }
                    if (obj.nid === id) {
                        obj.hasData = true;//插入数据的hasData为true
                        obj.real_total = res.data[id].real;
                        obj.target_total = res.data[id].target;
                    }
                    if (obj.children) {
                        if (_.includes(arr, obj.nid)) {
                            this.noStandardObj[obj.nid] = 0;
                        }
                        for (let i of obj.children) {
                            if (_.has(res.data, i.nid)) {
                                i.real_total = res.data[i.nid].real;
                                i.target_total = res.data[i.nid].target;
                                if (_.includes(arr, obj.nid)) {
                                    if (!this.calculatePercent(i.real_total,i.target_total).largerThanOne) {
                                        this.noStandardObj[obj.nid] ++;
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
            const promises = _.map(this.channelSubject, o => this.getTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.channelSubject[k].subject;
                    v.subject_name = this.channelSubject[k].subject_name;
                });
                const cidName = this.cidObjArr.map(o => o.name);
                let lastCidObjArr = [];
                for (let i of resultList[0].nodes) {
                    let obj = this.cidObjArr.find(el => el.name == i);
                    if (obj) {
                        lastCidObjArr.push(obj);
                    }
                }
                this.$store.dispatch('SaveChannelCidObj',_.cloneDeep(lastCidObjArr));
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
                    pt: '日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-07',
                };
            }
        },
        handleSearch(val) {
            this.findFatherId = val.cid;
            this.nodeArr = [];
            this.val = val;
            if (!val.cid) {
                let promiseArr = [];
                for (let i of this.cidObjArr) {
                    promiseArr.push(this.getTreePrograss(i.nid, false));
                }
                Promise.all(promiseArr).then(() => {
                    this.getNoStandardNum();
                });
                this.allRequest();
            } else {
                //搜索相同的id,改变时间
                if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate) {
                    this.allRequest();
                    this.treeClone = _.cloneDeep(this.channelTree);
                }
                this.changeDate = this.searchBarValue;
                this.cid = val.cid;
                this.findParent([this.treeClone], this.findFatherId);
                this.nodeArr.push(val.cid);
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(val.cid); // tree元素的ref  绑定的node-key
                });
            }
        },
        nodeExpand(data){
            this.cid = data.nid;
        },
        handleCheckChange(data, checked) {
            if (!checked) {
                delete this.noStandardObj[data.nid];
                this.getNoStandardNum();
            }
            // 取消选择多于 4 个的后面的值 这个是为了在 setCheckedKeys 时, 第四个以后的都会取消选择
            if (!checked && this.cancelKey && data.nid === this.cancelKey) {
                const index = _.findIndex(this.cidObjArr, item => item.nid === data.nid);
                if (index >= 0) {
                    this.cidObjArr.splice(index, 1);
                }
                return;
            }
            if (checked) { // 如果选中
                if (!this.searchBarValue.sDate || !this.searchBarValue.eDate) {
                    this.cancelKey = data.nid;
                    const checkKeys = this.cidObjArr.map(i => i.nid);
                    this.$refs.tree.setCheckedKeys(checkKeys);
                    this.error('请选择日期');
                    return;
                }
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
                    if (!this.isFirstCheck || !this.initCheckKeys.includes(data.nid)) {
                        this.cid = data.nid;
                    }
                    if (data.hasData) {
                        if (data.children) {
                            this.noStandardObj[data.nid] = 0;
                            for (let i of data.children) {
                                if (!this.calculatePercent(i.real_total,i.target_total).largerThanOne) {
                                    this.noStandardObj[data.nid] ++;
                                    this.getNoStandardNum();
                                }
                            }
                        }
                    }
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
        warn (msg) {
            this.$message({
                message: msg,
                type: 'warning'
            });
        },
        clickIndex (idx) {
            this.index0 = idx;
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
