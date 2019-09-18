<template>
  <div class="bar-container">
    <div
      class="bar echart"
      ref="chart"
      :style="{height: height}"
      :id="`bar-${id}`" />
  </div>
</template>

<script>
import echarts from 'plugins/echarts';
export default {
    data() {
        return {
            timerId: 0,
        };
    },
    mounted() {
        this.mycharts();
    },
    watch: {
        data: {
            handler() {
                this.mycharts();
            },
            deep: true
        }
    },
    props: {
        id: String,
        yAxis:Array,
        data: Object,
        height: {
            type: String,
            default: "260px"
        },
    },
    methods: {
        handleResize() {
            var bar_dv = this.$refs.chart;
            echarts.init(bar_dv).resize();
        },
        mycharts() {
            var _this = this;
            var mubiaoData = [];
            var wanchengData = [];
            if(_this.id === 'overviewNow' || _this.id === 'overviewFirst' || _this.id === 'overviewReturn'){
                mubiaoData.push(
                    parseInt(_this.data["target_order_num"]/1000),
                    _this.data["target_style_num"]
                );
                wanchengData.push(
                    parseInt(_this.data["actual_order_num"]/1000),
                    _this.data["actual_style_num"]
                );
            }else if(_this.id === 'overviewDepartment'){
                mubiaoData.push(
                    _this.data["target_p5"],
                    _this.data["target_p4"],
                    _this.data["target_p3"],
                    _this.data["target_p2"],
                    _this.data["target_p1"],
                    _this.data["target_total"]
                );
                wanchengData.push(
                    _this.data["actual_p5"],
                    _this.data["actual_p4"],
                    _this.data["actual_p3"],
                    _this.data["actual_p2"],
                    _this.data["actual_p1"],
                    _this.data["actual_total"]
                );
            }else if(_this.id === 'overviewSupplier'){
                mubiaoData.push(
                    _this.data["target_s5"],
                    _this.data["target_s4"],
                    _this.data["target_s3"],
                    _this.data["target_s2"],
                    _this.data["target_s1"],
                    _this.data["target_total"]
                );
                wanchengData.push(
                    _this.data["actual_s5"],
                    _this.data["actual_s4"],
                    _this.data["actual_s3"],
                    _this.data["actual_s2"],
                    _this.data["actual_s1"],
                    _this.data["actual_total"],
                );
            }
            var bar_dv = this.$refs.chart;
            var charts = echarts.init(bar_dv, "shine");
            var icon ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABDCAMAAABjnP3jAAAAilBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAADT09MAAAAAAAAAAAAAAAD////8/Pz5+fnr6+v8/Pzr6+vZ2dn09PTFxcX+/v719fX6+vrf39+5ubnDw8MSEhIrKytRUVF2dnZAQEDi4uLi4uLk5OTk5OT///+tdFIzAAAALXRSTlMABQgNFBwDNS4mCxEYIyAamisoMS364t9b57qWj3b0s6mec28rJhMNDKemZ2YvJtR9AAACMUlEQVRo3u2ZaW/iMBBAaTDdxI7tOCeF0vvaY/7/39sZJ2BgKyUrxNBKfh+RyHtMJkhJZl+Ja+LqzHjJ53rvTs5OX/Gp/n350DZwZu66h+X7vwmoT5YtMNEuE0w48n/cAiO3H0NB+P2cfioYZhDmD8yEs0ABydsNMHPzllDA4Jd/gJ3fEguGADm/B3bu5xIDhgGoFthpFY2gD5iLBthpxHwbIFUOFyBX8osE4ApYuAAWl4ACaAUuE0BLMAQs4AIsYkAMiAExIAbEgBgQA2JADIgB+wF3wE5zENABO+1+gF0BOytLAdt7ww2ws6F7w93d8Sv/M6LXg9tz8wzMPJsQQFuoH4GVR007uA2gEbz8AkZ+vtAAKMAXSBpB+dQBE91TSQOQ5N+NAAvSzapr4Mw03WqToj8MoN8CX+DSqvoxjQKOKCZ+sapS5/20AeFZsaQCozPn6jodpcLO4tiPH6aj1LVzmTbkl1d9QCgQmGC0zsYpHc6qOPDj73JlNo7WBvVi5w8FiU/IrV2MY2hWabHnT11GRx7H2tzrk+APBZiglJhATqerTIvgL2msuZiAUqgP/lBACYnEiAlgJu1sXQz+mrZK4JEnINFO+utT3prJfmczKiB/1m+V/I+3Zie+N8QGJazJ3Bpg7TJjhUL7ae8Np+Mr+wJdrtel7v3+2DMWqIGuGkG7SNsnaKtZ7McFIrc2F+z+UKAUXVfM/lDg/zr8Rc3tDwUefn9I8PDrQ4Jn9q35C4Ev35B0ZZBdAAAAAElFTkSuQmCC';
            let option = {
                backgroundColor: '#fff',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: {
                    data: ['目标', '实际'],
                    align: 'left',
                    right: 0,
                    textStyle: {
                        color: "#434e79",
                        fontSize: 14,
                        fontWeight: 400
                    },
                    itemWidth: 14,
                    itemHeight: 14,
                    itemGap: 35
                },
                tooltip: {
                    trigger: "axis",
                    padding: [8, 10],
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    axisPointer: {
                        type: "shadow",
                        textStyle: {
                            color: "#fff"
                        }
                    }
                },
                yAxis: [{
                    type: 'category',
                    data: this.yAxis,
                }],
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }],
                series: [{
                    name: "目标",
                    type: "bar",
                    barMaxWidth: 40,
                    z: 0,
                    itemStyle: {
                        normal: {
                            color: "gray",
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 16,
                                },
                                position: "right",
                                distance: 10
                            }
                        }
                    },
                    data: mubiaoData
                }, {
                    name: "实际",
                    type: "bar",
                    silent: true,
                    barMaxWidth: 30,
                    barGap: '-88%',
                    z: 1,
                    itemStyle: {
                        normal: {
                            color: _this.id === 'overviewNow'?"#92D050":"#2AE09E",
                            label: {
                                show: true,
                                position: 'right',
                                distance: 0,
                                color: '#434e79',
                                fontSize: 16,
                                backgroundColor: {
                                    image: icon,
                                },
                                padding: [10, 15, 20, 15],
                                borderRadius: 100
                            }
                        }
                    },
                    data: wanchengData
                }]

            };
            //清空画布
            //charts.clear();
            charts.setOption(option);
            // 屏幕自适应
            this.timerId = setTimeout(function () {
                window.addEventListener("resize", _this.handleResize);
            }, 200);
        }
    },
    beforeDestroy() {
        clearTimeout(this.timerId);
        window.removeEventListener("resize", this.handleResize);
    }
};

</script>

<style lang="scss" scoped>
    .bar-container {
        width: 100%;
    .bar {
        width: 100%;
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

