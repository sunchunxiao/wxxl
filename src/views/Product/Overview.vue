<template>
    <div class="overview">
        <el-row>
            <el-form ref="form" :model="form" label-width="100px" size="mini">
                <el-col :span="5">
                    <el-form-item label="时间单位选择">
                        <el-select v-model="form.pt" @change="select">
                            <el-option label="日" value="日"></el-option>
                            <el-option label="周" value="周"></el-option>
                            <el-option label="月" value="月"></el-option>
                            <el-option label="季" value="季"></el-option>
                            <el-option label="年" value="年"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="时间段选择">
                        <el-date-picker v-model="form.date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="精确搜索">
                        <el-input v-model="form.search" placeholder="产品编号/产品名称">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button @click="go" type="primary">go</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row class="content_row" :gutter="20">
            <el-col :span="5" class="tree_container">
                <div v-if="hasTree">
                    <div class="title">毛利目标达成率</div>
                    <div class="company">
                        <span class="left">{{productTree.name}}</span>
                        <span class="right">{{calculatePercent(productTree.real_total, productTree.target_total).percent + '%'}}</span>
                    </div>
                </div>
                <!-- 有多个tree -->
                <el-tree :data="productTree.children" :props="defaultProps" :highlight-current="true" @node-click="handleNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="label">{{ data.name }}</span>
                    <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
                    <div :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"></div>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="19" class="overflow">
                <el-row v-loading="loading">
                    <Card>
                        <el-row class="card-title">目标达成情况总览</el-row>
                        <el-row>
                            <el-col :span="16">
                                <template v-for="(item, index) in progressArr">
                                    <el-col :key="index" :span="6" @click.native="clickIndex(0 ,index)">
                                        <ProTargetAchievement :id="`${index}`" :data="item"></ProTargetAchievement>
                                    </el-col>
                                </template>
                            </el-col>
                            <el-col v-if="progressArr.length > 0" :span="8" class="border-left">
                                <ProTargetAchievementBig :id="'select'" :data="progressArr[index0]"></ProTargetAchievementBig>
                            </el-col>
                        </el-row>
                    </Card>
                </el-row>
                <el-row v-loading="loading" class="margin-top-10">
                    <Card>
                        <el-row class="card-title">目标-实际-差异趋势分析</el-row>
                        <el-row>
                            <template v-for="(item, index) in trendArr">
                                <el-col :key="index" :span="12" @click.native="clickIndex(1 ,index)">
                                    <ProTargetActualDiffTrend :id="`${index}`" :data="item"></ProTargetActualDiffTrend>
                                </el-col>
                            </template>
                        </el-row>
                    </Card>
                </el-row>
                <el-row v-loading="loading" class="margin-top-10">
                    <Card>
                        <el-row class="card-title">同比环比趋势分析</el-row>
                        <el-row>
                            <template v-for="(item, index) in trendArr">
                                <el-col :key="index" :span="12" @click.native="clickIndex(2 ,index)">
                                    <ProYearOnYearTrend :id="`${index}`" :data="item"></ProYearOnYearTrend>
                                </el-col>
                            </template>
                        </el-row>
                    </Card>
                </el-row>
                <el-row v-loading="loading" class="margin-top-10">
                    <Card>
                        <el-row class="card-title">比例结构与平均值对比分析</el-row>
                        <el-row>
                            <el-col :span="16">
                                <template v-for="(item, index) in structureArr">
                                    <el-col :key="index" :span="6" @click.native="clickIndex(3 ,index)">
                                        <ProportionalStructureAverageComparison :id="`${index}`" :data="item"></ProportionalStructureAverageComparison>
                                    </el-col>
                                </template>
                            </el-col>
                            <el-col :span="8" class="border-left">
                                <ProportionalStructureAverageComparisonBig v-if="structureArr.length>0" id="ProportionalStructureAverageComparisonBig" :data="structureArr[index3]"></ProportionalStructureAverageComparisonBig>
                            </el-col>
                        </el-row>
                    </Card>
                </el-row>
                <el-row v-loading="loading" class="margin-top-10">
                    <Card>
                        <el-row class="card-title">智能评选和智能策略</el-row>
                        <el-row>
                            <el-col :span="14">
                                <IntelligentSelection id="rank" v-on:showStragety="showStragety" :data="rankArr"></IntelligentSelection>
                            </el-col>
                            <el-col :span="10">
                                <div class="stragety">
                                    <div class="stragety-title">智能策略</div>
                                    <div class="stragety-box">
                                        <div class="stragety-selected-title">{{stragetyTitle}}</div>
                                        <el-checkbox-group v-model="stragetyCheckList">
                                            <el-checkbox v-for="item in stragety" :key="item" :label="item"></el-checkbox>
                                        </el-checkbox-group>
                                        <el-button type="primary" class="center">确 认</el-button>
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
    import moment from 'moment';
    // 目标达成情况总览
    import ProTargetAchievement from 'components/ProTargetAchievement';
    import ProTargetAchievementBig from 'components/ProTargetAchievementBig';
    // 目标-实际-差异趋势分析
    import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
    // 同比环比趋势分析
    import ProYearOnYearTrend from 'components/ProYearOnYearTrend';
    // 比例结构与平均值对比分析
    import ProportionalStructureAverageComparison from 'components/ProportionalStructureAverageComparison';
    import ProportionalStructureAverageComparisonBig from 'components/ProportionalStructureAverageComparisonBig';
    // 智能评选和智能策略
    import IntelligentSelection from 'components/IntelligentSelection';

    // mock
    import mockPieData from './mock/pieData.js';
    import mockAverageData from './mock/averageData.js';

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
            ProportionalStructureAverageComparison,
            ProportionalStructureAverageComparisonBig,
            IntelligentSelection,
            ProTargetAchievement,
            ProTargetAchievementBig,
            ProTargetActualDiffTrend,
        },
        data() {
            return {
                form: {
                    pt: '', // 周期类型
                    date: [], // date
                    search: '', // 暂时没有接口 先这样
                    subject: 'S', // S: 销售额 P: 利润额
                },
                cid: 1,
                defaultProps: TREE_PROPS,
                loading: false,
                // index
                index0: 0,
                index1: 0,
                index2: 0,
                index3: 0,
                // mockData
                pieData: mockPieData(),
                averageData: mockAverageData(),
                // stragety
                stragetyCheckList: [],
                stragetyTitle: '',
                stragety: []
            }
        },
        computed: {
            ...mapGetters(['productTree', 'progressArr', 'trendArr', 'rankArr', 'structureArr']),
            hasTree() {
                return !_.isEmpty(this.productTree)
            }
        },
        mounted() {
            this.initFormDataFromUrl();
            if(!this.hasTree) {
                this.getTree()
            }
        },
        watch: {
            // form: [
            //     {
            //         handler: function() {
            //             this.getTree();
            //         },
            //         deep: true,
            //     },
            //     {
            //         handler: function(val, oldVal) {
            //             console.log(val, oldVal);
            //             this.getProgress();
            //         },
            //         deep: true,
            //     }
            // ],
            cid: function(val, oldVal) {
                // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
                // 暂时先在这里做
                this.getProgress();
                this.getStructure();
                this.getRank();
            }
        },
        methods: {
            select() {
                //  		console.log(this.form.pt)
            },
            initFormDataFromUrl() {
                const {
                    pt = '月', sDate = '', eDate = '', subject = 'S', cid = '1',
                } = this.$route.query;
                let formData = {
                    pt: pt,
                    subject: subject,
                };
                if(moment(sDate).isValid() && moment(eDate).isValid()) {
                    formData.date = [sDate, eDate];
                }
                this.cid = cid;
                this.form = { ...this.form,
                    ...formData
                };
            },
            getTree() {
                const params = {
                    pt: this.form.pt,
                    subject: this.form.subject,
                    ...this.getPeriodByPt(),
                };
                API.GetProductTree(params).then(res => {
                    this.$store.dispatch('SaveProductTree', res.tree);
                });
            },
            getProgress() {
                //              console.log(this.cid)
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
                });
            },
            getTrend(subject) {
                const params = {
                    cid: this.cid,
                    pt: this.form.pt,
                    ...this.getPeriodByPt(),
                    subject: subject
                };
                return API.GetProductTrend(params);
            },
            getStructure() {
                const params = {
                    cid: this.cid,
                    ...this.getPeriodByPt(),
                };
                API.GetProductStructure(params).then(res => {
                    //              console.log(res.data);
                    this.$store.dispatch('SaveStructureArr', res.data);
                });
            },
            getRank() {
                const params = {
                    cid: this.cid,
                    pt: this.form.pt,
                    ...this.getPeriodByPt(),
                };
                API.GetProductRank(params).then(res => {
                    //              console.log(res.data);
                    this.$store.dispatch('SaveRankArr', res.data);
                });
            },
            getDateObj() {
                const {
                    date
                } = this.form;
                return {
                    sDate: date[0] || '',
                    eDate: date[1] || '',
                }
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
                        }
                    } else {
                        return {
                            sDate: '2018-01-01',
                            eDate: '2018-06-01',
                            // 先写死个时间
                            // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                            // eDate: moment().format('YYYY-MM-DD'),
                        }
                    }
                } else {
                    return {
                        sDate: '2018-01-01',
                        eDate: '2018-06-01',
                        // 先写死个时间
                        // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                        // eDate: moment().format('YYYY-MM-DD'),
                    }
                }
            },
            go() {

            },
            handleNodeClick(data) {
                if(data.children != undefined) {
                    this.cid = data.cid;
                    this.loading = true;
                    //                  setTimeout(() => {
                    //                      this.getProgress();
                    //                      this.getStructure();
                    //                      this.getRank();
                    //                  }, 300);
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
    }
</script>

<style lang="scss">
    @import './style/overview.scss'
</style>