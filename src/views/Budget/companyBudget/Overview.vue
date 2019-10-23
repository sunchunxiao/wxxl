<template>
  <div class="container budget">
    <div
      v-loading="loading"
      class="overview outshaow">

      <Card style="height:100%">
        <el-row class="margin-bottom-10 overview_title">公司内部预算管理</el-row>
        <el-col
          style="height:100%"
          :span="16">
          <!-- 表格 -->
          <div class="track">
            <div
              v-loading="loading"
              class="table_container">
              <el-table
                :span-method="arraySpanMethod(optinBudget)"
                :data="optinBudget"
                stripe>
                <el-table-column
                  prop="b1"
                  min-width="120"
                  label="中心数据">
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleClick(scope.row)"
                      class="name-wrapper cell_count count_use">
                      {{ scope.row.b1 }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="b2"
                  min-width="120"
                  @click="handleClick(scope.row)"
                  label="预算科目">
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleClick(scope.row)"
                      class="name-wrapper cell_count count_use">
                      {{ scope.row.b2 }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  :label='time'>
                  <!-- <el-table-column
                    prop="b3"
                    min-width="100"
                    label="目标额度">
                    <template
                      slot-scope="scope">
                      <div
                        @click="handleCountUseClick($event, scope.row,'b3')"
                        class="name-wrapper cell_count count_use">
                        {{ scope.row.b3 }}
                      </div>
                    </template>
                  </el-table-column> -->
                  <el-table-column
                    prop="b3"
                    min-width="100"
                    label="目标额度">
                    <template
                      slot-scope="scope">
                      <div
                        class="name-wrapper ">
                        {{ scope.row.b3 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="b4"
                    min-width="100"
                    label="实际使用">
                    <template
                      slot-scope="scope">
                      <div
                        class="name-wrapper">
                        {{ scope.row.b4 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="b5"
                    label="使用率（实际使用/目标额度）">
                    <template
                      slot-scope="scope">
                      <div
                        class="name-wrapper ">
                        {{ scope.row.b5 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="b6"
                    label="当期差异（实际使用-目标额度）">
                    <template
                      slot-scope="scope">
                      <div
                        class="name-wrapper">
                        {{ scope.row.b6 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="b7"
                    label="累计差异（一月差异+...)">
                    <template
                      slot-scope="scope">
                      <div
                        class="name-wrapper">
                        {{ scope.row.b7 }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <radar
            v-if="subjectObj.name.length"
            :id="'subjectObj'"
            :data="subjectObj" />
          <ProTargetAchievement
            v-if="achievement.length"
            :id="`1`"
            :data="achievement[0]" />
        </el-col>
      </Card>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import ProTargetAchievement from './ProTargetAchievement';// 目标达成情况总览
import radar from './Radar';

//vuex
import { mapGetters } from 'vuex';

export default {
    components: {
        Card,
        radar,
        ProTargetAchievement,
    },
    data () {
        return {
            optinBudget:[],
            optinBudgetRadar:{},
            //js
            loading: false,
            //views
            subject: '',
            subjectObj:{
                name:[],
                progress:[]
            },
            achievement:[],
            time:''
        };
    },
    computed: {
        ...mapGetters(['orgradarArr','orggossipArr','fundprogressArr','fundReachRadarObj']),

    },
    watch: {
    },
    mounted () {
        //获取初始时间
        this.getBudgetInner();
    },
    methods: {
        handleClick(row) {
            this.getRadar(row.b1,this.optinBudget);
            this.proTargetAchievement(row.b2,row);
        },
        getBudgetInner() {
            this.loading = true;
            API.GetBudgetInner().then(res => {
                this.getRadar(res.data.body[0].b1,res.data.body);
                this.proTargetAchievement(res.data.body[0].b2,res.data.body[0]);
                this.optinBudget = res.data.body;
                this.time = res.data.head.h3;
            }).finally(() => {
                this.loading = false;
            });
        },
        proTargetAchievement(b2,row){
            this.achievement = [];
            this.achievement.push({
                subject_name:b2,
                target:row.b3,
                real:row.b4,
                progress:row.b5,
            });
        },
        getRadar(b1,optinBudget){
            let name =[],progress = [];
            for(let i of optinBudget){
                if(i.b1 == b1){
                    name.push(i.b2);
                    progress.push(i.b5);
                }
            }
            this.subjectObj.name = name;
            this.subjectObj.progress = progress;
        },
        arraySpanMethod (strategies) {
            if (!strategies || strategies.length === 0) {
                return;
            }
            const group = _.groupBy(strategies, o => {
                return o.b1;
            });
            const newStrategies = _.cloneDeep(strategies);
            for (let i = 1; i < newStrategies.length; i++) {
                let prev = newStrategies[i - 1];
                let current = newStrategies[i];
                if (current.b1 === prev.b1) {
                    current.hidden = true;
                }
            }
            return ({
                row,
                rowIndex,
                columnIndex
            }) => {
                const rowSpan = group[row.b1].length;
                if ([0].includes(columnIndex)) {
                    if (!newStrategies[rowIndex].hidden) {
                        return [rowSpan, 1];
                    } else {
                        return [0, 0];
                    }
                }
            };
        },
        // changeCellStyle({ row,columnIndex }) {
        //     if (columnIndex == 3) {
        //         if(row.comprehensive == this.comprehensive) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     } else if (columnIndex == 4) {
        //         if(row.production_capacity == this.production_capacity) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 5) {
        //         if(row.quality == this.quality) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 6) {
        //         if(row.price == this.price) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 7) {
        //         if(row.delivery == this.delivery) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 8) {
        //         if(row.effectiveness == this.effectiveness) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 9) {
        //         if(row.service == this.service) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 10) {
        //         if(row.funds == this.funds) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }else if (columnIndex == 11) {
        //         if(row.development == this.development) {
        //             return 'color:rgba(255,51,51,0.7)';
        //         }
        //     }
        // },
        //最小值标红
        minMath(data,strArr){
            for(let i of strArr){
                let strMin = data.map((el)=>{
                    return el[i];
                });
                this[i] = Math.min.apply(Math,strMin);
            }
        },
    }
};
</script>

<style lang="scss">
// .budget{

// }
.outshaow{
    position: relative;
    .shaow {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        opacity: 0.5;
        z-index: 1;
        background: white;
    }
    .track{
        height: 100%;
    }
    .track .table_container .el-table{
        height: 100%;
        overflow-y: scroll
    }
    .track .table_container .el-table .el-table__row .cell:not(.clone-cell) .cell_count{
        text-decoration:none;
    }
    tbody > tr{
            td {
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                &:first-child {
                    border-left: 1px solid transparent;
                }
                &:last-child {
                    border-right: 1px solid transparent;
                }
            }
            &:hover {
                td {
                    border-color: #f5f7fa!important;
                }
            }
        }
}
.manage_title {
    display: flex;
    justify-content: left;
    .supply_left{
        margin-left: 30px
    }
}
.el-table--border{
    border-bottom: 1px solid #ebeef5;
}
@import '../../Product/style/overview.scss';
@import '../../Product/style/track.scss'
</style>
