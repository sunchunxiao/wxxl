<template>
  <div class="contrast">
    <el-row>
      <el-form 
        ref="form" 
        :model="form" 
        label-width="100px" 
        size="mini">
        <el-col :span="5">
          <el-form-item label="时间单位选择">
            <el-select v-model="form.unit">
              <el-option 
                label="日" 
                value="day"/>
              <el-option 
                label="周" 
                value="week"/>
              <el-option 
                label="月" 
                value="month"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="时间段选择">
            <el-date-picker 
              v-model="form.time" 
              type="datetimerange" 
              range-separator="至" 
              start-placeholder="开始日期" 
              end-placeholder="结束日期" 
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd" 
              align="right"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="精确搜索">
            <el-input 
              v-model="form.search" 
              placeholder="产品编号/产品名称">
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-search"/>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary">go</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row 
      class="content_row" 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container">
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ channelTree.name }}</span>
          <span class="right">{{ calculatePercent(channelTree.real_total, channelTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="channelTree.children" 
          :props="defaultProps" 
          @node-click="handleNodeClick" 
          show-checkbox 
          @check-change="handleCheckChange">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <span class="label">{{ data.name }}</span>
            <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" 
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"/>
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="19"
        v-loading="loading" 
        class="overflow">
        <el-row>
          <Card>
            <el-row class="card-title">组织对比分析和平均值分析</el-row>
            <el-row>
              <el-col :span="6">
                <template v-for="(item, index) in channelCompareArr">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(0 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item.subject_name" 
                      :id="`${index}`" 
                      :data="channelCompareArr[index]"/>
                  </el-col>
                </template>
              </el-col>
              <el-col
                v-if="channelCompareArr.length > 0"
                :span="18">
                <ConOrgComparisonAverageBig 
                  :title="channelCompareArr[index0].subject_name" 
                  :data="channelCompareArr[index0]" 
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
    import Card from '../../components/Card';
    // 组织对比分析和平均值分析
    import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
    import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';

    import mockPieData from './mock/pieData.js';
    import mockComparisonAverageData from './mock/comparisonAverageData.js';
    import tree from './mock/channelData.js';

    import { mapGetters } from 'vuex';
    const TREE_PROPS = {
        children: 'children',
        label: 'name'
    };
    const TIMEPT = {
        '周': 'week',
        '月': 'month',
        '季': 'quarter',
        '年': 'year'
    };

    export default {
        components: {
            Card,
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
                cid:1,
                loading:false,
                tree: tree,
                treeData: tree.data.children,
                defaultProps: TREE_PROPS,
                pieData: mockPieData(),
                comparisonAverageData: mockComparisonAverageData(),
                index0: 0
            };
        },
        computed: {
            ...mapGetters(['channelTree','channelCompareArr']),
            hasTree() {
                return !_.isEmpty(this.channelTree);
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
                //              this.getProgress();
                //              this.getStructure();
                this.getProgress();
            }
        },
        mounted() {
            if(!this.hasTree) {
                this.getTree();
            }
            this.getProgress();
        },
        methods: {
            getTree() {
                const params = {
                    pt: this.form.pt,
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                    version: this.form.version
                };
                API.GetChannelTree(params).then(res => {
                    this.$store.dispatch('SaveChannelTree', res.tree);
                });
            },
             getProgress() {
//              console.log(this.cid)
                const params = {
                    chId: this.cid,
                    ...this.getPeriodByPt(),
                };
                API.GetChannelProgress(params).then(res => {
                    // this.$store.dispatch('SaveChannelProgress', res.data);
                    const promises = _.map(res.data, o => this.getTrend(o.subject));
                    Promise.all(promises).then(resultList => {
                        _.forEach(resultList, (v, k) => {
                            v.subject = res.data[k].subject;
                            v.subject_name = res.data[k].subject_name;
                        });
                        this.$store.dispatch('SaveChannelCompareArr', resultList);
                    });
                });
            },
            getTrend(subject) {
                const params = {
                    nid: this.cid,
                    pt: this.form.pt,
                    ...this.getPeriodByPt(),
                    subject: subject
                };
                return API.GetChannelCompare(params);
            },
            getPeriodByPt() {
                const {
                    sDate,
                    eDate
                } = this.getDateObj();
                const {
                    pt
                } = this.form;
                if(sDate && eDate) { // 计算时间周期
                    if(pt === '日') {
                        return {
                            sDate,
                            eDate
                        };
                    }
                    let unit = TIMEPT[pt];
                    if(unit) {
                        return {
                            sDate: moment(sDate).startOf(unit).format('YYYY-MM-DD'),
                            eDate: moment(eDate).endOf(unit).format('YYYY-MM-DD')
                        };
                    } else {
                        return {
                            sDate: '2018-01-01',
                            eDate: '2018-01-31',
                            // 先写死个时间
                            // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                            // eDate: moment().format('YYYY-MM-DD'),
                        };
                    }
                } else {
                    return {
                        sDate: '2018-01-01',
                        eDate: '2018-01-31',
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
                return {
                    sDate: date[0] || '',
                    eDate: date[1] || '',
                };
            },
           handleNodeClick(data) {
                if(data.children != undefined) {
                    this.cid = data.nid;
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
    @import '../Product/style/contrast.scss';
</style>
