<template>
  <div class="ConOrgComparisonAverage-container">
    <div
      class="ConOrgComparisonAverage"
      :id="`ConOrgComparisonAverage-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
const SUBJECT = ['ROI','ITO','RY'];
export default {
    props: {
        id: String,
        data: Object,
        title: String
    },
    data(){
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

            if (_.includes(SUBJECT, subject)) { // ROI投入产出比需要,ITO库存周转率不需要单位
                return val;
            } else {
                let tenThousand = parseInt(val / 10000);
                if (tenThousand >= 1){
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
            for(let i = 0;i < seriesClone.length; i++) {
                if (_.includes(SUBJECT,subject)){
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
                grid: {
                    left: 0,
                    right: 10,
                    bottom: 0,
                    top: 10,
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    position: function(pos){ // point: 鼠标位置
                        return { left:pos[0], top: pos[1] };
                    },
                },
                xAxis: {
                    type: 'category',
                    name: '日期',
                    boundaryGap: false,
                    data: timeLabels
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: function (val) {
                            return _this.calculateToShow(val);
                        }
                    }
                },
                series: []
            };
            for(let i = 0; i < seriesClone.length; i++) {
                options.series.push({
                    name: this.data.nodes[i],
                    type: 'line',
                    stack: i,
                    data: seriesClone[i]
                });
            }
            this.chart.setOption(options,true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .ConOrgComparisonAverage-container {
        .ConOrgComparisonAverage {
            width: 140px;
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
