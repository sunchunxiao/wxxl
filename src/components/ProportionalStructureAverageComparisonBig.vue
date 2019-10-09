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
// const SUBJECT = ['ROI','POR','ITO','RY'];
const MAIN_SUBJECT = ['ITO', 'ROI', 'SKU', 'PER', 'SHP', 'RY', 'POR', 'NIR', 'CTR', 'GR', 'GPM', 'CGR', 'QPR', 'PS','FAO', 'LA','PA','PO','PT','DN','DAR','PSR','CP','CS','DR'];
const REVERSE_TARGET = ['C', 'SA','DR']; // C成本 SA库存额 DR残品率是反向指标
export default {
    props: {
        id: String,
        data: Object,
        height: {
            type: String,
            default: "415px"
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
                if ((this.data.nodes.length * 45) > parseInt(this.height)) {
                    return this.data.nodes.length * 45 + "px";
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
        let _this = this;
        this.chart.on('click', function(params) {
            const select_id = params.seriesId.split(",");
            const id = select_id[params.dataIndex];
            _this.$emit('id', id);
        });
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
            if (_.includes(MAIN_SUBJECT, subject)) {
                if (val && val >= 10000) {
                    return (val / 10000).toFixed(2) + 'w';
                } else {
                    return val;
                }
            } else {
                let tenThousand = (val / 10000 / 100).toFixed(2);
                if (tenThousand && tenThousand >= 1) {
                    return tenThousand + 'w';
                } else {
                    return (val / 100).toFixed(2);
                }
            }
        },
        renderChart(nodes) {
            let _this = this;
            const {
                ids,
                subject,
                nodes: pData
            } = nodes;
            // console.log(pData);
            const percentArr = [];
            const yAxis = [];
            _this.color = nodes["28nodes"];
            const average = nodes.avg;
            for(let i in pData) {
                // percentArr.push({
                //     value:nodes.values[i],
                //     itemStyle: {
                //         barBorderRadius:structureRadius(nodes.values[i])
                //     }
                // });
                //28结构字体加粗
                let dataIndex = i && pData.indexOf(pData[i]);
                if (_.includes(_this.color,dataIndex)) {
                    yAxis.push({
                        value:pData[i],
                        textStyle: {
                            fontWeight:'bold',
                            fontSize:16
                        }
                    });
                    percentArr.push({
                        value:nodes.values[i],
                        itemStyle: {
                            barBorderRadius: structureRadius(nodes.values[i]),
                            borderWidth: 1,
                            borderColor: 'rgba(197,197,197,0.6)',
                            shadowBlur: 5,
                            shadowColor: 'rgba(120, 0, 0, 0.9)',
                        }
                    });
                } else {
                    yAxis.push({
                        value:pData[i],
                        textStyle: {
                            fontWeight:'normal'
                        }
                    });
                    percentArr.push({
                        value:nodes.values[i],
                        itemStyle: {
                            barBorderRadius: structureRadius(nodes.values[i]),
                        }
                    });
                }
            }
            const options = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'none' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function(params) {
                        let result = [];
                        if (_.includes(MAIN_SUBJECT, subject)) {
                            params.forEach(function (item) {
                                result += item.marker + " " + item.name + " : " + _this.formatNumber(item.value) + _this.unit + "</br>";
                            });
                        } else {
                            params.forEach(function (item) {
                                result += item.marker + " " + item.name + "</br>" +
                                `占比 : ${nodes.total?(item.value / nodes.total * 100).toFixed(2):0}%` + "</br>" +
                                `&nbsp;&nbsp;&nbsp;额 : ${_this.formatNumber(Math.round((item.value / 100))) + _this.unit}`;
                            });
                        }
                        return result;
                    },
                    position: function (point) {
                        return ["50%", point[1] + 25];
                    }
                },
                grid: {
                    right: 50,
                    bottom: 5,
                    top: 20,
                    left: "20%",
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
                    data: yAxis,
                    axisLabel: {
                        show: true,
                        fontSize: 14,
                        formatter: function(value) {
                            return labelNewline(6, value);
                        },
                    }
                },
                series: [{
                    type: 'bar',
                    barMaxWidth: 35,
                    itemStyle: {
                        color: function(params) {
                            // #01b8aa 绿色 #F2C811黄色 #FD625E红色
                            let bgColor = "";
                            if (params.value >= average) {
                                if (_.includes(REVERSE_TARGET, subject)) {
                                    bgColor = '#FD625E';
                                } else {
                                    bgColor = '#01b8aa';
                                }
                            } else if(params.value < average && params.value >= (average /2)) {
                                bgColor = '#F2C811';
                            } else if(params.value < (average / 2)) {
                                if (_.includes(REVERSE_TARGET, subject)) {
                                    bgColor = '#01b8aa';
                                } else {
                                    bgColor = '#FD625E';
                                }
                            }
                            return bgColor;
                        }
                    },
                    emphasis: {
                        itemStyle: { }
                    },
                    label: {
                        fontSize: 14,
                        show: true,
                        position: 'insideLeft',
                        color: "#000",
                        formatter: function(params) {
                            if (!params.value || !nodes.display_rate) {
                                return `${ _this.calculateToShow(params.value)}`;
                            } else {
                                if (nodes.total == 0) {//总和为0
                                    return `${params.value}`;
                                } else {
                                    if (_.includes(MAIN_SUBJECT, subject)) {
                                        return `${(params.value / nodes.total * 100).toFixed(2)}%   ${_this.formatNumber(Math.round(params.value))}`;
                                    } else {
                                        return `${(params.value / nodes.total * 100).toFixed(2)}%   ${_this.formatNumber(Math.round(params.value / 100))}`;
                                    }
                                }
                            }
                        },
                    },
                    id: ids,
                    data: percentArr,
                    markLine: {
                        symbol: 'none',
                        name: '平均值',
                        label: {
                            color: "#fd625e",
                            fontSize: 14,
                            formatter:function() {
                                if (average == 0) {
                                    return `平均值${average}`;
                                } else {
                                    return `平均值${_this.calculateToShow(average)}`;
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
            font-weight: 500;
        }
    }
</style>
