<template>
  <div class="pie-container">
    <div 
      class="pie" 
      :id="`pie-${id}`" />
      <!-- <div class="detail">
      <span class="text">目标: </span>
      <span class="value">{{ target }}</span>
      &nbsp;<span>{{ unit }}</span>
    </div>
    <div class="detail">
      <span class="text">实际: </span>
      <span 
        class="value" 
        :style="{color: color}">{{ real }}</span>
      &nbsp;<span>{{ unit }}</span>
    </div> -->
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Object,
    },
    data() {
        return {
            color: '#000'
        };
    },
    computed: {
        unit() {
            const { subject } = this.data;
            if (subject== 'NIR'||subject== 'CTR') { // 投入产出比 %
                return '%';
            } else if (subject === 'ITO') { // 库存周转率不需要单位
                return '';
            }
            // return 'w';
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
                if (0 == score) {
                    return '未知';
                }
                if (1 == score) {
                    return '差';
                }
                if (2 == score) {
                    return '中';
                }
                if (3 == score) {
                    return '良';
                }
                if (4 === score) {
                    return '优';
                }
                return '';
        },
        renderChart(data) {
            // console.log(data);
            var _this =this;
            const { transSubjects,radarValues } = data;
            var arr= [];
            for(let i of transSubjects){
                arr.push({
                    name:i,
                    max:4
                });
            }
            // console.log(arr);
            const options = {
                title:{
                    text:"综合评估"
                },
                // backgroundColor: '#fff',
                tooltip: {
                    // trigger: 'axis',
                    formatter: function(params){
                            // console.log(params);
                            var result =[];
                            for(let i=0;i<params.name.length;i++){
                                result += params.name[i] + " : " + _this.getRank(params.value[i]) +"</br>";
                            }
                            
                            return result;
                        },
                },
                // legend: {
                //     data: ['预算分配']
                // },
                radar: {
                    name: {
                        textStyle: {
                            color: '#000',
                            // backgroundColor:'',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: arr,
                    radius: 100,
                    center: ['48%','50%'],
                    splitArea: {
                        areaStyle: {
                            color: ['#eee','#a7dcfc', '#70bcde','#23a9cc','#007eb0'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10
                        }
                    },
                },
                // grid: {
                //     left: 0,
                //     right: 0,
                //     bottom: 0,
                //     top: 0,
                //     containLabel: true
                // },
                series: [{
                        name: '',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data : [
                            {
                                value : radarValues,
                                name:transSubjects
                            },
                        ]
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
        width: 330px;
        height: 330px;
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
