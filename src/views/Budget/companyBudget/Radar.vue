<template>
  <div class="pie-container">
    <div
      class="pie echart"
      :id="`pie-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';

export default {
    props: {
        id: String,
        data: Object,
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
            let transSubjects = [],radarValues = [];
            transSubjects = data.name;
            radarValues = data.progress;
            let arr = [];
            for (let i of transSubjects) {
                arr.push({
                    name: i,
                    min:0,
                    max: 1
                });
            }
            const options = {
                legend: {
                    width:10,
                    height:10,
                    top: 60,
                    data: yData,
                    right:'20%',
                },
                tooltip: {
                    formatter: function(params) {
                        let result =[];
                        for (let i=0; i<params.name.length; i++) {
                            result += params.name[i]+'(使用率)' + " : " + (params.value[i]*100).toFixed(0)+'%' +"</br>";
                        }
                        return result;
                    },
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
                        type: 'radar',
                        color:'red',
                        data : [
                            {
                                value : radarValues,
                                name: transSubjects,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter:function(params) {
                                            return (params.value*100).toFixed(0)+'%';
                                        },
                                        color:'#000',
                                    },
                                },
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(1, 184, 170, 0.8)'
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
