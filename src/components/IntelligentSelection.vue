<template>
  <div class="heatmap-container">
    <div
      class="heatmap echart"
      :id="`heatmap-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { labelNewline, formatTimeLabel } from 'utils/common';
const RANK = ['未知', '差', '中', '良', '优'];
export default {
    props: {
        id: String,
        data: Array,
    },
    data() {
        return {
            timeLineData: [],
            cid: 0,
            name: '',
            brand: '',
            debounce: null
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`heatmap-${this.id}`));
        this.renderChart(this.data);
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener("resize",this.debounce);
        let _this = this;
        this.chart.on('click', function(params) {
            let time = params.seriesId;
            for (let i = 0;i < _this.data.length; i++) {
                if (_this.data[i].timeLabel == time) {
                    for (let j=0;j<_this.data[i].subjects.length;j++) {
                        if (params.data[0] == j) {
                            this.name = _this.data[i].subjects[j];
                        }
                    }
                    for (let m=0;m<_this.data[i].categoryNames.length;m++) {
                        if (params.data[1] == m) {
                            this.brand = _this.data[i].categoryNames[m];
                            this.cid = _this.data[i].categoryIds[m];
                        }
                    }
                }
            }
            if (params.componentType == "series") {
                _this.$emit('showStragety', {
                    brand: this.brand,
                    cid: this.cid,
                    name: params.name,
                    subject: this.name,
                    time_label: time,
                    rank: _this.getRank(params.data[2]),
                });
            } else {
                const time = params.name;
                _this.$emit('changeTime',time);
            }
        });
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.debounce);
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
        getRank(score) {
            return RANK[score] || '';
        },
        renderChart(data) {
            const _this = this;
            let options = [];
            let timeLineData = [];
            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                let seriesData = item.data.map(function(v) {
                    return [v[1], v[0], v[2]];
                });
                let option = {
                    // title: {
                    //     text: '智能评选',
                    //     left: '40%',
                    //     textStyle: {
                    //         color: '#454545',
                    //         fontSize: 16,
                    //         fontWeight: 400
                    //     }
                    // },
                    tooltip: {
                        formatter: function(params) {
                            if (params.componentType == 'timeline') {
                                let result = params.marker + params.name;
                                return formatTimeLabel(result);
                            } else {
                                const name = params.seriesName.split(",");
                                let result = params.marker + name[params.value[1]] + "<br />";
                                result += params.name + " : " + _this.getRank(params.value[2]) + "</br>";
                                return result;
                            }
                        }
                    },
                    visualMap: {
                        itemWidth: 45,
                        itemHeight: 24,
                        inverse: true,
                        pieces: [{
                            max: 1,
                            label:'无',
                            color: '#eee'
                        },{
                            max: 2,
                            label:'差',
                            color: '#a7dcfc'
                        },{
                            max: 3,
                            label:'中',
                            color: '#70bcde'
                        },{
                            max: 4,
                            label:'良',
                            color: '#23a9cc'
                        },{
                            max: 5,
                            label:'优',
                            color: '#007eb0'
                        }],
                        orient: 'horizontal',
                        left: 'right',
                        top: 0,
                        itemGap: 1,
                        textGap: -30,
                        textStyle: {
                            color: '#000',
                            fontSize:14
                        }
                    },
                    animation: false,
                    grid: {
                        width:'auto',
                        height: '70%',
                        y: '13%',
                        x: '15%'
                    },
                    custom: {
                        categoryIds: item.categoryIds,
                        subjects: item.subjects,
                        categoryNames: item.categoryNames
                    },
                    xAxis: {
                        type: 'category',
                        data: item.transSubjects,
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 0,
                            show: true,
                            formatter: function(value) {
                                return labelNewline(3, value);
                            }
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
                        },
                        axisLabel: {
                            interval: 0,
                            show: true,
                            formatter: function(value) {
                                return labelNewline(6, value);
                            }
                        }
                    },
                    series: [{
                        name: item.categoryNames,
                        type: 'heatmap',
                        data: seriesData,
                        id: item.timeLabel,
                        label: {
                            normal: {
                                show: true,
                                formatter: function(params) {
                                    return _this.getRank(params.data[2]);
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                borderColor: '#F2C811',
                                borderWidth: 2,
                                // shadowBlur: 10,
                                // shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },
                    ]
                };
                options.push(option);
                timeLineData.push(item.timeLabel);
            }
            let heatMapOption = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        playInterval: 2000,
                        data: timeLineData,
                        label: {
                            formatter: function(value) {
                                return formatTimeLabel(value);
                            }
                        },
                        checkpointStyle: {
                            color: '#F2C811',
                            borderWidth: 1,
                            borderColor: '000'
                        },
                        bottom: '-1%',
                        //时间轴线颜色
                        lineStyle: {
                            color: '#494A4A',
                            width: 1
                        },
                        //播放按钮
                        controlStyle: {
                            showPlayBtn: false,
                            color: '#000'
                        },
                        //高亮颜色
                        // emphasis: {
                        //     itemStyle: {
                        //         color: '#F2C811',
                        //     }
                        // }
                    },
                },
                options: options
            };
            this.chart.setOption(heatMapOption, true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .heatmap-container {
        .heatmap {
            width: 100%;
            height: 480px;
            margin: 0 auto;
        }
        canvas{
            width: 100%;
        }
    }
</style>
