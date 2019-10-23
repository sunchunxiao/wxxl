<template>
  <div class="container">
    <div class="overview outshaow1">
      <Card>
        <!-- 表格 -->
        <div class="track">
          <div
            v-loading="loading"
            class="table_container">
            <el-table
              :span-method="arraySpanMethod(optionPlan)"
              :cell-style="changeCellStyle"
              :data="optionPlan">
              <el-table-column
                width="50px"
                label="各部门计划科目">
                <!-- <el-table-column
                  type="index"
                  width="50px"
                  label="编号" /> -->
                <el-table-column
                  prop="b1"
                  label="部门" />
                <el-table-column
                  label="关键计划科目">
                  <el-table-column
                    prop="b2"
                    label="关键工作计划科目" />
                  <el-table-column
                    :label="time">
                    <el-table-column
                      v-if="h3_sub.includes('sub1')"
                      label="第一周">
                      <template>
                        <div
                          class="name-wrapper " />
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="h3_sub.includes('sub2')"
                      label="第二周">
                      <template>
                        <div
                          class="name-wrapper " />
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="h3_sub.includes('sub3')"
                      label="第三周">
                      <template>
                        <div
                          class="name-wrapper " />
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="h3_sub.includes('sub4')"
                      prop="sub4"
                      label="第四周">
                      <template
                        slot-scope="scope">
                        <div
                          @click="($event, scope.row,'sub4')"
                          class="name-wrapper " />
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="h3_sub.includes('sub5')"
                      label="第五周">
                      <template>
                        <div
                          class="name-wrapper " />
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="h3_sub.includes('sub6')"
                      label="第六周">
                      <template>
                        <div
                          class="name-wrapper " />
                      </template>
                    </el-table-column>
                    <!-- <el-table-column
                      v-for="(x,index) in h3_sub"
                      :key="index"
                      :label='`第${index+1}周`' /> -->
                    <!-- <template
                      slot-scope="scope">
                      <div
                        class="name-wrapper ">
                        {{ scope }}11
                      </div>
                    </template> -->
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="b3"
                  label="交付结果">
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
                  label="部门负责人">
                  <template
                    slot-scope="scope">
                    <div
                      class="name-wrapper ">
                      {{ scope.row.b4 }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  class="cell_bag"
                  label="完成结果">
                  <template>
                    <div
                      class="name-wrapper " />
                  </template>
                </el-table-column>
              </el-table-column>

            </el-table>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import ManageRadar from '../ManageRadar';

//vuex
import { mapGetters } from 'vuex';

export default {
    components: {
        Card,
        SearchBar,
        ManageRadar
    },
    data () {
        return {
            optionPlan:[],
            //js
            loading: false,
            //views
            currView: '',
            h3_sub:[],
            time:''
        };
    },
    computed: {
        ...mapGetters(['orgradarArr','orggossipArr']),
    },
    watch: {
    },
    mounted () {
        this.currView = this.$route.params.name;
        this.getPlan();
    },
    methods: {
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
        changeCellStyle({ row,columnIndex }) {
            let lastColumnIndex = Object.keys(this.optionPlan[0]).length-1;
            for (let i=0;i<this.h3_sub.length;i++) {
                if (columnIndex == i+2) {
                    if(row[this.h3_sub[i]] == 'y') {
                        return 'background-color:#F2C811';
                    }else{
                        return 'background-color:#fff';
                    }
                }
            }
            if (columnIndex == lastColumnIndex) {
                if (row.b5 == 'r') {
                    return 'background-color:rgba(255,51,51,0.7)';
                } else {
                    return 'background-color:rgb(150, 206, 93)';
                }
            }
        },
        getPlan() {
            this.loading = true;
            API.GetPlanInner().then(res => {
                this.optionPlan = res.data.body;
                this.time = res.data.head.h3;
                this.h3_sub = Object.keys(res.data.head.h3_sub);
            }).finally(() => {
                this.loading = false;
            });
        },

    }
};
</script>

<style lang="scss" >
.outshaow1{
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
    .el-table th, .el-table .el-table__row{
        border-top: 1px solid #333;
        // border-left: 1px solid #333;
        td{
            border-left: 1px solid #333!important;
            border-bottom: 1px solid #333!important;
        }

        // &:hover {
        //         td {
        //             // border-color: #000!important;
        //             // border: none!important;
        //         }
        //         // td:first-child{
        //             // border: none!important;
        //         // }
        //     }

    }
    .track .table_container .el-table tbody > tr:first-child td{
        border-top: 1px solid #333!important;

    }
    .track .table_container .el-table tbody > tr:first-child td:first-child{
        border-top: 1px solid #333!important;
    }
    .el-table th, .el-table .el-table__row:last-child{
        border-top: 1px solid #333;
        border-left: 1px solid #333;

    }

    // tbody > tr{
    //         td {
    //             border-top: 1px solid transparent;
    //             border-bottom: 1px solid transparent;
    //             &:first-child {
    //                 border-left: 1px solid transparent;
    //             }
    //             &:last-child {
    //                 border-right: 1px solid transparent;
    //             }
    //         }
    //
    //     }
}
.manage_title {
    display: flex;
    justify-content: left;
    .supply_left{
        margin-left: 30px
    }
}

@import '../../Product/style/overview.scss';
@import '../../Product/style/track.scss'
</style>
