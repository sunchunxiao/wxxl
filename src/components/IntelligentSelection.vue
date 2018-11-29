<template>
  <div class="heatmap-container">
    <div
      class="heatmap"
      :id="`heatmap-${id}`" />
      <!-- <div class="detail">{{title}}</div> -->
  </div>
</template>

<script>
import echarts from 'echarts';
// import { mapState } from 'vuex';

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
    data() {
        return {
            timeLineData: [],
            cid: 0,
            name: '',
            brand: ''
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById(`heatmap-${this.id}`));
        this.renderChart(this.data);
        let _this = this;
        this.chart.on('click', function(params) {
            let time = params.seriesId;

            for(let i=0;i<_this.data.length;i++){
                if(_this.data[i].timeLabel == time){
                    for(let j=0;j<_this.data[i].subjects.length;j++){
                        if(params.data[0] == j){
                            this.name = _this.data[i].subjects[j];
                        }
                    }
                    for(let m=0;m<_this.data[i].categoryNames.length;m++){
                        if(params.data[1] == m){
                            this.brand = _this.data[i].categoryNames[m];
                            this.cid = _this.data[i].categoryIds[m];
                        }
                    }
                }
            }

            if (params.componentType == "series") {
                _this.$emit('showStragety', {
                    brand: this.brand,
                    cid: this.cid,
                    name: params.name,
                    subject: this.name,
                    time_label: time,
                    rank: _this.getRank(params.data[2]),
                });
            }
        });

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
        getstragetyArr() {
            let length = _.random(3, 5);
            let arr = [];
            for (let i = 0; i < length; i++) {
                arr.push(stragetyArr[_.random(0, 14)]);
            }
            return _.uniq(arr);
        },
        getRank(score) {
            let scoremap = ['未知',"差","中","良","优"];
            if(scoremap[score]){
                // console.log(mapState[score]);
                return scoremap[score];
            }
            return '';

        },
        renderChart(data) {
            const _this = this;
            let options = [];
            let timeLineData = [];

            for (let i = 0; i < data.length; i++) {

                let item = data[i];
                // console.log(item)
                let seriesData = item.data.map(function(v) {
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
                        width:'auto',
                        height: '70%',
                        y: '8%',
                        x: '10%'
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
                            color: ['#eee','#a7dcfc', '#70bcde', '#23a9cc', '#007eb0']
                        },
                        text: ['优', '差']
                    },
                    series: [{
                        name: '',
                        type: 'heatmap',
                        data: seriesData,
                        id: item.timeLabel,
                        value: item.categoryNames,
                        label: {
                            normal: {
                                show: true,
                                formatter: function(params) {
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
            this.chart.setOption(heatMapOption,true);
        }
    }
};
</script>

<style lang="scss" scoped>
	.heatmap-container {
		.heatmap {
			width: 100%;
			height: 400px;
			margin: 0 auto;
		}

		// .detail {
		//     text-align: center;
		//     color: #5e5e5e;
		//     font-size: 15px;
		//     padding: 20px;
		// }
		canvas{
			width: 100%;
		}
	}
</style>
