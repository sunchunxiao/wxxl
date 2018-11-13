<template>
  <div class="pie-container">
    <div 
      class="pie" 
      :id="`pie-${id}`"/>
    <div class="detail">
      <span class="text">目标: </span>
      <span class="value">{{ target }}</span>
      &nbsp;<span>{{ unit }}</span>
    </div>
    <div class="detail">
      <span class="text">实际: </span>
      <span 
        class="value" 
        :style="{color: color}">{{ real }}</span>
      &nbsp;<span>{{ unit }}</span>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';

const REVERSE_TARGET = ['C', 'SA']; // 成本 库存额 是反向指标
const COLORMAP = { over: '#b12725', below: '#308db9' };
const colorLeft = '#E0E3E9';
const FONTSIZE1 = 56;
const FONTSIZE2 = 20;
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
        unit() {
            const { subject } = this.data;
            if (subject === 'ROI'||subject== 'NIR'||subject== 'CTR') { // 投入产出比 %
                return '%';
            } else if (subject === 'ITO') { // 库存周转率不需要单位
                return '';
            }
            // return 'w';
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
            if (subject === 'ROI') { // 投入产出比需要 * 100
                return parseInt(val * 100);
            } else if (subject === 'ITO') { // 库存周转率不需要单位
                return val;
            }else if (subject === 'POR') { // 库存周转率不需要单位
                return parseInt(val);
            }
            let Tenthousand = parseInt(val / 10000 / 100);
            if(Tenthousand>=1){
                return parseInt(val / 10000 / 100)+'w';
            }else{
                return parseInt(val/100);
            }
            // return parseInt(val / 10000 / 100); // 金额从分转换为万
        },
        renderChart(data) {
            const { subject, subject_name, progress } = data;
            const valuePercent = parseInt(progress * 100);
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
                    formatter: "{a} <br/>{b}: {c}%"
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
                    radius: ['100', '120'],
                    name:'目标达成情况',
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
                                    formatter: valuePercent + '%',
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
                                        width:'20px',
                                        fontSize: FONTSIZE2,
                                        fontWeight: FONTWEIGHT,
                                        color: '#5e5e5e'
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
                                        color: color,
                                    }
                                }
                            }
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
        width: 280px;
        height: 280px;
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
