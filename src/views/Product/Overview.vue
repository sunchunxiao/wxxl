<template>
    <div class="overview">
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
        <el-row class="content_row">
            <el-col :span="5" class="tree_container">
                <div class="title">毛利目标达成率</div>
                <div class="company">
                    <span class="left">{{tree.data.name}}</span>
                    <span class="right">{{calculatePercent(tree.data.real_total, tree.data.target_total).percent + '%'}}</span>
                </div>
                <!-- 有多个tree -->
                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class="label">{{ data.name }}</span>
                        <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
                        <div :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}" :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"></div>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="18">
                <el-row>
                    <Card>
                        <div id="pie-container"></div>
                    </Card>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Card from '../../components/Card';
import tree from './treeData.js';
import echarts from 'echarts';

const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const PIEDATA = [{
                value: 30,
                goal: 50,
                text: '毛利润额',
            },{
                value: 50,
                goal: 50,
                text: '销售额',
            },{
                value: 100,
                goal: 50,
                text: '产品成本额',
            },{
                value: 120,
                goal: 180,
                text: '产品投入产出比',
            },{
                value: 210,
                goal: 180,
                text: '库存周转率',
            },{
                value: 80,
                goal: 90,
                text: '日销',
            },{
                value: 10,
                goal: 8,
                text: '库存额',
            }];
export default {
    components: {
        Card
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
            pieData: PIEDATA
        }
    },
    watch: {
        form: {
            handler: function(val, oldVal) {
                console.log(val, oldVal);
            },
            deep: true
        }
    },
    mounted () {
        this.pieChart = echarts.init(document.getElementById('pie-container'));
        this.renderPieChart();
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
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
      renderPieChart() {
          const colorMap = { over: '#b12725', below: '#308db9'};
          const colorLeft = '#E0E3E9';
          const options = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'item',
                },
                series: []
            };
            for(let i in this.pieData) {
                const row = Math.floor(i / 4) + 1;
                const col = i % 4 + 1;
                const item = this.pieData[i];
                const value = item.value;
                const goal = item.goal;
                const color = value >= 80 ? colorMap.over : colorMap.below;
                const text = item.text || '';
                const valuePercent = Math.floor(value / goal * 100);
                const valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
                options.series.push({
                    type: 'pie',
                    center: [140 * col, 140 * row],
                    radius: ['56', '60'],
                    hoverAnimation: false,
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                            value: valuePercent,
                            name: '',
                            itemStyle: {
                                normal: {
                                    color: color,
                                }
                            },
                            label: {
                                normal: {
                                    formatter: Math.floor(value / goal * 100) + '%',
                                    textStyle: {
                                        fontSize: 28,
                                        color: '#5e5e5e'
                                    }
                                },
                            }
                        },
                        {
                            value: valueLeft,
                            name: text,
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: colorLeft,
                                }
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: color,
                                    }
                                }
                            }
                        }, {
                            value: 0,
                            name: '',
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: colorLeft,
                                }
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: color,
                                    }
                                }
                            }
                        }, 
                    ]
                });
            }
          this.pieChart.setOption(options);
      }
    }
}
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
            margin-right: 20px;
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
    #pie-container {
        height: 510px;
    }
}
</style>

