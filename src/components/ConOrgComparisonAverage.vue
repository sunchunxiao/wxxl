<template>
  <div class="ConOrgComparisonAverage-container">
    <div
      class="ConOrgComparisonAverage echart"
      :id="`ConOrgComparisonAverage-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
const MAIN_SUBJECT = ['ITO', 'ROI', 'SKU', 'PER', 'SHP', 'RY', 'POR', 'NIR', 'CTR', 'GR', 'GPM', 'CGR', 'QPR', 'PS','FAO', 'LA','PA','PO','PT','DN','DAR','PSR','CP','CS','DR','IN','RMIN','CIN','OIN','SIN','RGIN','PGIN'];
import { formatTimeLabel } from 'utils/common';

export default {
    props: {
        id: String,
        data: Object,
        title: String,
        unit: {
            type: String,
            default: ""
        },
        tooltipScroll: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return{
            time: "",
            timestr: ""
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`ConOrgComparisonAverage-${this.id}`));
        this.renderChart(this.data);
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
                // return val;
                if (val && val >= 10000) {
                    return (val / 10000) + 'w';
                } else {
                    return val;
                }
            } else {
                let tenThousand = parseInt(val / 10000);
                if (tenThousand >= 1 || tenThousand <= -1) {
                    return parseInt(val / 10000) + 'w';
                } else {
                    return parseInt(val);
                }
            }
        },
        renderChart(data) {
            let _this = this;
            const { series,timeLabels, subject } = data;
            const seriesClone = _.cloneDeep(series);
            for (let i = 0;i < seriesClone.length; i++) {
                if (_.includes(MAIN_SUBJECT,subject)) {
                    _.forEach(seriesClone[i], (v,k) => {
                        seriesClone[i][k] = v;
                    });
                } else {
                    _.forEach(seriesClone[i], (v,k) => {
                        seriesClone[i][k] = parseInt(v / 100);
                    });
                }
            }
            const options = {
                color: ['#01AFA0','#6C8C97', '#9D6046', '#5A5042', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                grid: {
                    left: 10,
                    right: 20,
                    bottom: 0,
                    top: 10,
                    containLabel: true
                },
                tooltip: {
                    show: false,
                },
                xAxis: {
                    type: 'category',
                    name: '',
                    boundaryGap: false,
                    data: timeLabels,
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
                    symbol: "none",
                    name: this.data.nodes[i],
                    type: 'line',
                    stack: i,
                    data: seriesClone[i],
                    itemStyle: {
                        color: type == 'dashed' ? "#F6606A" : ""
                    },
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
        // width: 100%;
        .ConOrgComparisonAverage {
            width: 170px;
            height: 140px;
            margin: 0 auto;
        }
        .detail {
            text-align: center;
            color: #5e5e5e;
            font-size: 15px;
            padding: 10px;
        }
    }
</style>
