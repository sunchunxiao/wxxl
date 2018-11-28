<template>
  <div class="ConOrgComparisonAverage-container">
    <div 
      class="ConOrgComparisonAverage" 
      :id="`ConOrgComparisonAverage-${id}`" />
    <div class="detail">{{ data.subject_name }}</div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  props: {
    id: String,
    data: Object,
    title: String
  },
  data(){
    return{
      time:"",
      timestr:""
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(`ConOrgComparisonAverage-${this.id}`));
    this.renderChart(this.data);
    //      console.log(this.data,this.id)

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
            
      if (subject === 'ROI'||subject === 'ITO') { // ROI投入产出比需要,ITO库存周转率不需要单位
        return val;
      }else{
        let Tenthousand = parseInt(val / 10000);
        if(Tenthousand>=1){
          return parseInt(val / 10000)+'w';
        }else{
          return parseInt(val);
        }
      }
    },
    renderChart(data) {
      let _this = this;
      const { series,timeLabels,subject } = data;
      const seriesClone = _.cloneDeep(series);
                
      for(let i = 0;i < seriesClone.length; i++) {
        if(subject=='ROI'||subject=='ITO'){
          _.forEach(seriesClone[i], (v,k) => {
            seriesClone[i][k] = v;
          });
        }else{
          _.forEach(seriesClone[i], (v,k) => {
            seriesClone[i][k] = parseInt(v/100);
          });
        }
                        
      }
                
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
          data: timeLabels
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (val) {
              return _this.calculateToShow(val);
            }
          }

        },
        series: []
      };
      for(let i = 0; i < seriesClone.length; i++) {
        options.series.push({
          name: this.data.nodes[i],
          type: 'line',
          stack: i,
          data: seriesClone[i]
        });
      }

      this.chart.setOption(options,true);
               
    }
  }
};
</script>

<style lang="scss" scoped>
    .ConOrgComparisonAverage-container {
        .ConOrgComparisonAverage {
            width: 140px;
            height: 140px;
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
