<template>
  <div class="bar-container">
    <div
      class="bar"
      :id="`bar-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { formatNumber } from 'utils/common';
//ROI投入产出比 SKU数量 店铺数量SHP,消费者数量PER,冗余值RY 库存周转率
const SUBJECT = ['ITO','ROI','SKU','PER','SHP','RY','POR','NIR','CTR'];
export default {
    props: {
        id: String,
        data: Object,
    },
    data () {
        return {
            arr: '',
            debounce: null,
            formatNumber: formatNumber
        };
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
    watch: {
        data: {
            handler: function (val) {
                this.renderChart(val);
            },
            deep: true
        },
    },
    methods: {
        calculateToShow (val) {
            const { subject } = this.data;
            if (_.includes(SUBJECT, subject)){//显示原值超过万显示w
                if ((val / 10000) >= 1) {
                    return parseInt(val / 10000) + 'w';
                } else {
                    return val;
                }
            }
            let tenThousand = parseInt(val / 10000);
            if (tenThousand >= 1 || tenThousand <= -1) {
                return parseInt(val / 10000) + 'w';
            } else {
                return parseInt(val);
            }
        },
        renderChart (data) {
            let _this = this;
            const { real, target, timeLabels,subject,hasTarget } = data;
            let arr = [];
            const diff = [];
            let realItem, targetItem;
            const bottom = [];
            const under = [];
            const underTarget = [];
            const realClone = _.cloneDeep(real);
            const targetClone = _.cloneDeep(target);
            for (let i = 0;i < hasTarget.length;i++){
                //POR人员冗余
                if (_.includes(SUBJECT,subject)) {
                    arr.push({
                        value: targetClone[i],
                        hasTarget: hasTarget[i]
                    });
                } else {
                    realClone[i] = parseInt(realClone[i] / 100);
                    arr.push({
                        value: parseInt(targetClone[i] / 100),
                        hasTarget: hasTarget[i]
                    });
                }
                realItem = realClone[i];
                targetItem = arr[i].value;

                if (realItem < 0 && targetItem < 0) {
                    bottom.push(realItem < targetItem ? targetItem : realItem);
                    if (_.isInteger(realItem - targetItem)){
                        diff.push(-Math.abs(realItem - targetItem));
                    } else {
                        diff.push(-Math.abs(realItem - targetItem).toFixed(2));
                    }
                } else if (realItem >= 0 && targetItem >= 0) {
                    bottom.push(realItem < targetItem ? realItem : targetItem);
                    if (_.isInteger(realItem - targetItem)) {
                        diff.push(Math.abs(realItem - targetItem));
                    } else {
                        diff.push(Math.abs(realItem - targetItem).toFixed(2));
                    }
                } else {
                    if (realItem > 0 || targetItem > 0) {
                        bottom.push(realItem);
                    }
                    if( targetItem < 0 || realItem < 0) {
                        under.push(targetItem);
                    }
                }
                realItem < targetItem && underTarget.push(i);
            }
            const options = {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: 40,
                    containLabel: true
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : { show: true },
                        dataView : { show: true, readOnly: false },
                        magicType : { show: true, type: ['line', 'bar'] },
                        restore : { show: true },
                        saveAsImage : { show: true }
                    },
                    right: '150',
                    top: '-5%'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    },
                    position: function(pos){ // point: 鼠标位置
                        return { left: pos[0] - 80, top: pos[1] };
                    },
                    formatter: function (params) {
                        let result = params[0].axisValue + "<br />";
                        const hasTarget = params[0].data.hasTarget;
                        params.forEach(function (item) {
                            const value = _this.formatNumber(item.value);
                            if (hasTarget==0){
                                if (item.seriesIndex != 2&&item.seriesIndex != 3) {
                                    if (item.seriesIndex == 0) {//目标
                                        result += item.marker + " " + item.seriesName + " : " + '未设定' + "</br>";
                                    } else {
                                        result += item.marker + " " + item.seriesName + " : " + value + "</br>";
                                    }
                                }
                            } else {
                                if (item.seriesIndex != 2) {
                                    result += item.marker + " " + item.seriesName + " : " + value + "</br>";
                                }
                            }
                        });
                        return result;
                    },
                },
                color: ['#318cb8', '#fcb448', '#b12725'],
                legend: {
                    data: ['目标', '实际'],
                    left: 'right',
                    show: true,
                },
                xAxis: {
                    type: 'category',
                    data: timeLabels
                },
                yAxis: {
                    axisLabel: {
                        formatter: function (val) {
                            return _this.calculateToShow(val);
                        }
                    }
                },
                series: [
                    {
                        name: '目标',
                        data: arr,
                        type: 'line',
                    },
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
                        data: bottom,
                        type: 'bar',
                        stack: 1,
                        barWidth: 8,
                        itemStyle: {
                            color: function (params) {
                                if (under.length) {
                                    return -1 == underTarget.indexOf(params.dataIndex) ? '#318cb8' : '#b12725';
                                } else {
                                    return 'rgba(255,255,255,0)';
                                }
                            }
                        },
                    },
                    {
                        name: '负值显示',
                        type: 'bar',
                        stack: 1,
                        barWidth: 8,
                        itemStyle: {
                            color: function (params) {
                                return -1 == underTarget.indexOf(params.dataIndex) ? '#318cb8' : '#b12725';
                            }
                        },
                        data: under
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

