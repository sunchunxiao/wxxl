<template>
  <div class="pie-container">
    <div
      class="pie"
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
            for(let i of transSubjects){
                arr.push({
                    name:i,
                    max:4
                });
            }
            const options = {
                title:{
                    text:"综合评估"
                },
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
                            color: '#000',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: arr,
                    radius: 100,
                    center: ['47%','50%'],
                    splitArea: {
                        areaStyle: {
                            color: ['#eee','#a7dcfc', '#70bcde','#23a9cc','#007eb0'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10
                        }
                    },
                },
                series: [{
                    name: '',
                    type: 'radar',
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
        min-width: 330px;
        width: 100%;
        height: 320px;
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
