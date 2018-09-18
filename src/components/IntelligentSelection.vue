<template>
    <div class="heatmap-container">
        <div class="heatmap" :id="`heatmap-${id}`"></div>
        <!-- <div class="detail">{{title}}</div> -->
    </div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';

const stragetyArr = [
    "持续优化成本成本结构",
    "梳理现有供应商结构，对供应商报价进行综合评估和管理",
    "持续优化采购渠道",
    "持续优化成本成本结构",
    "梳理现有供应商结构，对供应商报价进行综合评估和管理",
    "持续优化采购渠道",
    "梳理现有整体成本结构",
    "加强各环节成本预算管控",
    "查验包装成本中高成本环节，对其进行评估、调整或删除",
    "按预算整体控制品牌包装成本",
    "寻找新的高性价比供应商资源",
    "建立供应商管理体系",
    "对高成本采购渠道环节进行查验",
    "寻找新的高性价比采购渠道",
    "查验摄影环节中高成本环节，对其进行评估调整"
];

export default {
    props: {
        id: String,
        data: Array,
        // title: String
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`heatmap-${this.id}`));
        this.renderChart(this.data);
        let _this = this;
        this.chart.on('click', function (params) {
            const brands = ['蒂爱','可优比','麦克适','米歌'];
            const brand = brands[Math.floor(params.dataIndex / 7)];
            _this.$emit('showStragety', {brand, name: params.name, rank: _this.getRank(params.data[2]), stragety: _this.getstragetyArr()});
        });
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
        getstragetyArr() {
            let length = _.random(3, 5);
            let arr = [];
            for(let i = 0; i < length; i++) {
                arr.push(stragetyArr[_.random(0, 14)]);
            }
            return _.uniq(arr);
        },
        getRank(score) {
            if (1 == score) {
                return '差';
            }
            if (2 == score) {
                return '中';
            }
            if (3 == score) {
                return '良';
            }
            if (4 === score) {
                return '优'
            }
            return '差';
        },
        renderChart(data) {
            const _this = this;
            let options = [];
            let timeLineData = [];

            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                let seriesData = item.data.map(function (v) {
                    return [v[1], v[0], v[2]];
                    // return [v[1], v[0], v[2] || '-'];
                });

                let option = {
                    title: {
                        text: '智能评选',
                        left: '40%',
                        textStyle: {
                            color: '#454545',
                            fontSize: 16,
                            fontWeight: 400
                        }
                    },
                    animation: true,
                    grid: {
                        height: '70%',
                        y: '8%',
                        x: '8%'
                    },
                    custom: {
                        categoryIds: item.categoryIds,
                        subjects: item.subjects,
                        categoryNames: item.categoryNames
                    },
                    xAxis: {
                        type: 'category',
                        data: item.transSubjects,
                        // splitArea: {
                        //     show: true
                        // },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 0
                        }

                    },
                    yAxis: {
                        type: 'category',
                        data: item.categoryNames,
                        splitArea: {
                            show: true
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 4,
                        calculable: true,
                        orient: 'vertical',
                        left: 'right',
                        bottom: '35%',
                        inRange: {
                            color: ['#a7dcfc','#70bcde', '#23a9cc', '#007eb0']
                        },
                        text: ['优', '差']
                    },
                    series: [{
                        name: '',
                        type: 'heatmap',
                        data: seriesData,
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return _this.getRank(params.data[2]);
                                }
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };

                options.push(option);
                timeLineData.push(item.timeLabel);
            }
            let heatMapOption = {
                baseOption: {
                    timeline: {
                        // y: 0,
                        axisType: 'category',
                        // realtime: false,
                        // loop: false,
                        autoPlay: false,
                        // currentIndex: 2,
                        playInterval: 2000,
                        // controlStyle: {
                        //     position: 'left'
                        // },
                        data: timeLineData,
                        checkpointStyle: {
                            color: '#258cb9',
                            borderColor: 'rgba(4, 165, 261, .5)'
                        },
                    },
                    tooltip: {}
                },
                options: options
            };
            this.chart.setOption(heatMapOption);
        }
    }
}
</script>

<style lang="scss" scoped>
.heatmap-container {
    .heatmap {
        width: 600px;
        height: 400px;
        margin: 0 auto;
    }
    // .detail {
    //     text-align: center;
    //     color: #5e5e5e;
    //     font-size: 15px;
    //     padding: 20px;
    // }
}
</style>


