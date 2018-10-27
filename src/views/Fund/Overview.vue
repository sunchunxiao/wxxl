<template>
  <div class="overview">
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
          <span class="left">{{ fundTree.name }}</span>
          <span class="right">{{ calculatePercent(fundTree.real_total, fundTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="fundTree.children" 
          :props="defaultProps" 
          :highlight-current="true" 
          @node-click="handleNodeClick">
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
        class="overflow">
        <el-row v-loading="loading">
          <Card>
            <el-row class="card-title">目标达成情况总览</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in fundprogressArr">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(0 ,index)">
                    <ProTargetAchievement 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                v-if="fundprogressArr.length > 0" 
                class="border-left">
                <ProTargetAchievementBig 
                  :id="'select'" 
                  :data="fundprogressArr[index0]"/>
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
              <el-col :span="16">
                <template v-for="(item, index) in pieData">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(1 ,index)">
                    <ProTargetActualDiffTrend 
                      :id="`${index}`" 
                      :data="trendData[index]" 
                      :title="pieData[index].text"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProTargetActualDiffTrendBig 
                  id="ProTargetActualDiffTrendBig" 
                  :data="trendData[index1]" 
                  title="毛利润额"/>
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">同比环比趋势分析</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in averageData">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(2 ,index)">
                    <ProYearOnYearTrend 
                      :id="`${index}`" 
                      :data="trendData[index]" 
                      :title="pieData[index].text"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProYearOnYearTrendBig 
                  id="ProYearOnYearTrendBig" 
                  :data="trendData[index2]" 
                  title="毛利润额"/>
              </el-col>
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
                <template v-for="(item, index) in averageData">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProportionalStructureAverageComparisonBig 
                  id="ProportionalStructureAverageComparisonBig" 
                  :data="averageData[index3]"/>
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
                  :data="heatmapData"/>
              </el-col>
              <el-col :span="10">
                <div class="stragety">
                  <div class="stragety-title">智能策略</div>
                  <div class="stragety-box">
                    <div class="stragety-selected-title">{{ stragetyTitle }}</div>
                    <el-checkbox-group v-model="stragetyCheckList">
                      <el-checkbox 
                        v-for="item in stragety" 
                        :key="item" 
                        :label="item"/>
                    </el-checkbox-group>
                    <el-button 
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
    import moment from 'moment';
    import Card from '../../components/Card';
    // 目标达成情况总览
    import ProTargetAchievement from '../../components/ProTargetAchievement';
    import ProTargetAchievementBig from '../../components/ProTargetAchievementBig';
    // 目标-实际-差异趋势分析
    import ProTargetActualDiffTrend from '../../components/TrendDifffalse';
    import ProTargetActualDiffTrendBig from '../../components/ProTargetActualDiffTrendBig';
    // 同比环比趋势分析
    import ProYearOnYearTrend from '../../components/ProYearOnYearTrend';
    import ProYearOnYearTrendBig from '../../components/ProYearOnYearTrendBig';
    // 比例结构与平均值对比分析
    import ProportionalStructureAverageComparison from '../../components/ProportionalStructureAverageComparison';
    import ProportionalStructureAverageComparisonBig from '../../components/ProportionalStructureAverageComparisonBig';
    // 智能评选和智能策略
    import IntelligentSelection from '../../components/IntelligentSelection';

    // tree
    import tree from './mock/productTreeData.js';
    // mock
    import mockPieData from './mock/pieData.js';
    import mockTrendData from './mock/trendData.js';
    import mockAverageData from './mock/averageData.js';
    import mockHeatmapData from './mock/heatmapData.js';

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
            ProYearOnYearTrend,
            ProYearOnYearTrendBig,
            ProportionalStructureAverageComparison,
            ProportionalStructureAverageComparisonBig,
            IntelligentSelection,
            ProTargetAchievement,
            ProTargetAchievementBig,
            ProTargetActualDiffTrend,
            ProTargetActualDiffTrendBig
        },
        data() {
            return {
                form: {
                    pt: '日',
                    date: [],
                    search: '',
                    subject: 'S', // S: 销售额 P: 利润额
                    version:'0'
                },
                cid:1,
                loading: false,
                // tree
                tree: tree,
                treeData: tree.data.children,
                defaultProps: TREE_PROPS,
                // index
                index0: 0,
                index1: 0,
                index2: 0,
                index3: 0,
                // mockData
                pieData: mockPieData(),
                trendData: mockTrendData(),
                averageData: mockAverageData(),
                heatmapData: mockHeatmapData(),
                // stragety
                stragetyCheckList: [],
                stragetyTitle: '',
                stragety: [],
                type:3
            };
        },
        computed: {
            ...mapGetters(['fundTree','fundprogressArr']),
            hasTree() {
                return !_.isEmpty(this.fundTree);
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
				// this.getStructure1();
				// this.getStructure2();
				// this.getRank();
			}
        },
        mounted() {
            if(!this.hasTree) {
                this.getTree();
            }
            this.initFormDataFromUrl();
//          console.log(this.fundTree)
        },
        methods: {
            getTree() {
                const params = {
                    pt: this.form.pt,
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                    version: this.form.version
                };
                API.GetFundTree(params).then(res => {
//                  console.log(res.tree)
                    this.$store.dispatch('SaveFundTree', res.tree);
                });
            },
            getProgress() {
				const params = {
					pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version
				};
				API.GetFundProgress(params).then(res => {
					this.$store.dispatch('SaveFundProgressData', res.data);
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});

						this.$store.dispatch('SaveOrgTrendArr', resultList);
					});
				});
            },
            getTrend(subject) {
				const params = {
					cid: this.cid,
					pt: this.form.pt,
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version
				};
				return API.GetFundTrend(params);
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
                            eDate: '2018-06-01',
                            // 先写死个时间
                            // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                            // eDate: moment().format('YYYY-MM-DD'),
                        };
                    }
                } else {
                    return {
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
                return {
                    sDate: date[0] || '',
                    eDate: date[1] || '',
                };
            },
            initFormDataFromUrl() {
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
				this.form = { ...this.form,
					...formData
                };
                
			},
            handleNodeClick(data) {
				this.type = data.type;
				if (data.children != undefined) {
					this.cid = data.cid;
					this.loading = true;
					
					setTimeout(() => {
						this.loading = false;
					}, 1000);
				}

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
            clickIndex(i, idx) {
                this[`index${i}`] = idx;
            },
            showStragety(data) {
                const {
                    brand,
                    name,
                    rank
                } = data;
                this.stragetyTitle = `${brand} - ${name} - ${rank}`;
                this.stragety = data.stragety;
            }
        }
    };
