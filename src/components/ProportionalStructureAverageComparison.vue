<template>
  <div class="averagebar-container">
    <div
      class="averagebar"
      :id="`averagebar-${id}`"/>
    <div class="detail">{{ data.subject_name }}</div>
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
            calculateToShow(val) {
                const { subject } = this.data;
                
                // if (subject === 'ROI') { // 投入产出比需要 * 100
                //     return parseInt(val * 100);
                // } else if (subject === 'ITO') { // 库存周转率不需要单位
                //     return val;
                // }else if (subject === 'POR') { // 库存周转率不需要单位
                //     return parseInt(val);
                // }

                if(subject=='SD'){
                    let Tenthousand = (val / 10000 / 100).toFixed(2);
                    // console.log(Tenthousand);
                    if(Tenthousand>=1){
                        return Tenthousand+'w';
                    }else{
                        return val/100;
                    }
                }else if(subject=='ROI'){
                    if(val>=10000){
                        return (val/10000).toFixed(2) +'w';
                    }else{
                        return val;
                    }
                }else{
                    return val;
                }
                
            },
            renderChart(nodes) {
                var _this = this;
                const {
                    transSubjects,
                    nodes: pData
                } = nodes;
            
                const percentArr = [];
                const average = nodes.avg;
                this.color = nodes["28nodes"];
                
                for(let i in pData) {
                    //              percentArr.push(Math.floor(parseInt(pData[i].total) / sumTarget * 100));
                    //              var arr = (nodes.values[i] / nodes.total).toFixed(4)
                    //              percentArr.push((arr * 100).toFixed(2));
                    
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
                                        _this.calculateToShow(params.data);
                                        return `${pData[params.dataIndex]} : ${ _this.calculateToShow(params.data)}`;
                                    }else{
                                        if(nodes.total==0){
                                            
                                            return `${pData[params.dataIndex]} : ${params.data}`;
                                        }else{
                                            return `${pData[params.dataIndex]} : ${(params.data/nodes.total*100).toFixed(2)}%`;
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
                                    if( nodes.display_rate == 0){
                                       return `平均值${_this.calculateToShow(average)}`; 
                                    }else{
                                        if(average==0){
                                            return `平均值${average}`;
                                        }else{
                                            return `平均值${(average/nodes.total*100).toFixed(2)}%`;
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
