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
        data(){
            return {
                val:[]
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
            renderChart(nodes) {
                var _this = this;
                const {
                    transSubjects,
                    nodes: pData
                } = nodes;
                const percentArr = [];
                const average = nodes.avg;

                for(let i in pData) {
                    //              percentArr.push(Math.floor(parseInt(pData[i].total) / sumTarget * 100));
                    //              var arr = (nodes.values[i] / nodes.total).toFixed(4)
                    //              percentArr.push((arr * 100).toFixed(2));

                    //                  if(nodes.subject == "投入产出比" || nodes.subject == "日销" || nodes.subject == "库存周转率") {
                    //                      percentArr.push(nodes.values[i]);
                    //
                    //                  } else {
                    //                      var arr = (parseInt(nodes.values[i] / 1000000))
                    //                      //                      console.log(arr)
                    //
                    //                      percentArr.push(arr);
                    //
                    //                  }
                    percentArr.push(nodes.values[i]);

                }
                const options = {
                    grid: {
                        left: 10,
                        right: 30,
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
                        name:nodes.nodes,
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    _this.val.push(params.data);
                                    // console.log(_this.val);
                                    // var sum = _this.val.reduce(function(prev,cur,index,array){
                                    //        return prev + cur;
                                    // });
                                    // console.log(sum);
                                    return params.data < average ? '#b0afad' : '#318cb8';
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
                                    if(nodes.display_rate == 0) {
                                        return `${pData[params.dataIndex]} : ${params.data}`;
                                    }
                                    return `${pData[params.dataIndex]} : ${(params.data/nodes.total*100).toFixed(2)}%`;
                                    // return `${pData[params.dataIndex]} : ${params.data}`;
                                },
                            }
                        },
                        data: percentArr,
                        markLine: {
                            symbol: 'none',
                            label: {
                                formatter:nodes.display_rate == 0 ? `平均值${average}` : `平均值${(average/nodes.total*100).toFixed(2)}%`
                               
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
