<template>
    <div class="pie-container">
        <div class="pie" :id="`pie-${id}`"></div>
        <div class="detail">
            <span class="text">目标: </span>
            <span class="value">{{data.goal}}</span>
            &nbsp;<span>{{unit}}</span>
        </div>
        <div class="detail">
            <span class="text">实际: </span>
            <span class="value" v-bind:style="{color: color}">{{data.value}}</span>
            &nbsp;<span>{{unit}}</span>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';

const colorMap = { over: '#b12725', below: '#308db9'};
const colorLeft = '#E0E3E9';

export default {
    props: {
        id: String,
        data: Object,
    },
    data() {
        return {
            unit: 'w',
            color: '#000'
        }
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`pie-${this.id}`));
        this.renderChart(this.data);
    },
    methods: {
        renderChart(data) {
            const {value, goal, text} = data;
            const valuePercent = Math.floor(value / goal * 100);
            const color = valuePercent >= 100 ? colorMap.over : colorMap.below;
            this.color = color;
            const valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
            const radius = ['56', '60'];
            const fontSize1 = 28;
            const fontSize2 = 15;
            const options = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'item',
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                series: [{
                    type: 'pie',
                    radius: radius,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                            value: valuePercent,
                            name: '',
                            itemStyle: {
                                normal: {
                                    color: color,
                                }
                            },
                            label: {
                                normal: {
                                    formatter: Math.floor(value / goal * 100) + '%',
                                    textStyle: {
                                        fontSize: fontSize1,
                                        color: color,
                                    }
                                },
                            }
                        },
                        {
                            value: valueLeft,
                            name: text,
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: colorLeft,
                                }
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: fontSize2,
                                        fontWeight: 600,
                                        color: '#5e5e5e'
                                    }
                                }
                            }
                        }, {
                            value: 0,
                            name: '',
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: colorLeft,
                                }
                            },
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: fontSize2,
                                        fontWeight: 600,
                                        color: color,
                                    }
                                }
                            }
                        }, 
                    ]
                }]
            };
            this.chart.setOption(options);
        }
    }
}
</script>

<style lang="scss" scoped>
.pie-container {
    .pie {
        width: 140px;
        height: 140px;
        margin: 0 auto;
    }
    .detail {
        text-align: center;
        .value {
            font-size: 120%;
        }
    }
}

</style>
