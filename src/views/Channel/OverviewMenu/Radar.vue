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
          <Card v-if="channelProgressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <el-col :span="13">
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
            <el-col
              :span="11">
              综合评估
              <radar
                v-if="channelReachRadarObj"
                :id="'channelReachRadar'"
                :data="channelReachRadarObj" />
            </el-col>
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
import ProTargetAchievement from 'components/ProTargetAchievement';// 目标达成情况总览
import radar from '../../Home/radar';
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
        radar,
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
        ...mapGetters(['channelTree', 'channelProgressArr', 'channelLastParams', 'channelReachRadarObj']),
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
                let channelReachRadarObj = {};
                channelReachRadarObj.name = res.data.map(el => el.subject_name);
                channelReachRadarObj.progress = res.data.map(el => el.progress);
                channelReachRadarObj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveChannelReachRadar', channelReachRadarObj);
                this.$store.dispatch('SaveChannelProgress', res.data);
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
