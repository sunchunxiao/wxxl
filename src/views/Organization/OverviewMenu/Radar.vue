<template>
  <div class="nav-content">
    <el-row
      class="nav-content-row">
      <el-row
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="orgrankArr.length || orgprogressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <!-- <div
              class="margin-bottom-20"
              style="height:250px;"> -->
            <!-- <slider
              height="250px"
              :key="sliderKey"
              v-if="orgprogressArr.length"
              class="margin-bottom-20"
              :min-move-num="50"> -->
            <el-col :span="16">
              <template v-for="(item, index) in orgprogressArr">
                <el-col
                  :key="index"
                  style="width:198px">
                  <ProTargetAchievement
                    v-if="orgprogressArr.length"
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
                v-if="orgrankArr.length"
                :id="'select'"
                :data="orgrankArr[orgrankArr.length-1]" />
            </el-col>
            <el-row
              v-if="!loading && !orgrankArr.length"
              class="overview_select">
              暂无数据
            </el-row>
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
            newParams: {},
            sliderKey: "",
        };
    },
    computed: {
        ...mapGetters(['organizationTree', 'orgprogressArr', 'orgrankArr', 'orglastParams']),
        hasTree () {
            return !_.isEmpty(this.organizationTree);
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
            this.$store.dispatch("SaveOrgLastParams", this.newParams);
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
            if (JSON.stringify(this.orglastParams.progress) == JSON.stringify(params)) {
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
            } else {
                this.pt = this.getPt();
            }
            const params = {
                cid: this.cid,
                pt: this.pt,
                ...this.getPeriodByPt(),
                version: this.version
            };
            this.newParams.rank = params;
            if (JSON.stringify(this.orglastParams.rank) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetOrgRank(params).then(res => {
                this.$store.dispatch('SaveOrgRankArr', res.data);
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
