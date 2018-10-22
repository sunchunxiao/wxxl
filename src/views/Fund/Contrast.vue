<template>
    <div class="contrast">
        <el-row>
            <el-form ref="form" :model="form" label-width="100px" size="mini">
                <el-col :span="5">
                    <el-form-item label="时间单位选择">
                        <el-select v-model="form.unit">
                            <el-option label="日" value="day"></el-option>
                            <el-option label="周" value="week"></el-option>
                            <el-option label="月" value="month"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="时间段选择">
                        <el-date-picker v-model="form.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" align="right">
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
                        <el-button type="primary">go</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row class="content_row" :gutter="20">
            <el-col :span="5" class="tree_container">
                <div class="title">毛利目标达成率</div>
                <div class="company">
                    <span class="left">{{fundTree.name}}</span>
                    <span class="right">{{calculatePercent(fundTree.real_total, fundTree.target_total).percent + '%'}}</span>
                </div>
                <!-- 有多个tree -->
                <el-tree :data="fundTree.children" :props="defaultProps" @node-click="handleNodeClick" show-checkbox @check-change="handleCheckChange">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="label">{{ data.name }}</span>
                    <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
                    <div :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"></div>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="19" class="overflow">
                <el-row>
                    <Card>
                        <el-row class="card-title">组织对比分析和平均值分析</el-row>
                        <el-row>
                            <el-col :span="6">
                                <template v-for="(item, index) in pieData">
                                    <el-col :key="index" :span="12" @click.native="clickIndex(0 ,index)">
                                        <ConOrgComparisonAverage :title="item.text" :id="`${index}`" :data="comparisonAverageData[index]"></ConOrgComparisonAverage>
                                    </el-col>
                                </template>
                            </el-col>
                            <el-col :span="18">
                                <ConOrgComparisonAverageBig :title="pieData[index0].text" :data="comparisonAverageData[index0]" id="ConOrgComparisonAverage" :index="index0"></ConOrgComparisonAverageBig>
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
    import ConOrgComparisonAverage from '../../components/Confalse';
    import ConOrgComparisonAverageBig from '../../components/ConfalseBig';

    import mockPieData from './mock/pieData.js';
    import mockComparisonAverageData from './mock/comparisonAverageData.js';
    import tree from './mock/productTreeData.js';

    import { mapGetters } from 'vuex';
    const TREE_PROPS = {
        children: 'children',
        label: 'name'
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
                    pt: 'day',
                    date: [],
                    search: '',
                    subject: 'S', // S: 销售额 P: 利润额
                    version: '0'
                },
                tree: tree,
                treeData: tree.data.children,
                defaultProps: TREE_PROPS,
                pieData: mockPieData(),
                comparisonAverageData: mockComparisonAverageData(),
                index0: 0
            }
        },
        computed: {
            ...mapGetters(['fundTree']),
            hasTree() {
                return !_.isEmpty(this.fundTree)
            }
        },
        watch: {
            form: {
                handler: function(val, oldVal) {},
                deep: true
            }
        },
        mounted() {
            if(!this.hasTree) {
                this.getTree()
            }
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
                    console.log(res.tree)
                    this.$store.dispatch('SaveFundTree', res.tree);
                });
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
            getDateObj() {
                const {
                    date
                } = this.form;
                return {
                    sDate: date[0] || '',
                    eDate: date[1] || '',
                }
            },
            handleNodeClick(data) {
                console.log(data)
            },
            handleCheckChange(data, checked, indeterminate) {
                //        console.log(data, checked, indeterminate)
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
    }
</script>

<style lang="scss">
    @import '../Product/style/contrast.scss';
</style>