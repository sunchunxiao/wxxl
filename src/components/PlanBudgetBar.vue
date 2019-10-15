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
        //tooltip数据格式化
        tooltipFormat(params){
            switch (params[0].axisValue) {
                case "总":
                    params[0].val = this.data["target_total"];
                    params[1].val = this.data["actual_total"];
                    break;
                case "一部":
                    params[0].val = this.data["target_p1"];
                    params[1].val = this.data["actual_p1"];
                    break;
                case "二部":
                    params[0].val = this.data["target_p2"];
                    params[1].val = this.data["actual_p2"];
                    break;
                case "三部":
                    params[0].val = this.data["target_p3"];
                    params[1].val = this.data["actual_p3"];
                    break;
                case "四部":
                    params[0].val = this.data["target_p4"];
                    params[1].val = this.data["actual_p4"];
                    break;
                case "五部":
                    params[0].val = this.data["target_p5"];
                    params[1].val = this.data["actual_p5"];
                    break;
                case "战略供应商工厂A":
                    params[0].val = this.data["target_s1"];
                    params[1].val = this.data["actual_s1"];
                    break;
                case "战略供应商工厂B":
                    params[0].val = this.data["target_s2"];
                    params[1].val = this.data["actual_s2"];
                    break;
                case "战略供应商工厂C":
                    params[0].val = this.data["target_s3"];
                    params[1].val = this.data["actual_s3"];
                    break;
                case "战略供应商工厂D":
                    params[0].val = this.data["target_s4"];
                    params[1].val = this.data["actual_s4"];
                    break;
            }
            return params;
        },
        //itemStyle数据格式化
        itemStyleFormat(params){
            let seriesName = params.seriesName;
            switch (params.name) {
                case "总":
                    if(seriesName === "目标"){
                        params.value = this.data["target_total"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_total"];
                    }
                    break;
                case "一部":
                    if(seriesName === "目标"){
                        params.value = this.data["target_p1"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_p1"];
                    }
                    break;
                case "二部":
                    if(seriesName === "目标"){
                        params.value = this.data["target_p2"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_p2"];
                    }
                    break;
                case "三部":
                    if(seriesName === "目标"){
                        params.value = this.data["target_p3"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_p3"];
                    }
                    break;
                case "四部":
                    if(seriesName === "目标"){
                        params.value = this.data["target_p4"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_p4"];
                    }
                    break;
                case "五部":
                    if(seriesName === "目标"){
                        params.value = this.data["target_p5"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_p5"];
                    }
                    break;
                case "战略供应商工厂A":
                    if(seriesName === "目标"){
                        params.value = this.data["target_s1"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_s1"];
                    }
                    break;
                case "战略供应商工厂B":
                    if(seriesName === "目标"){
                        params.value = this.data["target_s2"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_s2"];
                    }
                    break;
                case "战略供应商工厂C":
                    if(seriesName === "目标"){
                        params.value = this.data["target_s3"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_s3"];
                    }
                    break;
                case "战略供应商工厂D":
                    if(seriesName === "目标"){
                        params.value = this.data["target_s4"];
                    }else if(seriesName === "实际"){
                        params.value = this.data["actual_s4"];
                    }
                    break;
            }
            return params;
        },

        mycharts() {
            let _this = this;
            let targetData = [];
            let actualData = [];
            if(_this.id === 'planDepartment' || _this.id === 'budgetDepartment'){
                targetData.push(1,1,1,1,1,1);
                actualData.push(
                    _this.data["actual_p5"]/_this.data["target_p5"],
                    _this.data["actual_p4"]/_this.data["target_p4"],
                    _this.data["actual_p3"]/_this.data["target_p3"],
                    _this.data["actual_p2"]/_this.data["target_p2"],
                    _this.data["actual_p1"]/_this.data["target_p1"],
                    _this.data["actual_total"]/_this.data["target_total"]
                );
            }else if(_this.id === 'planSupplier' || _this.id === 'budgetSupplier'){
                targetData.push(1,1,1,1,1);
                actualData.push(
                    _this.data["actual_s4"]/_this.data["target_s4"],
                    _this.data["actual_s3"]/_this.data["target_s3"],
                    _this.data["actual_s2"]/_this.data["target_s2"],
                    _this.data["actual_s1"]/_this.data["target_s1"],
                    _this.data["actual_total"]/_this.data["target_total"],
                );
            }
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
                    formatter:function(params){
                        let _params = params;
                        _this.tooltipFormat(_params);
                        let result = '';
                        result += _params[0].name + "</br>";
                        for(let i = 0; i<_params.length;i++){
                            result += _params[i].marker + _params[i].seriesName + ": " + _params[i].val + "</br>";
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
                                    let _params = params;
                                    _this.itemStyleFormat(_params);
                                    return `${ _this.calculateToShow(_params.value)}`;
                                },
                            }
                        }
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
                                let _params = params;
                                _this.itemStyleFormat(_params);
                                let actualBgColor = "";
                                if (_params.value >= _this.data["actual_avg"]) {
                                    actualBgColor = '#01b8aa';
                                } else if(_params.value < _this.data["actual_avg"] && _params.value >= (_this.data["actual_avg"] /2)) {
                                    actualBgColor = '#F2C811';
                                } else if(_params.value < (_this.data["actual_avg"] / 2)){
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
                                    let _params = params;
                                    _this.itemStyleFormat(_params);
                                    return `${ _this.calculateToShow(_params.value)}`;
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

