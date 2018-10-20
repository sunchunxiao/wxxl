<template>
    <div class="ConOrgComparisonAverage-container">
        <div class="ConOrgComparisonAverage" :id="`ConOrgComparisonAverage-${id}`"></div>
        <div class="detail">{{title}}</div>
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        props: {
            id: String,
            data: Object,
            title: String,
            index: Number
        },
        mounted() {
            this.chart = echarts.init(document.getElementById(`ConOrgComparisonAverage-${this.id}`));
            this.renderChart(this.data);
        },
        watch: {
            data: {
                handler: function(val, oldVal) {
                    this.renderChart(val);
                },
                deep: true
            },
        },
        methods: {
            renderChart(data) {
                let _this = this;
                const options = {
                    grid: {
                        left: 0,
                        right: 10,
                        bottom: 0,
                        top: 10,
                        containLabel: true
                    },
                    // color: ['#D53A35', '#E98F6F', '#6AB0B8', '#334B5C'],
                    //title: {
                    //    text: '报警次数'
                    //},
                    tooltip: {
                        trigger: 'axis',
                        //formatter: "{b} <br> 合格率: {c}%"
                    },
                    // legend: {
                    //     data: ['旅游运输', '班线运输', '危险品', '普货']
                    // },
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        name: '日期',
                        boundaryGap: false,
                        data: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: _.includes([0, 1, 2, 5, 6], _this.index) ? '{value}' : '{value} %'
                        }
                        // name: '报警次数',
                    },
                    series: []
                };
                for(let i = 0; i < data.series.length; i++) {
                    options.series.push({
                        name: this.data.subject_name,
                        type: 'line',
                        stack: i,
                        data: data.series[i]
                    });
                }
                this.chart.setOption(options);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ConOrgComparisonAverage-container {
        .ConOrgComparisonAverage {
            width: 840px;
            height: 560px;
            margin: 0 auto;
        }
        .detail {
            text-align: center;
            color: #5e5e5e;
            font-size: 15px;
            padding: 10px;
        }
    }
</style>