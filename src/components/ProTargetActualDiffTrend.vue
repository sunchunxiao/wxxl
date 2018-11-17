<template>
  <div class="bar-container">
    <div 
      class="bar"
      :id="`bar-${id}`" />
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
    mounted () {
        this.chart = echarts.init(document.getElementById(`bar-${this.id}`));
        this.renderChart(this.data);
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener('resize', this.debounce);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.debounce);
    },
    data () {
        return {
            arr: '',
            debounce: null
        };
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
        // resize () {
        //     return _.debounce(() => {
        //         this.chart.resize();
        //     }, 500);
        // },
        calculateToShow (val) {
            const { subject_name } = this.data;
            // console.log(val);
            if (subject_name === '投入产出比' || subject_name === '库存周转率') { // 投入产出比需要,库存周转率不需要单位
                return val;
            } else {
                let Tenthousand = parseInt(val / 10000);
                if (Tenthousand >= 1) {
                    return parseInt(val / 10000) + 'w';
                } else {
                    return parseInt(val);
                }
            }

            // return parseInt(val / 10000 / 100); // 金额从分转换为万
        },
        renderChart (data) {
            var _this = this;
            // console.log(111);
            const { real, target, timeLabels, subject_name } = data;
            // console.log(timeLabels);
            const diff = [];
            var realItem, targetItem;
            const bottom = [];
            const underTarget = [];
            const realClone = _.cloneDeep(real);
            const targetClone = _.cloneDeep(target);
            for (let i = 0; i < realClone.length; i++) {
                if (subject_name == '投入产出比' || subject_name == '库存周转率') {
                    realItem = realClone[i];
                    targetItem = targetClone[i];
                } else {
                    realClone[i] = parseInt(realClone[i] / 100);
                    targetClone[i] = parseInt(targetClone[i] / 100);
                    realItem = realClone[i];
                    targetItem = targetClone[i];
                }

                // realClone[i] = -20;
                // const realItem = realClone[i];
                // targetClone[i] = 30;
                // const targetItem = targetClone[i];

                if (realItem < 0 && targetItem < 0) {
                    bottom.push(realItem < targetItem ? targetItem : realItem);
                    diff.push(-Math.abs(realItem - targetItem));
                } else if (realItem > 0 && targetItem > 0) {
                    bottom.push(realItem < targetItem ? realItem : targetItem);
                    diff.push(Math.abs(realItem - targetItem));
                }

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
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    },
                    formatter: function (params) {
                        var result = params[0].axisValue + "<br />";
                        params.forEach(function (item) {
                            if (item.seriesIndex != 2) {
                                result += item.marker + " " + item.seriesName + " : " + item.value + "</br>";
                            }
                        });
                        return result;
                    },

                },
                color: ['#fcb448', '#318cb8', '#b12725'],
                legend: {
                    data: ['目标', '实际'],
                    left: 'right',
                    show: true,
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
                    // type: 'value',
                    // data: value
                    axisLabel: {
                        formatter: function (val) {
                            return _this.calculateToShow(val);
                        }
                    }
                },
                series: [
                    {
                        data: realClone,
                        name: '实际',
                        type: 'line',
                        lineStyle: {
                            color: '#fcb448',
                            type: 'solid',
                            width: 2
                        }
                    },
                    {
                        name: '目标',
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
                        name: '差异',
                        type: 'bar',
                        stack: 1,
                        itemStyle: {
                            color: function (params) {
                                return -1 == underTarget.indexOf(params.dataIndex) ? '#318cb8' : '#b12725';
                            }
                        },
                    }
                ]
            };
            this.chart.setOption(options);

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

