<template>
  <div class="contrast">
    <el-row>
      <search-bar 
        @search="handleSearch" 
        ref="child"
        url="/product/search"/>
    </el-row>
    <el-row 
      class="content_row" 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container">
        <div>
          <el-button 
            @click="cleanChecked"
            size="mini" 
            class="clean_btn">清空选择</el-button>
        </div>
        <!-- <div 
          @click="cleanChecked"
          size="mini" 
          class="clean_btn">
          <span 
            class="clean_select" >取消全部</span>
        </div> -->
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ productTree.name }}</span>
          <span class="right">{{ calculatePercent(productTree.real_total, productTree.target_total).percent + '%' }}</span>
        </div>
        <el-tree 
          :data="productTree.children" 
          ref="tree" 
          empty-text="正在加载"
          check-strictly
          node-key="cid" 
          :props="defaultProps" 
          show-checkbox 
          @check-change="handleCheckChange">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <span class="label">{{ data.name }}</span>
            <span :class="{ red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" 
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"/>
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="19" 
        class="overflow">
        <Card>
          <el-row class="card-title">产品对比分析和平均值分析</el-row>
          <el-row v-if="compareArr.length > 0">
            <el-col :span="6">
              <template v-for="(item, index) in compareArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(0 ,index)">
                  <ConOrgComparisonAverage 
                    :id="`${index}`" 
                    :data="item"/>
                </el-col>
              </template>
            </el-col>
            <el-col 
              :span="18">
              <ConOrgComparisonAverageBig 
                :title="compareArr[index0].subject_name" 
                :data="compareArr[index0]" 
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import API from './api';
    import SearchBar from 'components/SearchBar';
    import Card from '../../components/Card';
    // 组织对比分析和平均值分析
    import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
    import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';
    import { mapGetters } from 'vuex';

    const TREE_PROPS = {
        children: 'children',
        label: 'name'
    };
    const ROOTCID = 1;
    const SUBJECT = 'S'; // S: 销售额 P: 利润额

    export default {
        components: {
            Card,
            SearchBar,
            ConOrgComparisonAverage,
            ConOrgComparisonAverageBig
        },
        data() {
            return {
                defaultProps: TREE_PROPS,
                index0: 0,
                cidObjArr:[],
                cancelKey: '',
                debounce: null,
            };
        },
        computed: {
            ...mapGetters(['productTree', 'progressArr', 'compareArr' ]),
            hasTree() {
                return !_.isEmpty(this.productTree);
            }
        },
        watch: {
            cidObjArr(val) {
                if (val.length > 0) {
                    this.debounce();
                } else if (val.length === 0) {
                    this.$store.dispatch('ClearCompareArr');
                }
            }
        },
        created() {
            // 防抖函数 减少发请求次数
            this.debounce = _.debounce(this.getCompare, 1000);
        },
        mounted() {
            Promise.all([this.getTree(), this.getProgress()]).then(res => {
                // 树
                const treeData = res[0];
                const children = treeData.tree.children;
                let arr = [];
                for(let i = 0; i < 3; i++) {
                    children[i] && arr.push(children[i]);
                }
                const checkKeys = arr.map(i => i.cid);
                this.$store.dispatch('SaveProductTree', treeData.tree).then(() => {
                    this.$refs.tree.setCheckedKeys(checkKeys);
                });
                // 指标
                const progressData = res[1];
                this.$store.dispatch('SaveProgressData', progressData.data);
            });
        },

        methods: {
            getTree() {
                const params = {
                    subject: SUBJECT,
                    ...this.getPeriodByPt(),
                };
                return API.GetProductTree(params);
            },
            getProgress() {
                const params = {
                    cid: ROOTCID,
                    ...this.getPeriodByPt(),
                };
                return API.GetProductProgress(params);
            },
            getCompare() {
                const promises = _.map(this.progressArr, o => this.getTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = this.progressArr[k].subject;
                        v.subject_name = this.progressArr[k].subject_name;
                    });
                    const cidName = this.cidObjArr.map(o => o.name);
                    // 只有当返回的跟当前选中的一样才更新 store
                    if(resultList[0] && resultList[0].nodes && _.isEqual(cidName, resultList[0].nodes.slice(0, resultList[0].nodes.length - 1))) {
                        this.$store.dispatch('SaveCompareArr', resultList);
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
                return API.GetProductCompare(params);
            },
            getPeriodByPt() {
                // 先写死个时间
                return {
                    pt:'日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-07',
                };
            },
            handleSearch() {
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
    @import './style/contrast.scss';
</style>
