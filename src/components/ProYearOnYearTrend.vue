<template>
  <div class="trendline-container">
    <div
      class="trendline echart"
      :style="{height: height}"
      :id="`trendline-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { formatTimeLabel } from 'utils/common';

export default {
    props: {
        id: String,
        data: Object,
        height: {
            type: String,
            default: "260px"
        }
    },
    data(){
        return {
            myChart:[],
            debounce:null
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`trendline-${this.id}`));
        this.renderChart(this.data);
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener("resize",this.debounce);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.debounce);
    },
    watch: {
        data: {
            handler: function (val) {
                this.renderChart(val);
            },
            deep: true
        },
    },
    methods: {
        renderChart(data) {
            const { timeLabels } = data;
            const ring = _.map(data.ring, (v)=> {
                return (v * 100).toFixed(2);
            });
            const yoy = _.map(data.yoy, (v)=> {
                return (v * 100).toFixed(2);
            });
            const options = {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: function(params){
                        let str = params[0].axisValue + "</br>";
                        for (let i of params) {
                            str += i.marker + " " + i.seriesName + " : " + String(i.value).replace(".00","") + '%' + "</br>";
                        }
                        return str;
                    },
                },
                grid: {
                    left: 0,
                    right: 30,
                    bottom: 0,
                    top: 72,
                    containLabel: true
                },
                legend: {
                    data: ['同比增长率', '环比增长率'],
                    left:'right',
                    show:true,
                    padding: [43,30,0,0]
                },
                color:['#318cb8','#26a6d7'],
                xAxis: {
                    type: 'category',
                    data: timeLabels,
                    axisLabel: {
                        formatter: function (value) {
                            return formatTimeLabel(value);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        data: yoy,
                        symbolSize: 8,
                        name: '同比增长率',
                        type: 'line',
                    },
                    {
                        data: ring,
                        symbolSize: 8,
                        name: '环比增长率',
                        type: 'line',
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                ],
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
                    top: 0
                },
            };
            this.chart.setOption(options);
        }
    }
};
</script>

<style lang="scss" scoped>
.trendline-container {
    .trendline {
        // width: 280px;
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

