<template>
  <div class="pie-container">
    <div
      class="pie echart"
      :id="`pie-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
const RANK = ['未知', '差', '中', '良', '优'];

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
    computed: {
        unit() {
            const { subject } = this.data;
            if (_.includes(['NIR','CTR'], subject)) { // 投入产出比 %
                return '%';
            } else if (subject === 'ITO') { // 库存周转率不需要单位
                return '';
            }
        },
        real() {
            const { real } = this.data;
            return this.calculateToShow(real);
        },
        target() {
            const { target } = this.data;
            return this.calculateToShow(target);
        }
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
            return RANK[score] || '';
        },
        renderChart(data) {
            let _this = this;
            const { transSubjects,radarValues } = data;
            let arr = [];
            for (let i of transSubjects) {
                arr.push({
                    name: i,
                    max: 4
                });
            }
            const options = {
                tooltip: {
                    formatter: function(params){
                        let result =[];
                        for(let i=0;i<params.name.length;i++){
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
                            padding: [3, 5],
                        }
                    },
                    shape: 'circle',
                    indicator: arr,
                    radius: 110,
                    center: ['47%','50%'],
                    splitArea: {
                        areaStyle: {
                            color: ['#fff'],
                            // shadowColor: 'rgba(0, 0, 0, 0.3)',
                            // shadowBlur: 10
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
        height: 300px;
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
