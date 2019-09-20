<template>
  <div class="averagebar-container">
    <div
      class="averagebar echart"
      :style="{height: heightValue}"
      :id="`averagebar-${id}`" />
      <!-- <div class="detail">{{ data.subject_name }}</div> -->
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { formatNumber } from 'utils/common';
// const SUBJECT = ['ROI','POR','ITO','RY'];
export default {
    props: {
        id: String,
        data: Array,
        height: {
            type: String,
            default: "415px"
        },
        unit: {
            type: String,
            default: ""
        }
    },
    data(){
        return {
            val: [],
            color: [],
            formatNumber: formatNumber,
            debounce: null,
        };
    },
    computed: {
        heightValue() {
            if (!this.data) {
                return this.height;
            }
            if (this.height.includes("px")) {
                if ((this.data.length * 35) > parseInt(this.height)) {
                    return this.data.length * 35 + "px";
                }
            }
            return this.height;
        }
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`averagebar-${this.id}`));
        this.renderChart(this.data);
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener('resize', this.debounce);
        // let _this = this;
        // this.chart.on('click', function(params) {
        //     const select_id = params.seriesId.split(",");
        //     const id = select_id[params.dataIndex];
        //     _this.$emit('id', id);
        // });
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.debounce);
    },
    watch: {
        data: {
            handler: function(val) {
                this.renderChart(val);
            },
            deep: true
        },
        heightValue() {
            this.$nextTick(() => {
                this.renderChart(this.data);
                this.chart.resize();
            });
        },
    },
    methods: {
        renderChart(data) {
            let arrName = [],org_id = [],score = [];
            for(let i of data) {
                arrName.push(i.name);
                org_id.push(i.org_id);
                score.push({ value:i.score });
            }
            score = _.sortBy(score, function(item) {
                return item.value;
            });
            const options = {
                tooltip : {
                    // trigger: 'axis',
                    axisPointer : { // 坐标轴指示器，坐标轴触发有效
                        type : 'none' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function(params) {
                        let seriesName = params.seriesName.split(',');
                        return seriesName[params.dataIndex]+' '+params.data.value+'分';
                    },
                    position: function (point) {
                        return ["50%", point[1] + 25];
                    }
                },
                grid: {
                    right: 50,
                    bottom: 5,
                    top: 20,
                    left: "20%",
                    containLabel: true
                },
                xAxis: {
                    inverse: false,
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                },
                yAxis: {
                    z: 3,
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        fontSize: 14,
                        // formatter: function(value) {
                        //     return 111;
                        // }
                    }
                },
                series: [{
                    type: 'bar',
                    name:arrName,
                    barMaxWidth: 35,
                    itemStyle: {
                        color: function(params) {
                            if (params.value>=85) {
                                return 'rgb(150,206,93)';
                            } else if (params.value>=60 && params.value<85) {
                                return 'rgb(255,199,75)';
                            } else if (params.value <60 ) {
                                return 'rgb(234,75,75)';
                            } else {
                                return '#b3b3b3';
                            }
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            // color: "rgba(6,255,2,1)"
                        }
                    },
                    label: {
                        fontSize: 14,
                        show: true,
                        position: 'insideLeft',
                        color: "#000",
                        formatter: function(params) {
                            let seriesName = params.seriesName.split(',');
                            return seriesName[params.dataIndex]+' '+params.data.value+'分';
                        },
                    },
                    id: org_id,
                    data: score,
                }]
            };
            this.chart.setOption(options, true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .averagebar-container {
        .averagebar {
            width: 100%;
            margin: 0 auto;
        }
        .detail {
            text-align: center;
            color: #5e5e5e;
            font-size: 15px;
            padding: 20px;
            font-weight: 500;
        }
    }
</style>
