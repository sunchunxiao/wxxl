<template>
  <div class="averagebar-container">
    <div 
      class="averagebar" 
      :id="`averagebar-${id}`"/>
    <div class="detail">{{ data.subject }}</div>
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
                handler: function(val) {
                    this.renderChart(val);
                },
                deep: true
            },
        },
        methods: {
            renderChart(nodes) {
                const {
                    transSubjects,
                    nodes: pData
                } = nodes;
                const percentArr = [];
                // let sumTarget = 0;
                // let sumTotal = 0;
                //          console.log(nodes)
                //          for(let i in pData) {
                //              sumTotal += parseInt(pData[i].total);
                //              sumTarget += parseInt(pData[i].target);
                //          }
                //          const average = Math.floor(sumTotal / sumTarget / pData.length * 100);

                //          const average = (nodes.avg / nodes.total*100).toFixed(1)
                const average = nodes.avg
                for(let i in pData) {
                    //              percentArr.push(Math.floor(parseInt(pData[i].total) / sumTarget * 100));
                    //              var arr = (nodes.values[i] / nodes.total).toFixed(4)
                    //              percentArr.push((arr * 100).toFixed(2));
                    percentArr.push(nodes.values[i]);
                }
                const options = {
                    grid: {
                        left: 10,
                        right: 20,
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
                                barBorderRadius: [0, 20, 20, 0],
                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                position: [5, 6],
                                color: "#000",
                                formatter: function(params) {

                                    //                              if (nodes.type === 'quota') {
                                    //                                  return `${pData[params.dataIndex].name} : ${params.data}`;
                                    //                              }
                                    if(nodes.subject == "投入产出比" || nodes.subject == "日销" || nodes.subject == "库存周转率") {
                                        return `${pData[params.dataIndex]} : ${params.data}`;
                                    }
                                    return `${pData[params.dataIndex]} : ${(params.data/nodes.total*100).toFixed(2)}%`;
                                },
                            }
                        },
                        data: percentArr,
                        markLine: {
                            symbol: 'none',
                            label: {
                                formatter: nodes.subject == "投入产出比" || nodes.subject == "日销" || nodes.subject == "库存周转率" ? `平均值${average}` : `平均值${average}`
                                //                          
                            },
                            data: [{
                                xAxis: average,
                                itemStyle: {
                                    normal: {
                                        color: '#b12725'
                                    }
                                }
                            }, ]
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