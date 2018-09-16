<template>
    <div class="trendline-container">
        <div class="trendline" :id="`trendline-${id}`"></div>
        <div class="detail">{{title}}</div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Object,
        title: String
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`trendline-${this.id}`));
        this.renderChart(this.data);
    },
    methods: {
        renderChart(data) {
            const {timeLabels, ring, yoy} = data;
            const options = {
                tooltip: {
                    show: true,
                    trigger: 'axis'
                },
                grid: {
                    left: 5,
                    right: 0,
                    bottom: 0,
                    top: 5,
                    containLabel: true
                },
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
}
</script>

<style lang="scss" scoped>
.trendline-container {
    .trendline {
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

