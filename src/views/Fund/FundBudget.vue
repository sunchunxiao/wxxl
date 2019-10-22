<template>
  <div class="radar-container">
    <div
      class="radar echart"
      :id="`radar-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
// import { labelNewline } from 'utils/common';
// const REVERSE_TARGET = ['C', 'SA','DR']; // C成本 SA库存额 DR残品率是反向指标

export default {
    props: {
        id: String,
        data: Array,
    },
    data() {
        return {
            color: '#000',
            debounce:null,
            clientWidth:document.body.clientWidth
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`radar-${this.id}`));
        this.renderChart(this.data);
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener('resize', this.debounce);
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
            // let colorList =[  '#f36f8a','#5f71d2', '#5fd27b', '#6173d6', '#47dfae','#01b8aa','#4ac7f5', '#42a4eb', '#426eeb'];
            //3feed4蓝色 f1bb4c黄色
            let colorList =[ '#f36f8a','#5f71d2', '#5fd27b', '#3feed4', '#f1bb4c','#01b8aa','#4ac7f5', '#42a4eb', '#426eeb'];
            const options = {
                backgroundColor: '#fff',
                // legend: {
                //     orient: 'vertical',
                //     x: 'left',
                //     data:['中国人保','太平洋保险','平安保险','其它'],
                //     icon: 'circle',
                //     textStyle: {
                //         color: '#fff',
                //         fontSize: 14,
                //         fontFamily: 'PingFangSC',
                //         fontWeight: 400
                //     }
                // },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为："line" | "shadow"
                    },
                    formatter: function(params) {
                        let str = params.marker + params.name + '<br/>';
                        str += '实际值:' + params.value + '<br/>';
                        str += '占比:' + params.percent + '%';
                        return str;
                    }
                },
                series: [
                    {
                        type:'pie',
                        radius: ['0', '140'],
                        selectedMode: 'single',
                        selectedOffset: 0,
                        clockwise: false,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            color: function(params) {
                                return colorList[params.dataIndex];
                            }
                        },
                        //01b8aa
                        // color:
                        label: {
                            normal: {
                                show: true,
                                formatter: (params)=>{
                                    return `{bolck|}{b|${params.name}}{c|${params.percent}%}`;
                                },
                                textStyle: {
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 14
                                },
                                rich: {
                                    b: {
                                        fontSize: 14,
                                        padding: 4,
                                        // color:'#000'
                                    },
                                    c: {
                                        fontSize: 14,
                                        align: 'center',
                                        padding: 4,
                                        // color:'#000'
                                    }
                                },
                                // rich: {
                                //     color0: {
                                //         fontSize: 18,
                                //         color: '#EBE806',
                                //         fontWeight: 400,
                                //         fontFamily: 'PingFangSC'
                                //     },
                                //     color1: {
                                //         fontSize: 18,
                                //         color: '#FF5624',
                                //         fontWeight: 400,
                                //         fontFamily: 'PingFangSC'
                                //     },
                                //     color2: {
                                //         fontSize: 18,
                                //         color: '#5EA6FE',
                                //         fontWeight: 400,
                                //         fontFamily: 'PingFangSC'
                                //     },
                                //     color3: {
                                //         fontSize: 18,
                                //         color: '#37FFF9',
                                //         fontWeight: 400,
                                //         fontFamily: 'PingFangSC'
                                //     }
                                // }
                            }
                        },
                        labelLine: {
                            length: 24,
                            // lineStyle: {
                            //     color: '#000'
                            // },
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        },
                        data:data
                        // data:[
                        //     {
                        //         value:100, name:'其它',
                        //         itemStyle: {
                        //             color:'#ff9f7e'
                        //         },
                        //         labelLine: {
                        //             lineStyle: {
                        //                 color: '#ff9f7e'
                        //             }
                        //         }
                        //     },
                        //     {
                        //         value:30, name:'平安保险',
                        //         itemStyle: {
                        //             color:'#FF5624'
                        //         },
                        //         labelLine: {
                        //             lineStyle: {
                        //                 color: '#FF5624'
                        //             }
                        //         }
                        //     },
                        //     {
                        //         value:30, name:'太平洋保险',
                        //         itemStyle: {
                        //             color: '#5EA6FE'
                        //         },
                        //         labelLine: {
                        //             lineStyle: {
                        //                 color: '#5EA6FE'
                        //             }
                        //         }
                        //     },
                        //     {
                        //         value:30, name:'中国人保',
                        //         itemStyle: {
                        //             color: '#37FFF9'
                        //         },
                        //         labelLine: {
                        //             lineStyle: {
                        //                 color: '#37FFF9'
                        //             }
                        //         }
                        //     },

                        // ]
                    }
                ]
            };
            this.chart.setOption(options,true);
        }
    }
};
</script>

<style lang="scss" scoped>
.radar-container {
    .radar {
        min-width: 350px;
        width: 100%;
        height: 370px;
        margin: 0 auto;
    }
    .detail {
        text-align: center;
        span.text {
            font-size: 150%;
        }
        span.value {
            font-size: 180%;
        }
    }
}

</style>
