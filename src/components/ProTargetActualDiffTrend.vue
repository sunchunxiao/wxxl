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
            let realItem, targetItem;
            // goodBottom badBottom 正负差异辅助柱子
            // transparentBottom 透明辅助柱子
            // good bad 正负差异
            const good = [], goodBottom = [], bad = [], badBottom = [], transparentBottom = [];
            const realClone = _.cloneDeep(real);
            const targetClone = _.cloneDeep(target);
            for (let i = 0;i < hasTarget.length;i++) {
                // value值转换为元
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
                if (realItem >=0 && targetItem >= 0) {
                    if (realItem >= targetItem) {
                        // timeLabels[i]为x轴的name,锁定位置
                        good.push([timeLabels[i],realItem - targetItem]);
                        transparentBottom.push([timeLabels[i],targetItem]);
                    } else if (realItem < targetItem) {
                        bad.push([timeLabels[i],targetItem - realItem]);
                        transparentBottom.push([timeLabels[i],realItem]);
                    }
                } else if (realItem > 0 && targetItem < 0) {
                    good.push([timeLabels[i], realItem]);
                    goodBottom.push([timeLabels[i], targetItem]);
                } else if (targetItem > 0 && realItem < 0) {
                    bad.push([timeLabels[i], targetItem]);
                    badBottom.push([timeLabels[i], realItem]);
                } else if (realItem < 0 && targetItem < 0) {
                    if (realItem >= targetItem) {
                        transparentBottom.push([timeLabels[i],realItem]);
                        good.push([timeLabels[i],targetItem - realItem]);
                    } else {
                        transparentBottom.push([timeLabels[i],targetItem]);
                        bad.push([timeLabels[i],realItem - targetItem]);
                    }
                }
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
                    right: '300',
                    top: '-2%'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    },
                    formatter: function (params) {
                        let result = params[0].axisValue + "<br />";
                        const hasTarget = params[0].data.hasTarget;
                        params.forEach(function (item) {
                            // console.log(item,item.seriesIndex);
                            let value = _this.formatNumber(item.value);
                            if (Array.isArray(value)) {
                                value = value[value.length - 1];
                            }
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
                color: ['#26A6D7', '#Fcb448','#01B8AA','#FD625E'],//折线颜色 #Fcb448黄色
                legend: {
                    color: ['#26A6D7', '#Fcb448','#01B8AA','#FD625E'],//折线颜色 #Fcb448黄色
                    data: ['目标', '实际','正差异','负差异'],
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
                        symbol: "none"
                    },
                    {
                        data: realClone,
                        name: '实际',
                        type: 'line',
                        symbol: "none",
                        lineStyle: {
                            color: '#fcb448',
                            type: 'solid',
                            width: 2
                        }
                    },
                    // transparentBottom
                    {
                        type: 'bar',
                        stack: 1,
                        barMaxWidth: 20,
                        itemStyle: {
                            color: "transparent"
                        },
                        data: transparentBottom
                    },
                    // goodBottom
                    {
                        name: "正差异",
                        type: 'bar',
                        stack: 1,
                        barMaxWidth: 20,
                        itemStyle: {
                            color: "#01B8AA"
                        },
                        data: goodBottom
                    },
                    // good
                    {
                        name: "正差异",
                        type: 'bar',
                        stack: 1,
                        barMaxWidth: 20,
                        itemStyle: {
                            color: "#01B8AA"
                        },
                        data: good
                    },
                    // badBottom
                    {
                        name: "负差异",
                        type: 'bar',
                        stack: 1,
                        barMaxWidth: 20,
                        itemStyle: {
                            color: "#FD625E"
                        },
                        data: badBottom
                    },
                    // bad
                    {
                        name: "负差异",
                        type: 'bar',
                        stack: 1,
                        barMaxWidth: 20,
                        itemStyle: {
                            color: "#FD625E"
                        },
                        data: bad
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
    width: 100%;
  .bar {
    width: 100%;
    height: 260px;
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

