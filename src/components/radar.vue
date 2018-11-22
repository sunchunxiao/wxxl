<template>
  <div class="pie-container">
    <div 
      class="pie" 
      :id="`pie-${id}`"/>
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
         calculateToShow(val) {
            const { subject } = this.data;
            if(val==null){
                return "未设定";
            }else{
                if (subject === 'ITO'||subject === 'ROI') { // 库存周转率不需要单位
                return val;
                }else if (subject === 'POR') { // 库存周转率不需要单位
                    return parseInt(val);
                }
                let Tenthousand = parseInt(val / 10000 / 100);
                if(Tenthousand>=1){
                    return parseInt(val / 10000 / 100)+'w';
                }else{
                    return parseInt(val/100);
                }
            // return parseInt(val / 10000 / 100); // 金额从分转换为万
            }
            
        },
        renderChart(data) {
            // console.log(data);
            const { transSubjects } = data;
            var arr= [];
            for(let i of transSubjects){
                arr.push({
                    name:i,
                    max:100
                });
            }
            // console.log(arr);
            const options = {
                title: {
                    text: '多雷达图'
                },
                // backgroundColor: '#fff',
                tooltip: {
                },
                legend: {
                    data: ['预算分配']
                },
                radar: {
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: arr,
                    radius: 100,
                    center: ['50%','60%'],
                },
                // grid: {
                //     left: 0,
                //     right: 0,
                //     bottom: 0,
                //     top: 0,
                //     containLabel: true
                // },
                series: [{
                        name: '预算 vs 开销',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data : [
                            {
                                value : [10,43, 10, 28, 35, 50, 19],
                                name : '预算分配'
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
        width: 350px;
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
