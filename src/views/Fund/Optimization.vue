<template>
    <div class="optimization">
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
                        <el-date-picker
                            v-model="form.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            align="right">
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
            <el-col :span="4" class="tree_container">
                <div class="title">毛利目标达成率</div>
                <div class="company">
                    <span class="left">{{tree.data.name}}</span>
                    <span class="right">{{calculatePercent(tree.data.real_total, tree.data.target_total).percent + '%'}}</span>
                </div>
                <!-- 有多个tree -->
                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" show-checkbox
  @check-change="handleCheckChange">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="label">{{ data.name }}</span>
                        <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
                        <div :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"></div>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="19" class="overflow">
                <Card>
                    <el-row :gutter="10">
                        <template v-for="i in 4">
                            <el-col :span="12" :key="i">
                                <el-table :data="tableData2" size="mini" :span-method="arraySpanMethod2">
                                    <el-table-column :label="time">
                                        <el-table-column prop="a" label="影响因素"></el-table-column>
                                        <el-table-column prop="b" label="应用策略"></el-table-column>
                                        <el-table-column prop="c" label="评选结果"></el-table-column>
                                        <el-table-column prop="d" label="环比增长率">
                                            <template slot-scope="scope">
                                                <img v-if="largerThanZero(scope.row.d)" src="../../assets/opt1.png" alt="">
                                                <img v-if="lessThanZero(scope.row.d)" src="../../assets/opt2.png" alt="">
                                                <span style="margin-left: 10px">{{ scope.row.d + '%' }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </template>
                    </el-row>
                    
                </Card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import _ from 'lodash';
import Card from '../../components/Card';
// 组织对比分析和平均值分析
import ConOrgComparisonAverage from '../../components/ConOrgComparisonAverage';
import ConOrgComparisonAverageBig from '../../components/ConOrgComparisonAverageBig';

import mockPieData from './mock/pieData.js';
import mockComparisonAverageData from './mock/comparisonAverageData.js';
import tree from './mock/productTreeData.js';

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
                unit: 'day',
                time: [],
                search: ''
            },
            tree: tree,
            treeData: tree.data.children,
            defaultProps: TREE_PROPS,
            time: '7.30 - 8.05',
            tableData2: [{
                a: '采购',
                b: '-',
                c: '优',
                d: '30'
            },{
                a: '供应商',
                b: '-',
                c: '-',
                d: '-'
            }, {
                a: '包装',
                b: '精简包装',
                c: '-',
                d: '-'
            },{
                a: '流量',
                b: '-',
                c: '中',
                d: '-10'
            },{
                a: '转化率',
                b: '-',
                c: '-',
                d: '-'
            }, {
                a: '客单价',
                b: '促进多件购买',
                c: '',
                d: 'v'
            },{
                a: '-',
                b: '-',
                c: '-',
                d: '-'
            },{
                a: '-',
                b: '-',
                c: '-',
                d: '-'
            }, {
                a: '-',
                b: '-',
                c: '-',
                d: '-'
            }],
            pieData: mockPieData(),
            comparisonAverageData: mockComparisonAverageData(),
            index0: 0
        }
    },
    watch: {
        form: {
            handler: function(val, oldVal) {
            },
            deep: true
        }
    },
    methods: {
        largerThanZero(val) {
            return val && _.isNumber(parseFloat(val)) && parseFloat(val) > 0;
        },
        lessThanZero(val) {
            return val && _.isNumber(parseFloat(val)) && parseFloat(val) < 0;
        },
        arraySpanMethod2({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 2 || columnIndex === 3) {
                if (rowIndex % 3 === 0) {
                    return [3, 1]
                } else {
                    return [0, 0]
                }
            }
        },
      handleNodeClick(data) {
      },
      handleCheckChange(data, checked, indeterminate) {
          console.log(data, checked, indeterminate)
      },
      clickIndex(i ,idx) {
          this[`index${i}`] = idx;
      },
      calculatePercent(a, b) {
        if (b > 0) {
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
@import '../Product/style/optimization.scss'
</style>

