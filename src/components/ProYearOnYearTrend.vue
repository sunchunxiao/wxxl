<template>
  <div class="trendline-container">
    <div 
      class="trendline" 
      :id="`trendline-${id}`"/>
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Object,
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`trendline-${this.id}`));
        this.renderChart(this.data);
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
                xAxis: {
                    type: 'category',
                    data: timeLabels
                },
                yAxis: {
                    type: 'value'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {},
                        dataView: {},
                        restore: {},
                        saveAsImage: {}
                    },
                    top: 0,
                    right: 0
                },
                series: [
                    {
                        data: ring,
                        type: 'line',
                        lineStyle: {
                            color: '#b12725'
                        }
                    },
                    {
                        data: yoy,
                        type: 'line',
                        lineStyle: {
                            color: '#318cb8'
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

