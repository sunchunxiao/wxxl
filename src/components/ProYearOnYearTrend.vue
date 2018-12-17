<template>
  <div class="trendline-container">
    <div
      class="trendline"
      :id="`trendline-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';

export default {
    props: {
        id: String,
        data: Object,
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
            const { timeLabels, ring, yoy } = data;
            const options = {
                tooltip: {
                    show: true,
                    trigger: 'axis'
                },
                grid: {
                    left: 5,
                    right: 0,
                    bottom: 0,
                    top: 35,
                    containLabel: true
                },
                legend: {
                    data: ['同比增长率', '环比增长率'],
                    left:'right',
                    show:true,
                },
                color:['#b12725','#338cb6'],
                xAxis: {
                    type: 'category',
                    data: timeLabels
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: ring,
                        name: '环比增长率',
                        type: 'line',
                        lineStyle: {
                            color: '#b12725'
                        }
                    },
                    {
                        data: yoy,
                        name: '同比增长率',
                        type: 'line',
                        lineStyle: {
                            color: '#338cb6',
                        }
                    }
                ]
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
        height: 160px;
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