</script>

<style lang="scss">
    .overview {
        min-width: 1024px;
        height: 100%;
        .el-date-editor.el-range-editor {
            width: 300px;
        }
        .content_row {
            height: calc(100% - 48px);
            overflow-y: scroll;
            overflow: hidden;
            margin: 0!important;
            .title {
                margin: 18px 20px 18px 0;
                text-align: right;
                color: #747474
            }
            .company {
                display: flex;
                justify-content: space-between;
                margin-bottom: 24px;
                .left {
                    margin-left: 15px;
                    font-weight: bold;
                    color: #338cb6;
                }
                .right {
                    margin-right: 20px;
                    font-weight: bold;
                    color: #c13633;
                }
            }
            .tree_container {
                height: 100%;
                min-width: 200px;
                // margin-right: 20px;
                padding-bottom: 18px;
                overflow-y: auto;
                border: 1px solid #eee;
                border-radius: 5px;
                background: #fff;
            }
        }
        .el-tree {
            .custom-tree-node {
                width: 100%;
                display: flex;
                justify-content: space-between;
                .percent {
                    margin-right: 20px;
                }
                .progress {
                    display: none;
                    position: absolute;
                    width: 50%;
                    height: 26px;
                    left: -5%;
                    top: 0;
                    border-radius: 15px;
                    background: #318cb8;
                    z-index: -1;
                }
                .border-radius0 {
                    border-radius: 0;
                }
                .red {
                    color: #c13633;
                }
                .blue {
                    color: #26a6d7;
                }
            }
            .el-tree-node__content {
                position: relative;
                overflow: hidden;
                z-index: 1;
                &:hover {
                    background-color: #eee;
                    .label {
                        color: #fff;
                        line-height: 20px;
                    }
                    .percent {
                        font-size: 20px;
                    }
                    .progress {
                        display: block;
                    }
                }
            }
            .el-tree-node__content>.el-tree-node__expand-icon {
                margin: 0 5px 0 15px;
                padding: 2px;
                border: 1px solid #fff;
                border-radius: 50%;
                background: #338cb6;
                color: #fff;
            }
            >.el-tree-node {
                padding: 20px 0;
                &:before {
                    content: '';
                    display: block;
                    width: 90%;
                    height: 1px;
                    margin: 0 auto;
                    position: relative;
                    bottom: 20px;
                    background-color: #c9c9c9;
                }
                >.el-tree-node__content {
                    >.custom-tree-node {
                        font-weight: bold;
                    }
                }
            }
            .el-tree-node__expand-icon.is-leaf {
                visibility: hidden;
            }
        }
        .card-title {
            margin-bottom: 20px;
        }
        .border-left {
            border-left: 2px solid #d8d8d8;
        }
        .margin-top-10 {
            margin-top: 10px;
        }
        .overflow {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .stragety {
            width: 85%;
            margin: 5px auto 0;
            .stragety-title {
                text-align: center;
                margin-bottom: 10px;
                color: #454545;
            }
            .stragety-box {
                border: 2px solid #f6f6f6;
                height: 300px;
                border-radius: 4px;
                padding: 20px 35px;
                position: relative;
                .stragety-selected-title {
                    margin-bottom: 10px;
                }
                .el-checkbox {
                    display: block;
                }
                .el-checkbox+.el-checkbox {
                    margin-left: 0;
                    margin-top: 5px;
                }
                .center {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
</style>
