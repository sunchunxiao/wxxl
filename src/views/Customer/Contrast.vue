<template>
  <div class="contrast">
    <el-row>
      <search-bar 
        @search="handleSearch" 
        ref="child"
        url="/cus/search"/>
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
          <span class="left">{{ customerTree.name }}</span>
          <span
            v-if="customerTree.children"
            class="right">{{ calculatePercent(customerTree.real_total, customerTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          ref="tree" 
          node-key="cid" 
          check-strictly
          empty-text="正在加载"
          :data="customerTree.children" 
          :props="defaultProps" 
          :default-expanded-keys="nodeArr"
          show-checkbox 
          @check-change="handleCheckChange">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <el-tooltip 
              class="item" 
              effect="dark" 
              placement="right" > 
              <div slot="content">
                <div class="tooltip_margin">{{ data.name }}</div>
                <div>毛利目标达成率: {{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</div>
              </div>
              <span class="label">
                <span class="label_left">{{ data.name }}</span>
                <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
              </span>
            </el-tooltip>
            
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" 
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"/>
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="19" 
        class="overflow">
        <el-row>
          <Card>
            <el-row class="card-title">组织对比分析和平均值分析</el-row>
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
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col :span="18">
                <ConOrgComparisonAverageBig 
                  v-if="cuscompareArr.length > 0"
                  :title="cuscompareArr[index0].subject_name" 
                  :data="cuscompareArr[index0]" 
                  id="ConOrgComparisonAverage" 
                  :index="index0"/>
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
                    version: '0'
                },
                cid:1,
                defaultProps: TREE_PROPS,
                index0: 0,
                val:{},
				post:1,
                nodeArr:[],
                cidTarget:[10,20,30],
                cidObjArr:[],
                cancelKey: '',
                debounce: null,
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
            }
        },
        created() {
            // 防抖函数 减少发请求次数
            this.debounce = _.debounce(this.getCompare, 1000);
        },
        mounted() {
            if(this.customerTree.children){
                let arr = [];
                for(let i = 0; i < 3; i++) {
                    this.customerTree.children[i] && arr.push(this.customerTree.children[i]);
                }
                const checkKeys = arr.map(i => i.cid);
                this.$refs.tree.setCheckedKeys(checkKeys);
            }else{
               Promise.all([this.getTree(), this.getProgress()]).then(res => {
                // 树
                const treeData = res[0];
                const children = treeData.tree.children;
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
            }
        },
        methods: {
            getTree() {
                const params = {
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                };
                return API.GetCusTree(params);
            },
            getProgress() {
                const params = {
                    cid: 1,
                    ...this.getPeriodByPt(),
                };
                return API.GetCusProgress(params);
            },
            getCompare() {
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
            getPeriodByPt() {
                const {
                    sDate,
                    eDate
                } = this.getDateObj();
                // const {
                //     pt
                // } = this.form;
                // console.log(sDate,eDate);
                if(sDate && eDate) { // 计算时间周期
                    return {
                        pt:this.val.pt,
                        sDate: this.val.sDate,
                        eDate: this.val.eDate,
                    };
                } else {
                    return {
                        pt:'月',
                        sDate: '2018-01-01',
                        eDate: '2018-06-01',
                        // 先写死个时间
                        // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                        // eDate: moment().format('YYYY-MM-DD'),
                    };
                }
            },
            getDateObj() {
                const {
                    date
                } = this.form;
                if(this.val.sDate!=undefined&&this.val.eDate!=undefined){
                        return {
                        sDate: this.val.sDate,
                        eDate: this.val.eDate,
                    };
                }else{
                        return {
                        sDate: date[0] || '',
                        eDate: date[1] || '',
                    };
                }
            },
            handleSearch(val) {
                this.nodeArr = [];
                this.nodeArr.push(val.cid);
                this.loading = true;
                this.val = val;
                if(val.cid!=""){
                    this.cid = val.cid;
                }else{
                    this.getTree();
                    this.getProgress();
                }
                setTimeout(() => {		       
                    this.loading = false;
                }, 1000);
                
            },
            cleanChecked() {
                this.cidObjArr = [];
                this.$refs.tree.setCheckedKeys([]);
            },
            handleCheckChange(data, checked) {
                // 取消选择多于 4 个的后面的值 这个是为了在 setCheckedKeys 时, 第四个以后的都会取消选择
                if(!checked && this.cancelKey && data.cid === this.cancelKey) {
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
                if(b > 0) {
                    const percent = parseInt(a / b * 100);
                    const largerThanOne = (a / b) > 1;
                    return {
                        percent,
                        largerThanOne
                    };
                }else{
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
