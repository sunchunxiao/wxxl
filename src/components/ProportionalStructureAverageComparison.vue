<template>
  <div class="averagebar-container">
    <div
      class="averagebar"
      :id="`averagebar-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
const SUBJECT = ['ROI','POR','ITO','RY'];
export default {
    props: {
        id: String,
        data: Object,
    },
    data(){
        return {
            val:[],
            sum28:0,
            color:[]
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`averagebar-${this.id}`));
        this.renderChart(this.data);
    },
    watch: {
        data: {
            handler: function(val) {
                this.renderChart(val);
            },
            deep: true
        },
    },
    methods: {
        calculateToShow(val) {
            const { subject } = this.data;
            //日销，投入产出比和库存周转率是显示原值
            if (subject === 'SD'){//日销
                let tenThousand = (val / 10000 / 100).toFixed(2);
                if (tenThousand && tenThousand >= 1) {
                    return tenThousand + 'w';
                } else {
                    return val / 100;
                }
            } else if (subject === 'ROI') {//投入产出比
                if (val && val >= 10000) {
                    return (val / 10000).toFixed(2) + 'w';
                } else {
                    return val;
                }
            } else {
                return val;
            }

        },
        renderChart(nodes) {
            let _this = this;
            const {
                subject,
                nodes: pData
            } = nodes;
            const percentArr = [];
            const average = nodes.avg;
            this.color = nodes["28nodes"];
            for(let i in pData) {
                percentArr.push(nodes.values[i]);
            }
            const options = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function(params){
                        let result = [];
                        if (_.includes(SUBJECT, subject)){
                            params.forEach(function (item) {
                                result += item.marker + " " + item.name + " : " + item.value + "</br>";
                            });
                        } else {
                            params.forEach(function (item) {
                                result += item.marker + " " + item.name  + " : " + parseInt(item.value / 100 ) + "</br>";
                            });
                        }
                        return result;
                    },
                    position: ['50%', '50%']
                },
                grid: {
                    left: 10,
                    right: 30,
                    bottom: 5,
                    top: 20,
                    containLabel: true
                },
                xAxis: {
                    inverse: false,
                    type: 'value',
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
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
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: pData,
                    axisLabel: {
                        show: false,
                    }
                },
                series: [{
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                return _this.color[`${params.dataIndex}`] === params.dataIndex ? '#318cb8' : '#b0afad';
                            },
                            barBorderRadius: [0, 20, 20, 0],
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position:['0%', "30%"],
                            color: "#000",
                            formatter: function(params) {
                                if (!params.data || !nodes.display_rate) {
                                    return `${pData[params.dataIndex]} : ${ _this.calculateToShow(params.data)}`;
                                } else {
                                    if (nodes.total === 0) {//总和为0
                                        return `${pData[params.dataIndex]} : ${params.data}`;
                                    } else {
                                        return `${pData[params.dataIndex]} : ${(params.data / nodes.total * 100).toFixed(2)}%`;
                                    }
                                }
                            },
                        }
                    },
                    data: percentArr,
                    markLine: {
                        symbol: 'none',
                        label: {
                            formatter:function(){
                                if ( nodes.display_rate == 0){
                                    return `平均值${_this.calculateToShow(average)}`;
                                } else {
                                    if (average==0){
                                        return `平均值${average}`;
                                    } else {
                                        return `平均值${(average / nodes.total*100).toFixed(2)}%`;
                                    }
                                }
                            }
                        },
                        data: [{
                            xAxis: average,
                            itemStyle: {
                                normal: {
                                    color: '#b12725'
                                }
                            }
                        }]
                    },
                }]
            };
            this.chart.setOption(options);
        }
    }
};
</script>

<style lang="scss" scoped>
    .averagebar-container {
        .averagebar {
            width: 140px;
            height: 140px;
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
