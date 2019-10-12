<template>
  <div class="ConOrgComparisonAverage-container">
    <div
      class="ConOrgComparisonAverage echart"
      :id="`ConOrgComparisonAverage-${id}`" />
    <div class="detail">{{ title }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
const MAIN_SUBJECT = ['ITO', 'ROI', 'SKU', 'PER', 'SHP', 'RY', 'POR', 'NIR', 'CTR', 'GR', 'GPM', 'CGR', 'QPR', 'PS','FAO', 'LA','PA','PO','PT','DN','DAR','PSR','CP','CS','DR','IN','RMIN','CIN','OIN','SIN','RGIN','PGIN'];
import { formatNumber, formatTimeLabel } from 'utils/common';
export default {
    props: {
        id: String,
        data: Object,
        title: String,
        index: Number,
        unit: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            debounce: null,
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`ConOrgComparisonAverage-${this.id}`));
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
    },
    methods: {
        calculateToShow(val) {
            const { subject } = this.data;
            if (_.includes(MAIN_SUBJECT, subject)) { // ROI投入产出比需要,ITO库存周转率不需要单位
                if (val && val >= 10000) {
                    return (val / 10000) + 'w';
                } else {
                    return val;
                }
            } else {
                let tenThousand = parseInt(val / 10000);
                if (tenThousand / 10000 >= 1) {
                    return parseInt(tenThousand / 10000) + '亿';
                } else if (tenThousand >= 1 || tenThousand <= -1){
                    return parseInt(val / 10000) + 'w';
                } else {
                    return parseInt(val);
                }
            }
        },
        renderChart(data) {
            const { series, timeLabels, subject, nodes } = data;
            const seriesClone = _.cloneDeep(series);
            let _this = this;
            for(let i = 0;i < seriesClone.length; i++) {
                if (_.includes(MAIN_SUBJECT, subject)) {
                    _.forEach(seriesClone[i], (v,k) => {
                        seriesClone[i][k] = v;
                    });
                } else {
                    _.forEach(seriesClone[i], (v,k) => {
                        seriesClone[i][k] = parseInt(v/100);
                    });
                }
            }
            const options = {
                color: ['#01AFA0','#6C8C97', '#9D6046', '#5A5042', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                grid: {
                    left: 20,
                    right: 40,
                    bottom: 0,
                    top: 72,
                    containLabel: true
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : { show: true },
                        dataView : { show: true, readOnly: false },
                        magicType : { show: true, type: ['line', 'bar'] },
                        restore : { show: true },
                        saveAsImage : { show: true }
                    },
                    right: 30,
                },
                legend: {
                    type: 'scroll',
                    left: 'right',
                    top: '0%',
                    padding: [43,30,0,0],
                    data: nodes
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params){
                        let str = params[0].name + "<br/>";
                        for (let i of params) {
                            str += i.marker + i.seriesName + " : " + formatNumber(i.value) + _this.unit + "<br/>";
                        }
                        return str;
                    },
                },
                xAxis: {
                    type: 'category',
                    name: '日期',
                    nameTextStyle: {
                        color: "#000",
                    },
                    boundaryGap: false,
                    data: timeLabels,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "#000",
                        formatter: function (value) {
                            return formatTimeLabel(value);
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            type: "dotted",
                            color: "#DCDCDC"
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function (val) {
                            return _this.calculateToShow(val);
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: "dotted",
                            color: "#DCDCDC"
                        }
                    }
                },
                series: []
            };
            for (let i = 0; i < seriesClone.length; i++) {
                let type = 'solid';
                if (i == seriesClone.length-1) {
                    type = 'dashed';
                }
                options.series.push({
                    name: this.data.nodes[i],
                    type: 'line',
                    stack: i,
                    symbolSize: 8,
                    itemStyle: {
                        color: type == 'dashed' ? "#F6606A" : ""
                    },
                    data: seriesClone[i],
                    lineStyle: {
                        type: type
                    }
                });
            }
            this.chart.setOption(options,true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .ConOrgComparisonAverage-container {
        width: 100%;
        .ConOrgComparisonAverage {
            width: 100%;
            height: 500px;
            margin: 0 auto;
        }
        .detail {
            text-align: center;
            color: #5e5e5e;
            font-weight: 500;
            font-size: 15px;
            padding: 10px;
        }
    }
</style>
