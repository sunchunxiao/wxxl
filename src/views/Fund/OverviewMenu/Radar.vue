<template>
  <div class="nav-content">
    <el-row
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="fundprogressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <el-col :span="16">
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
            </el-col>
            <el-col
              :span="8">
              综合评估
              <radar
                v-if="fundReachRadarObj"
                :id="'fundReachRadar'"
                :data="fundReachRadarObj" />
            </el-col>
          </Card>
        </el-row>
      </div>
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
            newParams: {},
            sliderKey: ""
        };
    },
    computed: {
        ...mapGetters(['fundTree', 'fundprogressArr', 'fundlastParams', 'fundReachRadarObj']),
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
                this.sliderKey = new Date().getTime();
                res.data.map(i=>{i.divide=1;});
                let fundReachRadarObj = {};
                fundReachRadarObj.name = res.data.map(el => el.subject_name);
                fundReachRadarObj.progress = res.data.map(el => el.progress);
                fundReachRadarObj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveFundReachRadar', fundReachRadarObj);
                this.$store.dispatch('SaveFundProgressData', res.data);
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
