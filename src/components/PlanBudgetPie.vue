<template>
  <div class="pie-container">
    <div
      class="pie echart"
      :id="`pie-${id}`" />
    <div class="detail">
      <div>
        <p class="text">目标 : </p>
        <p class="text">实际 : </p>
      </div>
      <div>
        <p :class="['value', {'no-set':target.value =='未设定'}]">
          {{ target.value }}
          <span class="unit">{{ target.unit }}</span>
        </p>
        <p
          class="value"
          :style="{color: color}">
          <span>{{ real.value }} </span>
          <span
            :style="{color: color}"
            class="unit">{{ real.unit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { formatNumber } from 'utils/common';

const SUBJECT = ['KS'];//款数
const COLORMAP = { over: '#FD625E', below: '#01B8AA' };
const COLORLEFT = '#E0E3E9';//未完成的圆环的颜色
const FONTSIZE28 = 28;
const FONTSIZE15 = 15;
const FONTSIZE22 = 22;
const MAXLENGTH = 6;

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
        divide(val) {
            let obj = {
                value: "",
                unit: ""
            };
            let tenThousand = val / 10000 / 100;
            if (tenThousand / 10000 >= 1) {
                obj.value = (val / 10000 / 10000 / 100).toFixed(2);
                obj.unit = "亿";
            } else if (tenThousand >= 1 || tenThousand <= -1) {
                obj.value = (val / 10000 / 100).toFixed(2);
                obj.unit = "万";
            } else if (tenThousand < 1 && tenThousand > 0) {
                obj.value = (val / 100).toFixed(2);
            } else {
                obj.value = val;
            }
            return obj;
        },
        calculateToShow(val) {
            const { subject } = this.data;
            let obj = {
                value: "",
                unit: ""
            };
            if (val == null) {
                obj.value = "未设定";
            } else {
                if (_.includes(SUBJECT, subject)) {
                    if ((val / 10000) >= 1) {
                        obj.value = (val / 10000).toFixed(2);
                        obj.unit = " 万";
                    } else {
                        obj.value = val;
                    }
                } else {
                    obj = this.divide(val);
                }
            }
            obj.value = this.formatNumber(obj.value);
            return obj;
        },
        renderChart(data) {
            const { subject_name, progress, real, target } = data;
            let valuePercent, realValue, fontSize, valueOutside, valueLeft1;
            //目标未设定或者进度为负值
            if (progress == null || progress < 0) {
                if (!target) {
                    realValue = this.calculateToShow(real).value.toString();
                    if (realValue.length >= MAXLENGTH) {
                        fontSize = FONTSIZE22;
                    } else {
                        fontSize = FONTSIZE28;
                    }
                }
                valuePercent = null;
            } else {
                //目标设定
                valuePercent = (progress * 100).toFixed(0);
                fontSize = FONTSIZE28;
            }
            this.color = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;
            //内环
            const valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
            //外环
            if (valuePercent > 100) {
                valueOutside = valuePercent - 100;
                valueLeft1 = valueOutside > 100 ? 0 : 100 - valueOutside;
            }
            const options = {
                backgroundColor: '#fff',
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                series: [{
                    name:'目标达成情况',
                    type: 'pie',
                    radius: ['60', '80'],
                    center: ['50%', '56.5%'],
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
                                color:this.id.indexOf("plan") != -1?"#2AE09E":"#FCD5B4"
                            }
                        },
                        label: {
                            normal: {
                                formatter: function(data) {
                                    //progress为null时显示实际值,0和数值都显示百分比
                                    if (progress == null || progress < 0) {
                                        return '-';
                                    } else {
                                        if (data.value == null) {
                                            return '';
                                        }
                                        let str = "";
                                        let valueStyle, percentStyle;
                                        valueStyle = "smallSize";
                                        percentStyle = "smallPercentSize";
                                        for (let i of data.value.split("")) {
                                            str += `{${valueStyle}|${i}}`;
                                        }
                                        return str + `{${percentStyle}|%}`;
                                    }
                                },
                                rich: {
                                    percentSize: {
                                        fontSize: 19,
                                        padding: [-8,0,0,5],
                                        verticalAlign: "bottom"
                                    },
                                    smallPercentSize: {
                                        fontSize: 14,
                                        padding: [-17,0,0,3],
                                        verticalAlign: "bottom"
                                    },
                                    valueSize: {
                                        padding: [-10,0,0,5],
                                        fontSize: 40
                                    },
                                    smallSize: {
                                        fontSize: 34,
                                        padding: [-20,0,0,3]
                                    }
                                },
                                textStyle: {
                                    fontSize: fontSize,
                                    color: this.color,
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
                                color: COLORLEFT,
                            }
                        },
                        label: {
                            normal: {
                                formatter: function(data) {
                                    if(data.name.length < 8){
                                        //显示字体过长换行显示
                                        return `{valueSize|${data.name}}`;
                                    }else {
                                        let str = data.name.slice(0, 5);
                                        let str2 = data.name.slice(5, data.name.length);
                                        return `{line|${str}}\n{line2|${str2}}`;
                                    }
                                },
                                rich: {
                                    line: {
                                        fontSize: FONTSIZE15,
                                        color: '#4d4d4d',
                                        padding:[-5,0,0,0]
                                    },
                                    line2: {
                                        fontSize: FONTSIZE15,
                                        color: '#4d4d4d',
                                        padding:[-40,0,0,0]
                                    },
                                    smallLine: {
                                        fontSize: 13,
                                        color: '#4d4d4d',
                                        padding: [-10,0,0,0]
                                    },
                                    smallLine2: {
                                        fontSize: 13,
                                        color: '#4d4d4d',
                                        padding: [-40,0,0,0]
                                    },
                                    smallSize: {
                                        color: '#4d4d4d',
                                        fontSize: 13,
                                        padding: [-15,0,0,0]
                                    },
                                    valueSize: {
                                        color: '#4d4d4d',
                                        fontSize: FONTSIZE15,
                                        padding: [-15,0,0,0]
                                    }
                                },
                                textStyle: {
                                    fontSize: FONTSIZE15,
                                    color: '#4d4d4d'
                                },
                                position: 'center',
                                padding: [10, 0, 0, 0]
                            },

                        }
                    },
                    {
                        value: 0,
                        name: '',
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: COLORLEFT,
                            }
                        },
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: FONTSIZE15,
                                    fontWeight: 600,
                                    color: '#000',
                                }
                            }
                        }
                    },
                    ]
                },
                {
                    name: '目标达成情况',
                    type: 'pie',
                    center: ['50%', '56.5%'],
                    radius: ['60', '80'],
                    tooltip: {
                        show: false
                    },
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    hoverAnimation: false,
                    data: [{
                        value: valueOutside,
                        itemStyle: {
                            emphasis: {
                                color: this.color
                            },
                            normal: {
                                color: this.color
                            }
                        }
                    }, {
                        value: valueLeft1,
                        itemStyle: {
                            normal: {
                                color: COLORLEFT,
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: COLORLEFT
                            }
                        }
                    }]
                },
                ]
            };
            this.chart.setOption(options);
        }
    }
};
</script>

<style lang="scss">
.pie-container {
    width: 100%;
    .pie {
        width: 100%;
        height: 198px;
        >div{
            margin: 0 auto !important;
        }
    }
    .detail {
        display: flex;
        justify-content: center;
        .text {
            line-height: 23px;
            font-size: 12px;
            padding-right: 10px;
            text-align: right;
        }
        .value {
            text-align: left;
            font-size: 20px;
            height: 22px;
            line-height: 22px;
            &.no-set {
                font-size: 16px;
            }
            .unit {
                font-size: 12px;
            }
        }
    }
}

</style>
