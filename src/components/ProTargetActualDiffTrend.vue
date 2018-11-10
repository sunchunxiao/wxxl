<template>
  <div class="bar-container">
    <div 
      class="bar" 
      :id="`bar-${id}`"/>
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Object,
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`bar-${this.id}`));
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
            const { real, target, timeLabels } = data;
            // console.log(timeLabels);
            const diff = [];
            const bottom = [];
            const underTarget = [];
            const realClone = _.cloneDeep(real);
            const targetClone = _.cloneDeep(target);
            for (let i = 0; i < realClone.length; i++) {
//                 realClone[i] = parseInt(realClone[i] / 10000 / 100);
//                 targetClone[i] = parseInt(targetClone[i] / 10000 / 100);
                const realItem = realClone[i];
                const targetItem = targetClone[i];
                bottom.push(realItem < targetItem ? realItem : targetItem);
                diff.push(Math.abs(realItem - targetItem));
                realItem < targetItem && underTarget.push(i);
            }
            const options = {
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 40,
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'axis'
                },
                color:['#fcb448','#318cb8','#318cb8','#b12725'],
                legend: {
                    data: ['目标', '实际'],
                    left:'right',
                    show:true,
                },
                // toolbox: {
                //     show: true,
                //     feature: {
                //         dataZoom: {},
                //         dataView: {},
                //         restore: {},
                //         saveAsImage: {}
                //     },
                //     top: -5,
                //     right: 150
                // },
                xAxis: {
                    type: 'category',
                    data: timeLabels
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: realClone,
                        name:'实际',
                        type: 'line',
                        lineStyle: {
                            color:'#fcb448',
                            type: 'solid',
                            width: 2
                        }
                    },
                    {
                        name:'目标',
                        data: targetClone,
                        type: 'line',
                    },
                    {
                        data: bottom,
                        type: 'bar',
                        stack: 1,
                        barWidth: 8,
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                color: 'rgba(0,0,0,0)'
                            }
                        },
                    },
                    {
                        data: diff,
                        name:'差异',
                        type: 'bar',
                        stack: 1,
                        itemStyle: {
                            color: function (param) {                                            return -1 == underTarget.indexOf(param.dataIndex) ? '#b12725' : '#318cb8';
                            }
                        },
                    }
                ]
            };
            this.chart.setOption(options);
            var _this = this;
            window.addEventListener("resize", function () {
               _this.chart.resize();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.bar-container {
    .bar {
        width: 100%;
        height: 160px;
        margin: 0 auto;
    }
    .detail {
        text-align: center;
        color: #5e5e5e;
        font-size: 15px;
        padding: 20px;
    }
}
</style>

