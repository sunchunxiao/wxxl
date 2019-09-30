<template>
  <div class="radar-container">
    <div
      class="radar echart"
      :id="`radar-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
const REVERSE_TARGET = ['C', 'SA','DR']; // C成本 SA库存额 DR残品率是反向指标

let originList = [];//原始数组
let list = [];//正向指标数组
let reverseList = [];//反向指标数组
let nameList = [];//指标名称数组
let progressList = [];//达成率数组

export default {
    props: {
        id: String,
        data: Object,
    },
    data() {
        return {
            color: '#000',
            debounce:null
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
                        originList[i].name = '反向指标：' + originList[i].name;
                        originList[i].progress = 2-originList[i].progress;
                        originList[i].color = '#FF6B67';
                        reverseList.push(originList[i]);
                    }
                }
            }
            list = originList.concat(reverseList).filter(function(value, index, array) {
                return array.indexOf(value) === array.lastIndexOf(value);
            });
            for(let i in list){
                list[i].name = '正向指标：' + list[i].name;
                list[i].color = '#01CABB';
            }
            for(let i = 0; i < originList.length; i++){
                nameList.push(originList[i].name);
                progressList.push(originList[i].progress);
            }
            // console.log(this.data);
            // console.log(originList);
            // console.log(list);
            // console.log(reverseList);
            // console.log(nameList);
            // console.log(progressList);
        },
        renderChart() {
            this.originDataFormat();
            const options = {
                // legend: {
                //     data: ['正反向指标达成率'],
                //     right:'5%',
                //     top:'10%'
                // },
                tooltip: {
                    formatter: function(params) {
                        let result =[];
                        for (let i=0; i<params.name.length; i++) {
                            if (params.value[i] == null) {
                                result += params.name[i]+'达成率' + " : " + '暂无' +"</br>";
                            }else {
                                result += params.name[i]+'达成率' + " : " + (params.value[i]*100).toFixed(0)+'%' +"</br>";
                            }
                        }
                        return result;
                    },
                },
                scale: true,
                radar: {
                    name: {
                        textStyle: {
                            color: '#5F5D5D',
                            fontSize: 14,
                            borderRadius: 3,
                            padding: [3, -1],
                        }
                    },
                    show:true,
                    indicator: originList,
                    radius: 110,
                    center: ['47%','50%'],
                    shape: 'circle',
                    splitArea: {
                        areaStyle: {
                            color: ['#fff'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgb(153, 153, 153)'
                        }
                    },
                },
                series: [
                    {
                        name: '正反向指标达成率',
                        type: 'radar',
                        color:'red',
                        data : [
                            {
                                value : progressList,
                                name: nameList,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter:function(params) {
                                            return params.value?params.value.toFixed(2):'';
                                        },
                                        color:'#000',
                                    },
                                },
                                areaStyle: {
                                    normal: {
                                        show: true,
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                }
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
        height: 295px;
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
