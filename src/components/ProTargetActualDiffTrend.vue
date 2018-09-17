<template>
    <div class="bar-container">
        <div class="bar" :id="`bar-${id}`"></div>
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
        this.chart = echarts.init(document.getElementById(`bar-${this.id}`));
        this.renderChart(this.data);
    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.renderChart(val);
            },
            deep: true
        },
    },
    methods: {
        renderChart(data) {
            const {real, target, timeLabels} = data;
            const diff = [];
            const bottom = [];
            const underTarget = [];
            for (let i = 0; i < real.length; i++) {
                const realItem = real[i];
                const targetItem = target[i];
                bottom.push(realItem < targetItem ? realItem : targetItem);
                diff.push(Math.abs(realItem - targetItem));
                realItem < targetItem && underTarget.push(i);
            }
            const options = {
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 10,
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'axis'
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
                        data: real,
                        type: 'line',
                        lineStyle: {
                            type: 'dotted',
                            width: 1
                        }
                    },
                    {
                        data: target,
                        type: 'line',
                    },
                    {
                        data: bottom,
                        type: 'bar',
                        stack: 1,
                        barWidth: 3,
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                    },
                    {
                        data: diff,
                        type: 'bar',
                        stack: 1,
                        itemStyle: {
                            color: function (param) {
                                return -1 == underTarget.indexOf(param.dataIndex) ? '#b12725' : '#318cb8';
                            }
                        },
                    }
                ]
            };
            this.chart.setOption(options);
        }
    }
}
</script>

<style lang="scss" scoped>
.bar-container {
    .bar {
        width: 140px;
        height: 140px;
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

