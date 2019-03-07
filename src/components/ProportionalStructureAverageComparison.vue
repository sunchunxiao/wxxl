<template>
  <div class="averagebar-container">
    <div
      class="averagebar echart"
      :style="{height: heightValue}"
      :id="`averagebar-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { formatNumber, labelNewline, structureRadius } from 'utils/common';
const SUBJECT = ['ROI','POR','ITO','RY'];
export default {
    props: {
        id: String,
        data: Object,
        height: {
            type: String,
            default: "180px"
        },
        unit: {
            type: String,
            default: ""
        }
    },
    data(){
        return {
            val: [],
            color: [],
            formatNumber: formatNumber,
            debounce: null,
        };
    },
    computed: {
        heightValue() {
            if (!this.data.nodes) {
                return this.height;
            }
            if (this.height.includes("px")) {
                if ((this.data.nodes.length * 35) > parseInt(this.height)) {
                    return this.data.nodes.length * 35 + "px";
                }
            }
            return this.height;
        }
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`averagebar-${this.id}`));
        this.renderChart(this.data);
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener('resize', this.debounce);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.debounce);
    },
    watch: {
        data: {
            handler: function(val) {
                this.renderChart(val);
            },
            deep: true
        },
        heightValue() {
            this.$nextTick(() => {
                this.renderChart(this.data);
                this.chart.resize();
            });
        },
    },
    methods: {
        //28法则结构
        calculateToShow(val) {
            const { subject } = this.data;
            //日销，投入产出比和库存周转率是显示原值
            if (subject === 'SD') {//日销
                let tenThousand = (val / 10000 / 100).toFixed(2);
                if (tenThousand && tenThousand >= 1) {
                    return tenThousand + 'w';
                } else {
                    return (val / 100).toFixed(2);
                }
            } else if (subject === 'ROI') { //投入产出比
                if (val && val >= 10000) {
                    return (val / 10000).toFixed(2) + 'w';
                } else {
                    return val;
                }
            } else {
                return val;
            }
        },
        renderChart(nodes) {
            let _this = this;
            const {
                subject,
                nodes: pData
            } = nodes;
            const percentArr = [];
            const average = nodes.avg;

            this.color = nodes["28nodes"];
            for (let i in pData) {
                percentArr.push({
                    value:nodes.values[i],
                    itemStyle: {
                        barBorderRadius: structureRadius(nodes.values[i])
                    }
                });
            }
            const options = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'none' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function(params) {
                        let result = [];
                        if (_.includes(SUBJECT, subject)) {
                            params.forEach(function (item) {
                                result += item.marker + " " + item.name + " : " + _this.formatNumber(item.value) + _this.unit + "</br>";
                            });
                        } else {
                            params.forEach(function (item) {
                                result += item.marker + " " + item.name + "</br>" +
                                `占比 : ${(item.value / nodes.total * 100).toFixed(2)}%` + "</br>" +
                                `&nbsp;&nbsp;&nbsp;额 : ${_this.formatNumber(parseInt(item.value / 100)) + _this.unit}`;
                            });
                        }
                        return result;
                    },
                    position: function (point) {
                        return ["50%", point[1] + 25];
                    }
                },
                grid: {
                    left: 30,
                    right: 50,
                    bottom: 5,
                    top: 20,
                    containLabel: true
                },
                xAxis: {
                    inverse: false,
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                },
                yAxis: {
                    z: 3,
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: pData,
                    axisLabel: {
                        show: true,
                        formatter: function(value) {
                            return labelNewline(6, value);
                        }
                    }
                },
                series: [{
                    type: 'bar',
                    barMaxWidth: 25,
                    itemStyle: {
                        color: function(params) {
                            return _this.color[`${params.dataIndex}`] ? '#01b8aa' : '#b3b3b3';
                        },
                    },
                    emphasis: {
                        itemStyle: {
                            color: "#F2C811"
                        }
                    },
                    label: {
                        show: true,
                        position: 'insideLeft',
                        color: "#000",
                        formatter: function(params) {
                            if (!params.value || !nodes.display_rate) {
                                return `${ _this.calculateToShow(params.value)}`;
                            } else {
                                if (nodes.total === 0) {//总和为0
                                    return `${params.value}`;
                                } else {
                                    return `${(params.value / nodes.total * 100).toFixed(2)}%`;
                                }
                            }
                        },
                    },
                    data: percentArr,
                    markLine: {
                        symbol: 'none',
                        name: '平均值',
                        label: {
                            color: "#fd625e",
                            formatter:function() {
                                if ( nodes.display_rate == 0) {
                                    return `平均值${_this.calculateToShow(average)}`;
                                } else {
                                    if (average==0) {
                                        return `平均值${average}`;
                                    } else {
                                        return `平均值${(average / nodes.total*100).toFixed(2)}%`;
                                    }
                                }
                            }
                        },
                        data: [{
                            xAxis: average,
                            itemStyle: {
                                color: '#b12725'
                            }
                        }]
                    },
                }]
            };
            this.chart.setOption(options, true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .averagebar-container {
        .averagebar {
            width: 100%;
            margin: 0 auto;
        }
        .detail {
            text-align: center;
            color: #5e5e5e;
            font-size: 15px;
            padding: 20px;
        }
    }
</style>
