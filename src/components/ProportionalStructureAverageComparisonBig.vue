<template>
    <div class="averagebar-container">
        <div class="averagebar" :id="`averagebar-${id}`"></div>
        <div class="detail">{{data.title}}</div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
    props: {
        id: String,
        data: Object,
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`averagebar-${this.id}`));
        this.renderChart(this.data);
    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.renderChart(val);
            },
            deep: true
        },
    },
    methods: {
        renderChart(data) {
            const {transSubjects, data: pData} = data;
            const percentArr = [];
            let sumTarget = 0;
            let sumTotal = 0;
            for(let i in pData) {
                sumTotal += parseInt(pData[i].total);
                sumTarget += parseInt(pData[i].target);
            }
            const average = Math.floor(sumTotal / sumTarget / pData.length * 100);
            for(let i in pData) {
                percentArr.push(Math.floor(parseInt(pData[i].total) / sumTarget * 100));
            }
            const options = {
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 5,
                    top: 20,
                    containLabel: true
                },
                xAxis: {
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
                    data: transSubjects,
                    axisLabel: {
                        show: false,
                    }
                },
                series: [{
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                return params.data < average ? '#b0afad' : '#318cb8'
                            },
                            barBorderRadius: [0, 20, 20, 0]
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: [5, 6],
                            color: "#000",
                            formatter: function(params) {
                                if (data.type === 'quota') {
                                    return `${pData[params.dataIndex].name} : ${params.data}`;
                                }
                                return `${pData[params.dataIndex].name} : ${params.data}%`;
                            },
                        }
                    },
                    data: percentArr,
                    markLine : {
                        symbol: 'none',
                        label:{
                            formatter: data.type === 'quota' ? `平均值${average}`: `平均值${average}%`
                        },
                        data : [
                            {
                                xAxis: average,
                                itemStyle:{
                                    normal:{color:'#b12725'}
                                }
                            },
                        ]
                    },
                }]
            };
                
            this.chart.setOption(options);
        }
    }
}
</script>

<style lang="scss" scoped>
.averagebar-container {
    .averagebar {
        width: 280px;
        height: 280px;
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

