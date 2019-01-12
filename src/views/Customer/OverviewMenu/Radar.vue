<template>
  <div class="nav-content">
    <el-row
      v-if="customerTree"
      class="nav-content-row">
      <el-col
        class="overflow">
        <el-row
          v-if="cusprogressArr.length>0"
          v-loading="loading"
          class="">
          <Card>
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <slider
              height="250px"
              :min-move-num="50">
              <template v-for="(item, index) in cusprogressArr">
                <el-col
                  :key="index"
                  style="width:198px">
                  <ProTargetAchievement
                    v-if="cusprogressArr.length"
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </slider>
            <Card>
              <el-col
                class="">
                <el-row class="margin-bottom-20 overview_title">综合评估</el-row>
                <Radar
                  v-if="cusrankArr.length"
                  :id="'select'"
                  :data="cusrankArr[cusrankArr.length-1]" />
                <el-row
                  v-else
                  class="overview_select">
                  暂无数据
                </el-row>
              </el-col>
            </Card>
          </Card>
        </el-row>
      </el-col>
    </el-row>
    <el-row
      v-else
      class="overview_select">
      暂无数据
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';

import Slider from 'components/Slider';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
import Radar from 'components/radar';

//vuex
import { mapGetters } from 'vuex';

export default {
    name: "RadarWrap",
    props: {
        cid: String,
        date: Object,
        val: Object
    },
    components: {
        Card,
        Slider,
        Radar,
        ProTargetAchievement,
    },
    data () {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            pt: '',
            loading: false,
            // val: {},
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['customerTree', 'cusprogressArr', 'cusrankArr', 'cusLastParams']),
        hasTree () {
            return !_.isEmpty(this.customerTree);
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
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getProgress();
            this.getRank();
            this.$store.dispatch("SaveCustLastParams", this.newParams);
        },
        //目标达成
        getProgress() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            this.newParams.progress = params;
            if (JSON.stringify(this.cusLastParams.progress) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetCusProgress(params).then(res => {
                this.$store.dispatch('SaveCusProgressData', res.data);
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
            };
            this.newParams.rank = params;
            if (JSON.stringify(this.cusLastParams.rank) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetCusRank(params).then(res => {
                this.$store.dispatch('SaveCusRankArr', res.data);
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
@import '../../Product/style/overview.scss';
</style>
