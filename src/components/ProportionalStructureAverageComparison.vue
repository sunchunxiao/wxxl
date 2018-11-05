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
            renderChart(nodes) {
                var _this = this;
                const {
                    transSubjects,
                    nodes: pData
                } = nodes;
            
                const percentArr = [];
                const average = nodes.avg;
                this.color = nodes["28nodes"];
                // console.log(this.color);
                
                // for(let i=values.length-1;i>=0;i--){
                    
                //     _this.val.push(values[i]);
                //     console.log(_this.val);
                //     var sum = _this.val.reduce(function(prev,cur,index,array){
                //         return prev + cur;
                // });
                // // console.log(sum/nodes.total);
                // this.sum28 = sum/nodes.total;
                // // console.log(this.sum28);
                // if(this.sum28>0.8){
                //     console.log(i);
                //     this.color.push('true');
                //     // for(let i=0;i<values.length;i++){
                //     //     this.color.pus
                //     // }
                // }else{
                //     console.log(i);
                //     this.color.push('false');
                //     console.log(this.color);
                // }
                // }
                
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
                        // inverse: true,
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
                        name:this.sum28,
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // console.log(_this.color[`${params.dataIndex}`]);
                                    
                                    return _this.color[`${params.dataIndex}`] === params.dataIndex ? '#318cb8' : '#b0afad';
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
