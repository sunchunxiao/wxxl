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
            let transSubjects = [],radarValues = [];
            if(this.id =='outRadar') {
                transSubjects = data[0].names;
                radarValues = data[0].scores;
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
                    max: 150
                });
            }
            const options = {
                tooltip: {
                    formatter: function(params) {
                        let result =[];
                        for (let i=0; i<params.name.length; i++) {
                            result += params.name[i] + " : " + _this.getRank(params.value[i]) +"</br>";
                        }
                        return result;
                    },
                },
                radar: {
                    name: {
                        textStyle: {
                            color: '#5F5D5D',
                            fontSize: 14,
                            borderRadius: 3,
                            padding: [3, 10],
                        }
                    },
                    // shape: 'circle',
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
                    }
                },
                series: [{
                    name: '',
                    type: 'radar',
                    data : [
                        {
                            value : radarValues,
                            name: transSubjects,
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
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
