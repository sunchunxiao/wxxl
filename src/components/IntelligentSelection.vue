<template>
    <div class="heatmap-container">
        <div class="heatmap" :id="`heatmap-${id}`"></div>
        <!-- <div class="detail">{{title}}</div> -->
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Array,
        // title: String
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`heatmap-${this.id}`));
        this.renderChart(this.data);
    },
    methods: {
        getRank(score) {
            if (1 == score) {
                return '差';
            }
            if (2 == score) {
                return '中';
            }
            if (3 == score) {
                return '良';
            }
            return '优';
        },
        renderChart(data) {
            const _this = this;
            let options = [];
            let timeLineData = [];

            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                let seriesData = item.data.map(function (v) {
                    return [v[1], v[0], v[2] || '-'];
                });

                let option = {
                    title: {
                        text: '智能评选',
                        left: '40%',
                        textStyle: {
                            color: '#454545',
                            fontSize: 16,
                            fontWeight: 400
                        }
                    },
                    animation: true,
                    grid: {
                        height: '70%',
                        y: '8%',
                        x: '8%'
                    },
                    custom: {
                        categoryIds: item.categoryIds,
                        subjects: item.subjects,
                        categoryNames: item.categoryNames
                    },
                    xAxis: {
                        type: 'category',
                        data: item.transSubjects,
                        // splitArea: {
                        //     show: true
                        // },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 0
                        }

                    },
                    yAxis: {
                        type: 'category',
                        data: item.categoryNames,
                        splitArea: {
                            show: true
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 4,
                        calculable: true,
                        orient: 'vertical',
                        left: 'right',
                        bottom: '35%',
                        inRange: {
                            color: ['#a7dcfc','#70bcde', '#23a9cc', '#007eb0']
                        },
                        text: ['优', '差']
                    },
                    series: [{
                        name: '',
                        type: 'heatmap',
                        data: seriesData,
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return _this.getRank(params.data[2]);
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };

                options.push(option);
                timeLineData.push(item.timeLabel);
            }
            let heatMapOption = {
                baseOption: {
                    timeline: {
                        // y: 0,
                        axisType: 'category',
                        // realtime: false,
                        // loop: false,
                        autoPlay: false,
                        // currentIndex: 2,
                        playInterval: 2000,
                        // controlStyle: {
                        //     position: 'left'
                        // },
                        data: timeLineData,
                        checkpointStyle: {
                            color: '#258cb9',
                            borderColor: 'rgba(4, 165, 261, .5)'
                        },
                    },
                    tooltip: {}
                },
                options: options
            };
            this.chart.setOption(heatMapOption);
        }
    }
}
</script>

<style lang="scss" scoped>
.heatmap-container {
    .heatmap {
        width: 600px;
        height: 400px;
        margin: 0 auto;
    }
    // .detail {
    //     text-align: center;
    //     color: #5e5e5e;
    //     font-size: 15px;
    //     padding: 20px;
    // }
}
</style>


