<template>
  <div class="radar-container">
    <div
      class="radar echart"
      :id="`radar-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
import { labelNewline } from 'utils/common';
const REVERSE_TARGET = ['C', 'SA','DR']; // C成本 SA库存额 DR残品率是反向指标

let originList = [];//原始数组
let list = [];//正向指标数组
let reverseList = [];//反向指标数组
let nameList = [];//指标名称数组
let progressList = [];//达成率数组
let progressTooltipList = [];//达成率tooltip数组

export default {
    props: {
        id: String,
        data: Object,
    },
    data() {
        return {
            color: '#000',
            debounce:null,
            clientWidth:document.body.clientWidth
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`radar-${this.id}`));
        if(this.data.progress && this.data.subject && this.data.name){
            this.renderChart();
        }
        this.debounce = _.debounce(this.chart.resize, 1000);
        window.addEventListener('resize', this.debounce);
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
        //正反向指标数据格式化
        originDataFormat(){
            originList.length = 0;
            list.length = 0;
            reverseList.length = 0;
            nameList.length = 0;
            progressList.length = 0;
            progressTooltipList.length = 0;
            for(let i = 0; i < this.data.name.length; i++){
                let obj = {};
                obj.name = this.data.name[i];
                obj.progress = this.data.progress[i];
                obj.subject = this.data.subject[i];
                obj.min = 0;
                obj.max = 2;
                originList.push(obj);
            }
            for(let i in originList){
                for(let j in REVERSE_TARGET){
                    if(originList[i].subject===REVERSE_TARGET[j]){
                        //根据屏幕尺寸确定是否需要折行
                        let name = originList[i].name + '(2-目标达成率)';
                        originList[i].name = this.clientWidth>1440?name:labelNewline(4,name);
                        originList[i].progress = 2-originList[i].progress;
                        originList[i].color = '#5F5D5D';
                        reverseList.push(originList[i]);
                    }
                }
            }
            list = originList.concat(reverseList).filter(function(value, index, array) {
                return array.indexOf(value) === array.lastIndexOf(value);
            });
            for(let i in list){
                //根据屏幕尺寸确定是否需要折行
                let name = list[i].name;
                list[i].name = this.clientWidth>1440?name:labelNewline(4,name);
                list[i].color = '#5F5D5D';
            }
            for(let i = 0; i < originList.length; i++) {
                nameList.push(originList[i].name);
                //百分比大于0或者小于0的情况
                if (originList[i].progress>2) {
                    progressList.push(2);
                } else if(originList[i].progress<0) {
                    progressList.push(0);
                } else {
                    progressList.push(originList[i].progress);
                }
                // progressList.push(originList[i].progress>2?2:originList[i].progress);
                progressTooltipList.push(originList[i].progress);
            }
        },
        //圆环标注线
        markPie(radius1,radius2,mark,bool){
            let pie = {
                type: 'pie',
                hoverAnimation:false,
                startAngle: 270,
                radius: [radius1,radius2],
                itemStyle: {
                    normal: {
                        color: ['#C0C0C0'],
                        label: {
                            show: false
                        }
                    }
                },
                label: {
                    normal: {
                        show: bool,
                        formatter: mark,
                        position: 'inside',
                        color:'#cec7c7',
                        fontSize:12,
                    },
                },
                data: [1],
            };
            return pie;
        },
        renderChart() {
            this.originDataFormat();
            const options = {
                tooltip: {
                    formatter: function(params) {
                        let result = '';
                        for (let i=0; i<params.name.length; i++) {
                            if (params.value[i] == null) {
                                if(params.name[i].indexOf('(') !== -1){
                                    result += params.name[i] + " : " + '暂无' +"</br>";
                                }else{
                                    result += params.name[i] + '(目标达成率)' + " : " + '暂无' +"</br>";
                                }
                            }else if(params.name[i].indexOf('(') !== -1) {
                                result += params.name[i].split('(')[0] +
                                '(' +
                                params.name[i].split('(')[1] +
                                " : " +
                                (progressTooltipList[i]*100).toFixed(0)+'%' +
                                '</br>';
                            }else{
                                result += params.name[i]+ '(目标达成率)' + " : " + (progressTooltipList[i]*100).toFixed(0)+'%' +"</br>";
                            }
                        }
                        return result.split("\n").join("");
                    },
                    confine:true,
                    // position: function (point, params, dom) {
                    //     dom.style.transform = "translate(-50%, 0%)";
                    //     return ["50%", "50%"];
                    // }
                },
                scale: true,
                radar: {
                    name: {
                        textStyle: {
                            color: '#5F5D5D',
                            fontSize: 14,
                            borderRadius: 3,
                            padding: [3, -10],
                        }
                    },
                    show:true,
                    indicator: originList,
                    radius: 110,
                    shape: 'circle',
                    splitArea: {
                        areaStyle: {
                            color: ['#fff'],
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            width : 1,
                            color:"rgb(153, 153, 153, 0.0)"
                        }
                    },
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:"#C0C0C0"
                        }
                    },
                },
                series: [
                    {
                        name: '正反向指标达成率',
                        type: 'radar',
                        data : [
                            {
                                value : progressList,
                                name: nameList,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter:function(params) {
                                            return  params.value?(params.value*100).toFixed(0)+"%":'';
                                        },
                                        color:'#5F5D5D',
                                    },
                                },
                                itemStyle:{
                                    normal: {
                                        show: true,
                                        color:'#FD625E'
                                    },
                                },
                                areaStyle: {
                                    normal: {
                                        show: true,
                                        color: 'rgba(1, 184, 170, 0.8)'
                                    }
                                },
                            },
                        ],
                        itemStyle : {
                            normal : {
                                lineStyle: {
                                    color:'#FD625E',
                                    width: 2
                                }
                            },
                            emphasis: {
                                lineStyle: {
                                    width: 3
                                }
                            }
                        },
                    }]
            };
            options.series.push(
                this.markPie(110,111,"200%",true),
                this.markPie(82.5,83.5,"150%",true),
                this.markPie(55,57.5,"100%",true),
                this.markPie(27.5,28.5,"50%",false),
                this.markPie(0,1,'0%',false)
            );
            this.chart.setOption(options,true);
        }
    }
};
</script>

<style lang="scss" scoped>
.radar-container {
    .radar {
        min-width: 350px;
        width: 100%;
        height: 370px;
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
