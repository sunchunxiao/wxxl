<template>
  <div class="nav-content">
    <el-row
      v-if="channelTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">同比环比趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in channelTrendArr">
                <el-col
                  :key="index"
                  :span="12">
                  <ProYearOnYearTrend
                    v-if="channelTrendArr.length"
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
      </div>
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
//data 指标
import { channel } from '../../../data/subject';

// 目标-实际-差异趋势分析
import ProYearOnYearTrend from 'components/ProYearOnYearTrend';

//vuex
import { mapGetters } from 'vuex';
export default {
    props: {
        cid: String,
        val: Object
    },
    components: {
        Card,
        ProYearOnYearTrend
    },
    data () {
        return {
            version: 0,
            //tree
            pt: '',
            loading: false,
            changeDate: {},
            newParams: {},
            //data
            channelSubject: channel(),
        };
    },
    computed: {
        ...mapGetters(['channelTree', 'channelTrendArr', 'channelLastParams']),
        hasTree () {
            return !_.isEmpty(this.channelTree);
        },
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
        getProgress() {
            const params = {
                chId: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            this.newParams.trend = params;
            if (JSON.stringify(this.channelLastParams.trend) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            const promises = _.map(this.channelSubject, o => this.getTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.channelSubject[k].subject;
                    v.subject_name = this.channelSubject[k].subject_name;
                });
                this.$store.dispatch('SaveChannelTrendArr', resultList);
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend(subject) {
            const params = {
                chId: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                subject: subject
            };
            this.newParams.trend = _.cloneDeep(params);
            delete this.newParams.trend.subject;
            return API.GetChannelTrend(params);
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
                // pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    // pt: pt,
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
    }
};
</script>

<style lang="scss">
@import '../../Product/style/overview.scss';
</style>
