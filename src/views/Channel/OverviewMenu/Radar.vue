<template>
  <div class="nav-content">
    <el-row
      v-if="channelTree"
      class="nav-content-row">
      <el-col
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="channelRankArr.length || channelProgressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <!-- <div
              class="margin-bottom-20"
              style="height:250px;"> -->
            <!-- <slider
              v-if="channelProgressArr.length"
              height="250px"
              :min-move-num="50"> -->
            <el-col :span="16">
              <template v-for="(item, index) in channelProgressArr">
                <el-col
                  :key="index"
                  style="width:198px">
                  <ProTargetAchievement
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </el-col>
            <!-- </slider> -->
            <!-- </div> -->
            <!-- <el-row class="margin-bottom-20 overview_title">综合评估</el-row> -->
            <el-col
              :span="8">
              综合评估
              <Radar
                v-if="channelRankArr.length"
                :id="'select'"
                :data="channelRankArr[channelRankArr.length-1]" />
            </el-col>
            <el-row
              v-if="!loading && !channelRankArr.length"
              class="overview_select">
              暂无数据
            </el-row>
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
            version: 0,
            pt: '',
            loading: false,
            // val: {},
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['channelTree', 'channelProgressArr', 'channelRankArr', 'channelLastParams']),
        hasTree () {
            return !_.isEmpty(this.channelTree);
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
            this.$store.dispatch("SaveChannelLastParams", this.newParams);
        },
        //目标达成
        getProgress() {
            this.loading = true;
            const params = {
                chId: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            API.GetChannelProgress(params).then(res => {
                this.$store.dispatch('SaveChannelProgress', res.data);
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
            this.loading = true;
            const params = {
                chId: this.cid,
                pt: this.pt,
                ...this.getPeriodByPt(),
            };
            API.GetChannelRank(params).then(res => {
                this.$store.dispatch('SaveChannelRankArr', res.data);
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
