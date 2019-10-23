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
    props: {
        id: String,
        data: Object,
    },
    computed: {
        height:function(){
            return "400px";
        }
    },
    mounted() {
        this.mycharts(this.data);
    },
    watch: {
        data: {
            handler: function(val) {
                this.mycharts(val);
            },
            deep: true
        },
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

        mycharts(data) {
            const { rate } = data;
            let _this = this;
            let targetData = [],target = [];
            let actualData = [],real = [];
            let yAxis = [];
            // if (_this.id === 'planDepartment' || _this.id === 'budgetDepartment') {
            for (let i of data.planData) {
                targetData.push(1);
                target.push(i.target);
                if((i.real/i.target).toFixed(2)>=1){
                    actualData.push(0.99);
                }else{
                    actualData.push((i.real/i.target).toFixed(2));
                }
                real.push(i.real);
                yAxis.push({
                    value: i.subject_name,
                });
            }
            // real.reverse();
            // target.reverse();
            // yAxis.reverse();
            let option = {
                backgroundColor: '#fff',
                grid: {
                    left: '3%',
                    right: '9%',
                    bottom: '3%',
                    containLabel: true
                },
                tooltip: {
                    trigger: "axis",
                    padding: [8, 10],
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    axisPointer: {
                        show:false,
                        type: "shadow",
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    formatter:function(params) {
                        let result = '';
                        result += params[0].name + "</br>";
                        for (let i = 0; i<params.length;i++) {
                            if (i==0) {
                                result += params[i].marker + params[i].seriesName + ": " + target[params[i].dataIndex] + "</br>";
                            } else {
                                result += params[i].marker + params[i].seriesName + ": " + real[params[i].dataIndex] + "</br>";
                            }
                        }
                        return result;
                    }
                },
                yAxis: {
                    z: 3,
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    inverse: false,
                    data: yAxis,
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
                                    return `${target[params.dataIndex]}`;
                                },
                            }
                        }
                    },
                    markLine :{
                        symbol:"none",
                        name:"目标基准线",
                        label:{
                            show:true,
                            color: "#fd625e",
                            formatter: function(params) {
                                return `目标基准线：${ params.value}`;
                            },
                        },
                        data: [{
                            xAxis: rate,
                            itemStyle: {
                                color: '#b12725'
                            }
                        }]
                    },
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
                                if (params.data >= data.rate) {
                                    actualBgColor = '#01b8aa';
                                } else if(params.data < data.rate){
                                    actualBgColor = '#FD625E';
                                }
                                return actualBgColor;
                            },
                            label: {
                                show: true,
                                position: ['0%','0%'],
                                distance: -100,
                                color: '#000',
                                fontSize: 14,
                                padding: [10, 15, 20, 15],
                                borderRadius: 100,
                                formatter: function(params) {
                                    return `${real[params.dataIndex]}`;
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

