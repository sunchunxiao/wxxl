<template>
  <div class="nav-content">
    <el-row
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="fundrankArr.length || fundprogressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <div
              class="margin-bottom-20"
              style="height:250px;">
              <slider
                v-if="fundprogressArr.length"
                height="250px"
                :min-move-num="50">
                <template v-for="(item, index) in fundprogressArr">
                  <el-col
                    :key="index"
                    style="width:198px">
                    <ProTargetAchievement
                      v-if="fundprogressArr.length"
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </slider>
            </div>

            <el-row class="margin-bottom-20 overview_title">综合评估</el-row>
            <Radar
              v-if="fundrankArr.length"
              :id="'select'"
              :data="fundrankArr[fundrankArr.length-1]" />
            <el-row
              v-if="!loading && !fundrankArr.length"
              class="overview_select">
              暂无数据
            </el-row>
          </Card>
        </el-row>
      </div>
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
            version: 0,
            pt: '',
            loading: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['fundTree', 'fundprogressArr', 'fundrankArr', 'fundlastParams']),
        hasTree () {
            return !_.isEmpty(this.fundTree);
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
            this.$store.dispatch("SaveFundLastParams", this.newParams);
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
            if (JSON.stringify(this.fundlastParams.progress) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetFundProgress(params).then(res => {
                this.$store.dispatch('SaveFundProgressData', res.data);
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
            this.newParams.rank = params;
            if (JSON.stringify(this.fundlastParams.rank) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetFundRank(params).then(res => {
                this.$store.dispatch('SaveFundRankArr', res.data);
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
