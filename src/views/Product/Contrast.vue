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
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ productTree.name }}</span>
          <span class="right">{{ calculatePercent(productTree.real_total, productTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="productTree.children" 
          ref="tree" 
          check-strictly
          node-key="cid" 
          :props="defaultProps" 
          @node-click="handleNodeClick" 
          show-checkbox 
          @check-change="handleCheckChange" 
          :default-checked-keys="setCheckedKeys">
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
        <el-row v-loading="loading">
          <Card>
            <el-row class="card-title">产品对比分析和平均值分析</el-row>
            <el-row>
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
                :span="18" 
                v-if="compareArr.length > 0">
                <ConOrgComparisonAverageBig 
                  :title="pieData[index0].text" 
                  :data="compareArr[index0]" 
                  id="ConOrgComparisonAverage" 
                  :index="index0"/>
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
    import SearchBar from 'components/SearchBar';
    import Card from '../../components/Card';
    // 组织对比分析和平均值分析
    import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
    import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';

    import mockPieData from './mock/pieData.js';
    import mockComparisonAverageData from './mock/comparisonAverageData.js';
    import tree from './mock/productTreeData.js';
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
                    pt: '日',
                    date: [],
                    search: '',
                    subject: 'S', // S: 销售额 P: 利润额
                    version: '0'
                },
                cid: 1,
                loading: false,
                tree: tree,
                treeData: tree.data.children,
                defaultProps: TREE_PROPS,
                pieData: mockPieData(),
                comparisonAverageData: mockComparisonAverageData(),
                index0: 0,
                series: [],
                setCheckedKeys: [],
                cidArr:[],
                id:[10,20,30],
                val:{},
                post:1
            };
        },
        computed: {
            ...mapGetters(['productTree', 'progressArr', 'compareArr' ]),
            hasTree() {
                return !_.isEmpty(this.productTree);
            }
        },
        watch: {
            form: {
                handler: function() {},
                deep: true
            },
            cid: function() {
                // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
                // 暂时先在这里做
                this.getProgress();
            }
        },
        
        mounted() {
            //          console.log(this.hasTree)
            if(!this.hasTree) {
                this.getTree();
            }
            this.getProgress();
        },
        methods: {
            getTree() {
                const params = {
                    // pt: this.form.pt,
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                };
                API.GetProductTree(params).then(res => {
                    this.cidArr = [];
                    let data = res.tree.children;
                   
                    for(let i=0;i<3;i++) {
                        this.cidArr.push(data[i].cid);
                    }
                    // this.$refs.tree.setCheckedKeys(this.cidArr);
                    this.$store.dispatch('SaveProductTree', res.tree);
                });
            },
            getProgress() {
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
                        this.$store.dispatch('SaveCompareArr', resultList);
                    });
                });
            },
            getTrend(subject) {
                const params = {
                    targets:this.id.join(),
                    ...this.getPeriodByPt(),
                    subject: subject
                };
                return API.GetProductCompare(params);
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
                        pt:'日',
                        sDate: '2018-01-01',
                        eDate: '2018-01-07',
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
                this.loading = true;
                this.val = val;
                if(val.cid!=""){
                    this.cid = val.cid;
                }else{
                    this.getProgress();
                }
                setTimeout(() => {		       
                    this.loading = false;
                }, 1000);
                
            },
            handleNodeClick(data) {
                this.$refs.child.parentMsg(this.post);
                if(data.children != undefined) {
                    this.cid = data.cid;
                    this.loading = true;
                   
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }

            },
            handleCheckChange() {
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
                }
                return {};
            },
        }
    };
</script>

<style lang="scss">
    @import './style/contrast.scss';
</style>
