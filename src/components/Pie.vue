<template>
    <div class="pie-container">
        <div id="pie"></div>
    </div>
</template>

<script>
import echarts from 'echarts';

const colorMap = { over: '#b12725', below: '#308db9'};
const colorLeft = '#E0E3E9';

export default {
    props: {
        data: object
    },
    data() {
        return {}
    },
    mounted() {
        this.chart = echarts.init(document.getElementById('pie'));
        this.renderChart(this.data);
    },
    methods: {
        renderChart(data) {
            const {value, goal, text} = data;
            const color = value >= 80 ? colorMap.over : colorMap.below;
            const valuePercent = Math.floor(value / goal * 100);
            const valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
            const options = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'item',
                },
                series: [{
                    type: 'pie',
                    radius: ['56', '60'],
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
                                        fontSize: 28,
                                        color: '#5e5e5e'
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
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: color,
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
                                        fontSize: 15,
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
    width: 150px;
    height: 200px;
    padding: 0 5px;
    #pie {
        width: 140px;
        height: 140px;
    }
}

</style>
