<template>
  <div class="bar-container">
    <div
      class="bar echart"
      ref="chart"
      :style="{height: height}"
      :id="`bar-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { labelNewline } from 'utils/common';
export default {
    data() {
        return {
            timerId: 0,
        };
    },
    computed: {
        height:function(){
            return "400px";
        }
    },
    mounted() {
        this.mycharts();
    },
    watch: {
        data: {
            handler() {
                this.mycharts();
            },
            deep: true
        },
    },
    props: {
        id: String,
        yAxis:Array,
        data: Object,
    },
    methods: {
        handleResize() {
            echarts.init(this.$refs.chart).resize();
        },
        calculateToShow(val) {
            if (val && val >= 10000) {
                return (val / 10000).toFixed(2) + 'w';
            } else {
                return val;
            }
        },
        mycharts() {
            var _this = this;
            var targetData = [];
            var actualData = [];
            if(_this.id === 'planDepartment' || _this.id === 'budgetDepartment'){
                targetData.push(
                    _this.data["target_p5"],
                    _this.data["target_p4"],
                    _this.data["target_p3"],
                    _this.data["target_p2"],
                    _this.data["target_p1"],
                    _this.data["target_total"]
                );
                actualData.push(
                    _this.data["actual_p5"],
                    _this.data["actual_p4"],
                    _this.data["actual_p3"],
                    _this.data["actual_p2"],
                    _this.data["actual_p1"],
                    _this.data["actual_total"]
                );
            }else if(_this.id === 'planSupplier' || _this.id === 'budgetSupplier'){
                targetData.push(
                    // _this.data["target_s5"],
                    _this.data["target_s4"],
                    _this.data["target_s3"],
                    _this.data["target_s2"],
                    _this.data["target_s1"],
                    _this.data["target_total"]
                );
                actualData.push(
                    // _this.data["actual_s5"],
                    _this.data["actual_s4"],
                    _this.data["actual_s3"],
                    _this.data["actual_s2"],
                    _this.data["actual_s1"],
                    _this.data["actual_total"],
                );
            }
            let option = {
                backgroundColor: '#fff',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                // legend: {
                //     data: ['目标', '实际'],
                //     align: 'left',
                //     right: 0,
                //     textStyle: {
                //         color: "#434e79",
                //         fontSize: 14,
                //         fontWeight: 400
                //     },
                //     itemWidth: 14,
                //     itemHeight: 14,
                //     itemGap: 35
                // },
                tooltip: {
                    trigger: "axis",
                    padding: [8, 10],
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    axisPointer: {
                        type: "shadow",
                        textStyle: {
                            color: "#fff"
                        }
                    }
                },
                yAxis: {
                    z: 3,
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: this.yAxis,
                    axisLabel: {
                        show: true,
                        fontSize: 14,
                        formatter: function(value) {
                            return labelNewline(8, value);
                        }
                    }
                },
                xAxis: {
                    inverse: false,
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                },
                series: [{
                    name: "目标",
                    type: "bar",
                    barWidth:40,
                    barMaxWidth: 40,
                    z: 0,
                    itemStyle: {
                        normal: {
                            color: "#E0E3E9",
                            barBorderRadius:[0, 20, 20, 0],
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 14,
                                    color:"#000"
                                },
                                position: "right",
                                distance: 10,
                                formatter: function(params) {
                                    return `${ _this.calculateToShow(params.value)}`;
                                },
                            }
                        }
                    },
                    // markLine :
                    // _this.id === 'planDepartment'||
                    // _this.id === 'planSupplier' ||
                    // _this.id === 'budgetDepartment' ||
                    // _this.id === 'budgetSupplier'?
                    //     {
                    //         symbol:"none",
                    //         name:"目标基准线",
                    //         label:{
                    //             show:true,
                    //             color: "#fd625e",
                    //             formatter: function(params) {
                    //                 return `目标基准线：${ _this.calculateToShow(params.value)}`;
                    //             },
                    //         },
                    //         data : [
                    //             {
                    //                 name: '目标基准线',
                    //                 xAxis: _this.data["actual_avg"]?_this.data["actual_avg"]:"暂无基准线",
                    //                 itemStyle: {
                    //                     color: '#b12725'
                    //                 }
                    //             }
                    //         ]
                    //     }:{},
                    data: targetData
                }, {
                    name: "实际",
                    type: "bar",
                    silent: true,
                    barWidth:30,
                    barMaxWidth: 30,
                    barGap: '-88%',
                    z: 1,
                    itemStyle: {
                        normal: {
                            color:function(params){
                                let actualBgColor = "";
                                if (params.value >= _this.data["actual_avg"]) {
                                    actualBgColor = '#01b8aa';
                                } else if(params.value < _this.data["actual_avg"] && params.value >= (_this.data["actual_avg"] /2)) {
                                    actualBgColor = '#F2C811';
                                } else if(params.value < (_this.data["actual_avg"] / 2)){
                                    actualBgColor = '#FD625E';
                                }
                                return actualBgColor;
                            },
                            // barBorderRadius:[0, 20, 20, 0],
                            label: {
                                show: true,
                                position: ['0%','0%'],
                                distance: -100,
                                color: '#000',
                                fontSize: 14,
                                padding: [10, 15, 20, 15],
                                borderRadius: 100,
                                formatter: function(params) {
                                    return `${ _this.calculateToShow(params.value)}`;
                                },
                            }
                        }
                    },
                    data: actualData
                }]

            };
            var charts = echarts.init(this.$refs.chart, "shine");
            charts.setOption(option);
            // 屏幕自适应
            this.timerId = setTimeout(function () {
                window.addEventListener("resize", _this.handleResize);
            }, 200);
        }
    },
    beforeDestroy() {
        clearTimeout(this.timerId);
        window.removeEventListener("resize", this.handleResize);
    }
};

</script>

<style lang="scss" scoped>
    .bar-container {
        width: 100%;
        .bar {
            width: 100%;
            margin: 0 auto;
        }
    }
</style>

