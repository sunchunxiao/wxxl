<template>
  <div class="ConOrgComparisonAverage-container">
    <div 
      class="ConOrgComparisonAverage" 
      :id="`ConOrgComparisonAverage-${id}`"/>
    <div class="detail">{{ title }}</div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Array,
        title: String
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`ConOrgComparisonAverage-${this.id}`));
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
        renderChart(data) {
            let _this = this;
            const options = {
                grid: {
                    left: 0,
                    right: 10,
                    bottom: 0,
                    top: 10,
                    containLabel: true
                },
                // color: ['#D53A35', '#E98F6F', '#6AB0B8', '#334B5C'],
                //title: {
                //    text: '报警次数'
                //},
                tooltip: {
                    trigger: 'axis',
                    //formatter: "{b} <br> 合格率: {c}%"
                },
                // legend: {
                //     data: ['旅游运输', '班线运输', '危险品', '普货']
                // },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                xAxis: {
                    type: 'category',
                    name: '日期',
                    boundaryGap: false,
                    data: ['9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: _.includes([0,1,2,6,7], parseInt(_this.id)) ? '{value}' : '{value} %'
                    }
                    // name: '报警次数',
                },
                series: [{
                        name: '旅游运输',
                        type: 'line',
                        stack: '总量',
                        data: data[0]
                    },
                    {
                        name: '班线运输',
                        type: 'line',
                        stack: '总量',
                        data: data[1]
                    },
                    {
                        name: '危险品',
                        type: 'line',
                        stack: '总量',
                        data: data[2]
                    },
                    {
                        name: '普货',
                        type: 'line',
                        stack: '总量',
                        data: data[3]
                    },
                ]
            };
            this.chart.setOption(options);
        }
    }
};
</script>

<style lang="scss" scoped>
.ConOrgComparisonAverage-container {
    .ConOrgComparisonAverage {
        width: 140px;
        height: 140px;
        margin: 0 auto;
    }
    .detail {
        text-align: center;
        color: #5e5e5e;
        font-size: 15px;
        padding: 10px;
    }
}
</style>

