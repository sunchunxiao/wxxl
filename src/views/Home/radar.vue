<template>
  <div class="radar-container">
    <div
      class="radar echart"
      :id="`radar-${id}`" />
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
        this.chart = echarts.init(document.getElementById(`radar-${this.id}`));
        if(this.data.progress){
            this.renderChart();
        }
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
        renderChart() {
            let arr = [];
            for (let i of this.data.name) {
                arr.push({
                    name: i,
                    min:0,
                    max: 2
                });
            }
            const options = {
                legend: {
                    data: ['各指标达成率'],
                    right:'10%',
                },
                tooltip: {
                    formatter: function(params) {
                        let result =[];
                        for (let i=0; i<params.name.length; i++) {
                            result += params.name[i] + " : " + params.value[i] +"</br>";
                        }
                        return result;
                    },
                    position: function (point) {
                        return ["50%", point[1] + 25];
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
                        name: '各指标达成率',
                        type: 'radar',
                        color:'red',
                        data : [
                            {
                                value : this.data.progress,
                                name: this.data.name,
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
                    }]
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
        height: 295px;
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
