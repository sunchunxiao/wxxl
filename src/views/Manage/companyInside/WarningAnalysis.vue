<template>
  <div class="heatmap-container">
    <div
      class="heatmap echart"
      :style="{height: heightValue}"
      :id="`heatmap-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { labelNewline, formatTimeLabel } from 'utils/common';
// import { dataRank } from '../data/subject';
const RANK = ['未知', '差', '中', '良', '优'];
const categoryNamesLength = 8;
export default {
    props: {
        id: String,
        pos: Array,
        data: Array,
        height: {
            type: String,
            default: "180px"
        },
    },
    data() {
        return {
            timeLineData: [],
            cid: 0,
            name: '',
            brand: '',
            debounce: null,
            // dataRank:dataRank,
            dataIndex:0,
            last: 0
        };
    },
    computed: {
        heightValue() {
            if (!this.data[0].y) {
                return this.height;
            }
            if (this.height.includes("px")) {
                if (this.data[0].y <= categoryNamesLength) {
                    return 570 +"px";
                }
                if ((this.data[0].y * 50) > parseInt(this.height)) {
                    return this.data[0].y * 70 + "px";
                }
            }
            return this.height;
        }
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`heatmap-${this.id}`));
        this.renderChart(this.data);
        if(this.pos.length){
            setTimeout(() => {
                this.chart.dispatchAction({
                    type: 'highlight',
                    dataIndex: this.dataIndex,
                });
            }, 0);
        }
        let _this = this;
        this.chart.on('timelinechanged', function() {
            for (let i in this.data) {
                let aa = i.data.find(el => {
                    return el[0] == this.pos[0] && el[1] == this.pos[1];
                });
                _this.dataIndex = i.data.indexOf(aa);
            }
            _this.chart.dispatchAction({
                type: 'highlight',
                dataIndex: _this.dataIndex,
            });
        });
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener("resize",this.debounce);
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.debounce);
    },
    updated() {

    },
    watch: {
        // pos(){
        //     this.$nextTick(() => {
        //         this.renderChart(this.data);
        //     });
        // },
        data: {
            handler: function(val) {
                this.renderChart(val);
                if(this.pos.length){
                    setTimeout(() => {
                        this.chart.dispatchAction({
                            type: 'highlight',
                            dataIndex: this.dataIndex,
                        });
                    }, 0);
                }

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
        getRank(score) {
            return RANK[score] || '';
        },
        renderChart(data) {
            let y = data[0].y;
            let arr = [];
            for(let i=0;i<y;i++) {
                if ( i==0) {
                    arr.push("部门级");
                }else{
                    arr.push("");
                }
            }
            // let _this = this;
            let options = [];
            let timeLineData = [];
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let seriesData = item.data;
                let series = _.cloneDeep(seriesData);

                let aa = seriesData.find(el => {
                    if(this.pos.length) {
                        return el[0] == this.pos[0] && el[1] == this.pos[1];
                    }
                });
                let obj = {};
                this.dataIndex = aa && seriesData.indexOf(aa);
                let a = series.map(function(v) {
                    if(v[1]==0){
                        obj = {
                            value:v,
                            label: {
                                normal:{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight:'bold',
                                    fontSize:14
                                }
                            },
                            itemStyle:{
                                borderWidth: 1,
                                borderColor: 'rgba(197,197,197,0.5)',
                                // shadowBlur: 1,
                                shadowColor: 'rgba(120, 0, 0, 0.8)',
                            }
                        };
                    }else{
                        obj = {
                            value:v,
                            label: {
                                normal:{
                                    color: '#000',

                                }
                            }
                        };
                    }

                    return obj;
                });
                let option = {
                    tooltip: {
                        formatter: function(params) {
                            var sc=params.value[2]; //分数
                            var ch=params.value[3]; //名称
                            var r;
                            if (sc < 60){
                                r='差';
                            } else if (sc>=60 && sc<85){
                                r='预警';
                            }else{
                                r='优';
                            }
                            return ch+ '<br>'+ r + '<br>' + ' 分数:'+sc+'分';
                        },
                    },
                    visualMap: {
                        type: 'piecewise',
                        itemWidth: 66,
                        itemHeight: 32,
                        pieces: [{
                            gt: 0,
                            lte: 59,
                            label:'未达标 <60',
                            color:'#FD625E'
                        },{
                            gt: 59,
                            lte: 84,
                            label:'预警 60-85',
                            // rgba(255,255,3,0.5) #F2C811
                            color: 'rgb(255,199,75)'
                        },{
                            gt: 84,
                            label:'优 >=85',
                            //浅色rgba(6, 255, 2) rgba(3,197,1,0.7)
                            color:'rgb(150,206,93)',
                        },
                        ],
                        itemSymbol:'circle',
                        dimension: 2,
                        orient: '',
                        left: 'right',
                        top: 0,
                        textGap: -62,
                        textStyle: {
                            color: '#000',
                            fontSize:12
                        }
                    },
                    animation: false,
                    grid: {
                        show:true,
                        backgroundColor: 'rgba(197,197,197,0.5)',
                        width:'auto',
                        height: '70%',
                        y: '13%',
                        x: '15.5%'
                    },
                    xAxis: {
                        show:false,
                        type: 'category',
                        axisLine:{
                            show: false
                        },
                        axisTick:{
                            show: false,

                            inside:true
                        },
                        // axisLabel: {
                        //     interval: 0,
                        //     show: true,
                        //     formatter: function(value) {
                        //         return labelNewline(3, value);
                        //     },
                        // }
                    },
                    yAxis: {
                        show:false,
                        inverse: true,
                        type: 'category',
                        // data: arr,
                        axisLine:{
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            show: true,
                            fontSize:14,
                            fontWeight:'bold',
                            // formatter: function(value) {
                            //     return labelNewline(6, value);
                            // }
                        }
                    },

                    series: [{
                        name: '',
                        type: 'heatmap',
                        data: a,
                        label: {
                            normal: {
                                show: true,
                                formatter: function(params) {
                                    return labelNewline(5, params.value[3]) +"\n"+params.value[2]+'分';
                                },
                                // color:'#000',
                                // color: function(params) {
                            //     console.log(params);
                            //     if (params.data[1] == 0) {
                            //         console.log(11111);
                            //         return '#fff';
                            //     } else {
                            //         console.log(2222);
                            //         return '#000';
                            //     }
                            // },
                            },

                        },
                        itemStyle: {
                            show:true,
                            emphasis: {
                                borderWidth: 1,
                                // borderColor: '#333',
                                shadowBlur: 10,
                                shadowColor: 'rgba(120, 0, 0, 0.8)',
                            },
                            // color: 'pink',
                            // color: function(params) {
                            //     console.log(params);
                            //     if (params.data[1] == 0) {
                            //         console.log(11111);
                            //         return '#fff';
                            //     } else {
                            //         console.log(2222);
                            //         return '#000';
                            //     }
                            // },
                        }
                    },
                    ]
                };
                options.push(option);
                timeLineData.push(item.timeLabel);
            }
            let heatMapOption = {
                baseOption: {
                    timeline: {
                        tooltip:false,
                        axisType: 'category',
                        playInterval: 2000,
                        data: timeLineData,
                        label: {
                            formatter: function(value) {
                                return formatTimeLabel(value);
                            }
                        },
                        checkpointStyle: {
                            color: '#F2C811',
                            borderWidth: 1,
                            borderColor: '000'
                        },
                        bottom: '-1%',
                        //时间轴线颜色
                        lineStyle: {
                            color: '#494A4A',
                            width: 1
                        },
                        //播放按钮
                        controlStyle: {
                            showPlayBtn: false,
                            color: '#000'
                        },
                        //高亮颜色
                        // emphasis: {
                        //     itemStyle: {
                        //         color: '#F2C811',
                        //     }
                        // }
                    },
                },
                options: options
            };
            this.chart.setOption(heatMapOption, true);
        }
    }
};
</script>

<style lang="scss" scoped>
    .heatmap-container {
        .heatmap {
            width: 100%;
            // height: 480px;
            margin: 0 auto;
        }
        canvas{
            width: 100%;
        }
    }
</style>
