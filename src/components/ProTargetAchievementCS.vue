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
        <p :class="['value', {'no-set':targetObj.value =='未设定'}]">{{ targetObj.value }} <span class="unit">{{ targetObj.unit }}</span></p>
        <p
          class="value"
          :style="{color: color}">
          <span>{{ realObj.value }} </span>
          <span
            :style="{color: color}"
            class="unit">{{ realObj.unit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { formatNumber, labelNewline } from 'utils/common';
//ROI投入产出比 SKU数量 店铺数量SHP,消费者数量PER,冗余值RY 库存周转率 GPM毛利率 QPR品质合格率 CTR资金周转率 FAO固定资产占用率 LA库龄 PS盈利空间 PA盈利能力 PO支付能力1 PT支付能力2 DAR交期达成率 PSR产供比 CP产能 CS产能安全值 DR残品率
const SUBJECT = ['ITO', 'ROI', 'SKU', 'PER', 'SHP', 'RY', 'POR', 'NIR', 'CTR', 'GR', 'GPM', 'CGR', 'QPR', 'PS','FAO', 'LA','PA','PO','PT','DN','DAR','PSR','CP','CS','DR','IN','RMIN','CIN','OIN','SIN','RGIN','PGIN'];
const REVERSE_target = ['C', 'SA','DR']; // C成本 SA库存额 DR残品率是反向指标
const DIVIDESUBJECT = ['RY', 'PA'];

// const MAIN_SUNBJECT = 1;
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
        realObj() {
            const { real } = this.data;
            return this.calculateToShow(real);
        },
        targetObj() {
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
        //数据为金额统一换算
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
            //目标值为null,是未设定,为数值显示数值(0显示0)
            let obj = {
                value: "",
                unit: ""
            };
            if (val == null) {
                obj.value = "未设定";
            } else {
                if (_.includes(SUBJECT, subject)) {
                    //首页六项效率各个冗余值单位不同
                    if (this.data.divide && _.includes(DIVIDESUBJECT, subject)) {
                        obj = this.divide(val);
                    } else {
                        if ((val / 10000) >= 1) {
                            obj.value = (val / 10000).toFixed(2);
                            obj.unit = " 万";
                        } else {
                            obj.value = val;
                        }
                    }
                } else {
                    obj = this.divide(val);
                }
            }
            obj.value = this.formatNumber(obj.value);
            return obj;
        },
        renderChart(data) {
            let  _this = this;
            const { subject, subject_name, progress, real, target } = data;
            let valuePercent, realValue, toolTipValue, fontSize, valueOutside, valueLeft1,valueOutside1,colorInside,colorM;
            // let realC = _.clone(real),target = _.clone(target);
            // realC = '30';
            // target = '-23<x<20';
            // console.log(real,target);

            if (progress == null || progress < 0) {//目标未设定或者进度为负值
                if (!target) {
                    realValue = this.calculateToShow(real).value.toString();
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
            let radiusInside, radiusOutside, center,radiusOutside1,color,valueLeft,colorinclude,safe;
            radiusInside = ['62', '68']; //内环大小
            radiusOutside = ['70', '76']; //外环大小
            center = ['50%', '50%'];
            colorInside = '';

            if (data.subject == 'CS') {
                radiusOutside1 = ['78', '84']; //外环大小
                let min = target.split('<')[0];
                let max = target.split('<')[2];
                if(Number(real)< Number(min)) {
                    valuePercent = 85;
                    colorInside = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;
                    colorinclude = colorInside;
                    safe = 'unsafe';
                } else if(real>min && real<max){
                    valuePercent = 185;
                    colorInside = '#E0E3E9';
                    colorM = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;
                    colorinclude = colorM;
                    safe = 'safe';
                } else {
                    valuePercent = 205;
                    valueOutside1 = 85;
                    // colorinclude = '#FD625E';
                    colorM = valuePercent <= 100 ? COLORMAP.below : COLORMAP.over;
                    colorinclude = colorM;
                    safe = 'unsafe';
                    // colorInside = 'green';
                }
            } else {
                radiusOutside1 = 0;
                colorInside = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;
                colorinclude = colorInside;
            }
            // colorM = valuePercent >= 100 ? COLORMAP.below : COLORMAP.over;
            // console.log(999999,valuePercent);

            // 反向指标 颜色需要相反
            if (_.includes(REVERSE_target, subject)) {
                color = valuePercent >= 100 ? COLORMAP.over : COLORMAP.below;
            }
            this.color = color;
            //内环
            valueLeft = valuePercent >= 100 ? 0 : 100 - valuePercent;
            //外环
            if (valuePercent > 100) {
                valueOutside = valuePercent - 100;
                valueLeft1 = valueOutside > 100 ? 0 : 100 - valueOutside;
            } else {
                //小于100%均为双环，显示灰色
                valueOutside = 0;
                valueLeft1 = valueOutside > 100 ? 0 : 100 - valueOutside;
            }
            // console.log(valueLeft, valueOutside, valueLeft1);

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
                    hideDelay: 0,
                    trigger: 'item',
                    formatter: function(params) {
                        let result = [];
                        let span = "<span style='width:20px;display:inline-block;'></span>";
                        if (!progress) {
                            result += params.marker + " " + labelNewline(9,params.name,"</br>" + span) + " : </br>" + span + _this.formatNumber(toolTipValue) + "</br>";
                        } else {
                            result += params.marker + " " + labelNewline(9,params.name,"</br>" + span) + " : </br>" + span + params.value + '%' + "</br>";
                        }
                        return result;
                    },
                    position: function (point, params, dom) {
                        dom.style.transform = "translate(-50%, 0%)";
                        return ["50%", "50%"];
                    }
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    containLabel: true
                },
                series: [
                    {
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
                        color:colorLeft,
                        data: [{
                            value: valuePercent,
                            name: subject_name,
                            itemStyle: {
                                normal: {
                                    color: colorInside,
                                }
                            },
                            label: {
                                normal: {
                                    formatter: function(data) {
                                        //progress为null时显示实际值,0和数值都显示百分比
                                        if (progress == null || progress < 0) {
                                            return '-';
                                        } else if(subject =='CS') {
                                            let str = "";
                                            let safeSize,unSafeSize;
                                            safeSize = "safeSize";
                                            unSafeSize = "unpercentSize";
                                            if(safe=='safe'){
                                                return str+ `{${safeSize}|安全}`;
                                            } else {
                                                return str+ `{${unSafeSize}|不安全}`;
                                            }
                                            // return '';
                                        } else {
                                            if (data.value == null) {
                                                return '';
                                            }
                                            let str = "";
                                            let valueStyle, percentStyle;
                                            valueStyle = "valueSize" ;
                                            percentStyle = "percentSize";
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
                                        safeSize: {
                                            fontSize: 22,
                                            padding: [-8,0,0,5],
                                            color:'#01B8AA',
                                            verticalAlign: "bottom"
                                        },
                                        unSafeSize: {
                                            fontSize: 20,
                                            color:'#FD625E',
                                            padding: [-8,0,0,5],
                                            verticalAlign: "bottom"
                                        },
                                        valueSize: {
                                            padding: [-10,0,0,5],
                                            fontSize: 40
                                        },
                                    },
                                    textStyle: {
                                        fontSize: fontSize,
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
                                    color: colorM,
                                }
                            },
                            label: {
                                normal: {
                                    formatter: function(data) {
                                    // let isMain = (is_main == MAIN_SUNBJECT );
                                        if(data.name.length < 8){//显示字体过长换行显示
                                            return `{valueSize|${data.name}}`;
                                        } else {
                                            let str = data.name.slice(0, 5);
                                            let str2 = data.name.slice(5, data.name.length);
                                            return `{line|${str}}\n{line2|${str2}}`;
                                        }
                                    },
                                    rich: {
                                        line: {
                                            fontSize: FONTSIZE2,
                                            color: '#4d4d4d',
                                            padding:[-5,0,0,0]
                                        },
                                        line2: {
                                            fontSize: FONTSIZE2,
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
                                            fontSize: FONTSIZE2,
                                            padding: [-15,0,0,0]
                                        }
                                    },
                                    textStyle: {
                                        fontSize: FONTSIZE2,
                                        color: '#4d4d4d'
                                    },
                                    position: 'center',
                                    padding: [10, 0, 0, 0]
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
                            itemStyle: {
                                emphasis: {
                                    color: colorinclude
                                },
                                normal: {
                                    color: colorinclude
                                }
                            }
                        }, {
                            value: valueLeft1,
                            itemStyle: placeHolderStyle
                        }
                        ]
                    },
                    {
                        name: 'Line 3',
                        type: 'pie',
                        center: center,
                        radius: radiusOutside1,
                        tooltip: {
                            show: false
                        },
                        label: {
                            normal: {
                                position: 'center'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: colorM,
                            }
                        },
                        hoverAnimation: false,
                        data: [{
                            value: valueOutside1,
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

<style lang="scss">
.pie-container {
    width: 100%;
    .pie {
        width: 100%;
        height: 170px;
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
