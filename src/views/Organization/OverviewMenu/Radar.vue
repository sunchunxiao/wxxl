<template>
  <div class="nav-content">
    <el-row
      class="nav-content-row">
      <el-row
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="orgprogressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <el-col :span="13">
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
            <el-col
              :span="11">
              综合评估
              <radar
                v-if="orgReachRadarObj"
                :id="'orgReachRadar'"
                :data="orgReachRadarObj" />
            </el-col>
          </Card>
        </el-row>
      </el-row>
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
            sliderKey: "",
        };
    },
    computed: {
        ...mapGetters(['organizationTree', 'orgprogressArr', 'orglastParams', 'orgReachRadarObj']),
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
                let orgReachRadarObj = {};
                orgReachRadarObj.name = res.data.map(el => el.subject_name);
                orgReachRadarObj.progress = res.data.map(el => el.progress);
                orgReachRadarObj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveOrgReachRadar', orgReachRadarObj);
                this.$store.dispatch('SaveOrgProgressData', res.data);
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
