<template>
  <div class="pie-container">
    <div
      class="pie"
      :id="`pie-${id}`" />
    <div class="detail">
      <span class="text">目标: </span>
      <span class="value">{{ target }}</span>
    </div>
    <div class="detail">
      <span class="text">实际: </span>
      <span
        class="value"
        :style="{color: color}">{{ real }}</span>
    </div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';

//ROI投入产出比 SKU数量 店铺数量SHP,消费者数量PER,冗余值RY 库存周转率
const SUBJECT = ['ITO','ROI','SKU','PER','SHP','RY','POR'];
const REVERSE_TARGET = ['C', 'SA']; // 成本 库存额 是反向指标
const COLORMAP = { over: '#b12725', below: '#308db9' };
const colorLeft = '#E0E3E9';
const FONTSIZE1 = 28;
const FONTSIZE2 = 15;
const FONTWEIGHT = 600;

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
            //目标值为null,是未设定,为数值显示数值(0显示0)
            if (val === null){
                return "未设定";
            } else {
                if (_.includes(SUBJECT, subject)){
                    return val;
                }
                let Tenthousand = val / 10000 / 100;
                if (Tenthousand >= 1){
                    return (val / 10000 / 100).toFixed(2)+'w';
                } else if (Tenthousand < 1 && Tenthousand > 0){
                    return (val / 100).toFixed(2);
                }else{
                    return val;
                }
            }
        },
        renderChart(data) {
            const { subject, subject_name, progress ,real } = data;
            let valuePercent;
            if (!progress){
                valuePercent = this.calculateToShow(real);
                if(valuePercent < 0){
                    valuePercent = null;
                }
            } else {
                valuePercent = (progress * 100).toFixed(0);
            }
            let color = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;
            // 反向指标 颜色需要相反
            if (_.includes(REVERSE_TARGET, subject)) {
                color = valuePercent >= 100 ? COLORMAP.over : COLORMAP.below;
            }
            this.color = color;
            const valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
            const options = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'item',
                    formatter: function(params){
                        var result = [];
                        if(params.value === null){
                            return;
                        }
                        if (!progress){
                            result += params.marker + " " + params.name + " : " + params.value + "</br>";
                        } else {
                            result += params.marker + " " + params.name + " : " + params.value + '%' + "</br>";
                        }
                        return result;
                    },
                    position: ['50%', '50%']
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                series: [{
                    type: 'pie',
                    name:'目标达成情况',
                    radius: ['56', '60'],
                    hoverAnimation: false,
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: valuePercent,
                        name: subject_name,
                        itemStyle: {
                            normal: {
                                color: color,
                            }
                        },
                        label: {
                            normal: {
                                formatter: function(data){
                                    //progress为null时显示实际值,0和数值都显示百分比
                                    if (progress === null){
                                        if(data.value === null){
                                            return '';
                                        }
                                        return data.value;
                                    } else {
                                        if(data.value === null){
                                            return '';
                                        }
                                        return data.value + "%";
                                    }
                                },
                                textStyle: {
                                    fontSize: FONTSIZE1,
                                    color: color,
                                }
                            },
                        }
                    },
                    {
                        value: valueLeft,
                        name: subject_name,
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: colorLeft,
                            }
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: FONTSIZE2,
                                    fontWeight: FONTWEIGHT,
                                    color: color
                                }
                            }
                        }
                    }, {
                        value: 0,
                        name: '',
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: colorLeft,
                            }
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: FONTSIZE2,
                                    fontWeight: FONTWEIGHT,
                                    color: '#000',
                                }
                            }
                        }
                    },
                    ]
                }]
            };
            this.chart.setOption(options);
        }
    }
};
</script>

<style lang="scss" scoped>
.pie-container {
    .pie {
        width: 140px;
        height: 140px;
        margin: 0 auto;
    }
    .detail {
        text-align: center;
        .value {
            font-size: 120%;
        }
    }
}

</style>
