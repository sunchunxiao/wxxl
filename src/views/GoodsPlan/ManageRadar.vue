<template>
  <div class="pie-container">
    <div
      class="pie echart"
      :id="`pie-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
// const RANK = ['未知', '差', '中', '良', '优'];

export default {
    props: {
        id: String,
        data: Array,
    },
    data() {
        return {
            color: '#000',
            debounce:null
        };
    },

    mounted() {
        this.chart = echarts.init(document.getElementById(`pie-${this.id}`));
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
        getRank(score) {
            return score+'分';
        },
        renderChart(data) {
            let yData = [];
            if(this.id == 'selectTreeManage'){
                yData = [];
            } else {
                yData = ['实际', '目标'];
            }
            let transSubjects = [],radarValues = [],radarValuesTarget = [];
            if (this.id =='outRadar') {
                transSubjects = data[0].names;
                radarValues = data[0].scores;
                radarValuesTarget = data[0].target;
            } else {
                transSubjects = data.map(el => el.name);
                radarValues = data.map(el => el.score);
            }
            let _this = this;
            // const { transSubjects,radarValues } = data;
            let arr = [];
            for (let i of transSubjects) {
                arr.push({
                    name: i,
                    min:0,
                    max: 150
                });
            }
            const options = {
                legend: {
                    width:10,
                    height:10,
                    top: 60,
                    data: yData,
                    right:'20%',
                    // textStyle: {
                    //     color:'rgb(255,255,255)',
                    //     fontSize:16
                    // }
                },
                tooltip: {
                    formatter: function(params) {
                        let result =[];
                        result = params.seriesName +"</br>";
                        for (let i=0; i<params.name.length; i++) {
                            result += params.name[i] + " : " + _this.getRank(params.value[i]) +"</br>";
                        }
                        return result;
                    },
                    position: function (point) {
                        return ["45%", point[1] + 20];
                    }
                },
                scale: true,
                radar: {
                    name: {
                        textStyle: {
                            color: '#5F5D5D',
                            fontSize: 14,
                            borderRadius: 3,
                            padding: [3, 10],
                        }
                    },
                    show:true,
                    shape: 'circle',
                    indicator: arr,
                    radius: 110,
                    center: ['47%','50%'],
                    splitArea: {
                        areaStyle: {
                            color: ['#fff'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10
                        }
                    },
                    // 网线颜色
                    splitLine: {
                        lineStyle: {
                            color: 'rgb(153, 153, 153)'
                        }
                    },

                },
                series: [
                    {
                        name: '实际',
                        type: 'radar',
                        color:'red',
                        data : [
                            {
                                value : radarValues,
                                name: transSubjects,
                                label: {
                                    normal: {
                                        show: false,
                                        formatter:function(params) {
                                            return params.value;
                                        },
                                        color:'#000',
                                    },
                                },
                                areaStyle: {
                                    normal: {
                                        show: true,
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                }
                            },
                        ],
                        itemStyle : {
                            normal : {
                            //拐点线颜色
                                lineStyle: {
                                    color:'#FD625E',
                                    width: 2
                                }
                            },
                            emphasis: {
                                lineStyle: {
                                    width: 3
                                }
                            }
                        },
                    },{
                        name: '目标',
                        type: 'radar',
                        color:'green',
                        data : [
                            {
                                value : radarValuesTarget,
                                name: transSubjects,
                                label: {
                                    normal: {
                                        show: false,
                                        // formatter:function(params) {
                                        //     return params.value;
                                        // },
                                        color:'#000',
                                    },
                                },
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                }
                            },
                        ],
                        itemStyle : {
                            normal : {
                            //拐点线颜色
                                lineStyle: {
                                    color:'rgb(150,206,93)',
                                    width: 2
                                }
                            },
                            emphasis: {
                                lineStyle: {
                                    width: 3
                                }
                            }
                        },
                    }]
            };
            this.chart.setOption(options,true);
        }
    }
};
</script>

<style lang="scss" scoped>
.pie-container {
    .pie {
        min-width: 350px;
        width: 100%;
        height: 350px;
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
