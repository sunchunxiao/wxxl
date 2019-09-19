<template>
  <div class="nav-content">
    <el-row
      class="nav-content-row">
      <el-row
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="orgradarArr.length">
            <el-row class="margin-bottom-20 overview_title">商品部各细项指标评分</el-row>
            <ManageRadar
              v-if="orgradarArr.length"
              :id="'select'"
              :data="orgradarArr" />
            <el-row :gutter="20">
              <div class="radarTabel">
                <template>
                  <el-table
                    :cell-style="changeCellStyle"
                    width="100%"
                    height="100%"
                    :data="orgradarArr"
                    border>
                    <el-table-column
                      :label='title'>
                      <el-table-column
                        prop="name"
                        label="考核指标"
                        width="180" />
                      <el-table-column
                        prop="type"
                        label="指标类型"
                        width="180" />
                      <el-table-column
                        prop="score"
                        class="aaa"
                        :class="[{'bacColor':true}]"
                        label="得分"
                        width="180" />
                      <el-table-column
                        prop="weight"
                        label="权重"
                        width="180">
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{ scope.row.weight*100 + '%' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        width="180"
                        prop="weight_score"
                        label="加权得分" />
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </el-row>
            <!-- <el-row
              v-if="!loading && !orgradarArr"
              class="overview_select">
              暂无数据
            </el-row> -->
          </Card>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';

import Slider from 'components/Slider';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
import ManageRadar from 'components/ManageRadar';

//vuex
import { mapGetters } from 'vuex';

export default {
    name: "RadarWrap",
    props: {
        cid: String,
        name:String,
        date: Object,
        val: Object
    },
    components: {
        Card,
        Slider,
        ManageRadar,
        ProTargetAchievement,
    },
    data () {
        return {
            version: 0,
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            pt: '',
            loading: false,
            // val: {},
            newParams: {},
            sliderKey: "",
        };
    },
    computed: {
        ...mapGetters(['organizationTree', 'orgprogressArr', 'orgradarArr','', 'managelastParams','orgscore']),
        hasTree () {
            return !_.isEmpty(this.organizationTree);
        },
        title(){
            return this.name+' '+this.orgscore+'分';
        }
    },
    watch: {
        cid: {
            handler () {
                this.allRequest();
            },
            immediate: true
        },
        val() {
            this.allRequest();
        }
    },
    methods: {
        changeCellStyle({ row, columnIndex }) {
            // console.log(row, column, rowIndex, columnIndex );
            if(columnIndex == 2){
                if(row.score>=85){
                    return 'background-color:rgba(3,197,1,0.7)';
                } else if(row.score<85&&row.score>=60){
                    return 'background-color:rgba(255,255,3,0.6)';
                }else if(row.score<60){
                    return 'background-color:rgba(255,51,51,0.7)';
                }
            }
            //某一行其中的一个变量applies值如果大于0，并且在第六列，即确定一个具体的单元格需要确定行和列
            // if(parseFloat(row.applies) >0 && columnIndex == 5){
            //     return 'red';
            // }
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getProgress();
            this.getRank();
            this.$store.dispatch("SaveManageLastParams", this.newParams);
        },
        //目标达成
        getProgress() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version
            };
            this.newParams.progress = params;
            if (JSON.stringify(this.managelastParams.progress) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetOrgProgress(params).then(res => {
                this.sliderKey = new Date().getTime();
                this.$store.dispatch('SaveOrgProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //雷达图
        getRank() {
            if (this.getPt() === '日') {
                this.pt = '周';
            }else{
                this.pt = this.getPt();
            }
            const params = {
                cid: this.cid,
                pt: this.pt,
                ...this.getPeriodByPt(),
                version: this.version
            };
            this.newParams.radar = params;
            if (JSON.stringify(this.managelastParams.radar) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetRadar(params).then(res => {
                this.$store.dispatch('SaveOrgScore', res.data.tatal_score);
                this.$store.dispatch('SaveOrgRadarArr', res.data.list);
            }).finally(() => {
                this.loading = false;
            });
        },
        getPt() {
            if (this.val.sDate && this.val.eDate) {
                this.pt = this.val.pt;
            }
            return this.pt;
        },
        getDateObj() {
            return {
                sDate: this.val.sDate,
                eDate: this.val.eDate,
            };
        },
        getPeriodByPt() {
            const {
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    sDate: sDate,
                    eDate: eDate,
                };
            } else {
                return {
                    pt: '日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-31',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        clickIndex(i, idx) {
            this[`index${i}`] = idx;
        },
    }
};
</script>

<style lang="scss">
.radarTabel{
    width:901px;
    margin:0 auto;
    .el-table thead.is-group th {
        text-align: center!important;
        color: #000;
    }
    .el-table--enable-row-transition .el-table__body td{
        text-align: center;
        color: #000;
    }

}
.bacColor{
        background-color: green
    }
@import '../../../Product/style/overview.scss';
</style>
