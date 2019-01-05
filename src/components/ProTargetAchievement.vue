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
import { formatNumber } from 'utils/common';
//ROI投入产出比 SKU数量 店铺数量SHP,消费者数量PER,冗余值RY 库存周转率 NIR净利率 CTR资金周转率
const SUBJECT = ['ITO','ROI','SKU','PER','SHP','RY','POR','NIR','CTR'];
const REVERSE_TARGET = ['C', 'SA']; // 成本 库存额 是反向指标
const MAIN_SUNBJECT = ['S', 'P','C', 'ROI', 'ITO', 'PP'];//PP净利润率
const COLORMAP = { over: '#FD625E', below: '#01B8AA' }; // #FD625E粉红色
const colorLeft = '#E0E3E9';
const FONTSIZE1 = 28;
const FONTSIZE3 = 22;
const FONTSIZE2 = 15;
const FONTWEIGHT = 600;
const maxLength = 6;

export default {
    props: {
        id: String,
        data: Object,
    },
    data() {
        return {
            color: '#000',
            formatNumber: formatNumber
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
            if (val == null) {
                return "未设定";
            } else {
                if (_.includes(SUBJECT, subject)) {
                    if ((val / 10000) >= 1) {
                        return (val / 10000).toFixed(2) + 'w';
                    } else {
                        return val;
                    }
                }
                let tenThousand = val / 10000 / 100;
                if (tenThousand / 10000 >= 1) {
                    return (val / 10000 / 10000 / 100).toFixed(2) + '亿';
                } else if (tenThousand >= 1 || tenThousand <= -1) {
                    return (val / 10000 / 100).toFixed(2) + 'w';
                } else if (tenThousand < 1 && tenThousand > 0) {
                    return (val / 100).toFixed(2);
                } else {
                    return val;
                }
            }
        },
        renderChart(data) {
            let  _this = this;
            const { subject, subject_name, progress, real, target } = data;
            let valuePercent, realValue, toolTipValue, fontSize, valueOutside, valueLeft1;
            if (progress == null || progress < 0) {//目标未设定或者进度为负值
                if (!target) {
                    realValue = this.calculateToShow(real).toString();
                    if (_.includes(SUBJECT, subject)) { //tooltip显示每三位,分隔
                        toolTipValue = real;
                    } else {
                        toolTipValue = (real / 100).toFixed(2);
                    }
                    if (realValue.length >= maxLength) {//无百分比显示实际值 超过圆环时 字体变小
                        fontSize = FONTSIZE3;
                    } else {
                        fontSize = FONTSIZE1;
                    }
                }
                valuePercent = null;
            } else {//目标设定
                valuePercent = (progress * 100).toFixed(0);
                fontSize = FONTSIZE1;//显示百分比的数据字体大小都为FONTSIZE1
            }
            let radiusInside, radiusOutside, center;
            if (_.includes(MAIN_SUNBJECT, subject)) {
                radiusInside = ['67', '73'];  //内环大小
                radiusOutside = ['75', '81']; //外环大小
                center = ['50%', '50%'];
            } else {
                radiusInside = ['55', '61'];
                radiusOutside = ['63', '68'];
                center = ['50%', '60%'];
            }
            let color = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;

            // 反向指标 颜色需要相反
            if (_.includes(REVERSE_TARGET, subject)) {
                color = valuePercent >= 100 ? COLORMAP.over : COLORMAP.below;
            }
            this.color = color;
            //内环
            const valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
            //外环
            if (valuePercent > 100) {
                valueOutside = valuePercent - 100;
                valueLeft1 = valueOutside > 100 ? 0 : 100 - valueOutside;
                // console.log(valueLeft, valueOutside, valueLeft1);
            }
            let placeHolderStyle = {
                normal: {
                    color: colorLeft,//未完成的圆环的颜色
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: colorLeft//未完成的圆环的颜色
                }
            };
            const options = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'item',
                    formatter: function(params){
                        let result = [];
                        if (!progress) {
                            result += params.marker + " " + params.name + " : " + _this.formatNumber(toolTipValue) + "</br>";
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
                    radius: radiusInside,
                    center: center,
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
                                    if (progress == null || progress < 0) {
                                        return '-';
                                    } else {
                                        if(data.value == null){
                                            return '';
                                        }
                                        return data.value + "%";
                                    }
                                },
                                textStyle: {
                                    fontSize: fontSize,
                                    color: '#4d4d4d',
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
                                formatter: function(data) {
                                    // if (progress == null || progress < 0) {
                                    //     return '-';
                                    // }else{
                                    if(data.name.length < 8){//显示字体过长换行显示
                                        return data.name;
                                    }else{
                                        return data.name = data.name.slice(0, 4) + '\n' + data.name.slice(4, data.name.length);
                                    }
                                    // }
                                },
                                textStyle: {
                                    fontSize: FONTSIZE2,
                                    fontWeight: FONTWEIGHT,
                                    color: '#4d4d4d'
                                },
                                position: 'center'
                            },

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
                },
                {
                    name: 'Line 2',
                    type: 'pie',
                    center: center,
                    radius: radiusOutside,
                    tooltip: {
                        show: false
                    },
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    // itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                        value: valueOutside,
                        // name: '02',
                        itemStyle: {
                            emphasis: {
                                color: color
                            },
                            normal: {
                                color: color
                            }
                        }
                    }, {
                        value: valueLeft1,
                        // name: 'invisible',
                        itemStyle: placeHolderStyle
                    }
                    ]
                },
                ]
            };
            this.chart.setOption(options);
        }
    }
};
</script>

<style lang="scss" scoped>
.pie-container {
    width: 100%;
    .pie {
        width: 198px;
        height: 198px;
        // margin: 0 auto;
    }
    .detail {
        width: 60%;
        margin: 0 auto;
        text-align: left;
        .value {
            font-size: 120%;
        }
    }
}

</style>
