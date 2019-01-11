<template>
  <div class="nav-content">
    <el-row
      v-if="organizationTree"
      class="nav-content-row">
      <el-col
        class="overflow">
        <el-row
          v-if="orgtrendArr.length>0"
          v-loading="loading"
          class="">
          <Card>
            <el-row class="margin-bottom-20 overview_title">目标-实际-差异趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in orgtrendArr">
                <el-col
                  :key="index"
                  :span="12">
                  <ProTargetActualDiffTrend
                    v-if="orgtrendArr.length"
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
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

// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';

//vuex
import { mapGetters } from 'vuex';
export default {
    props: {
        cid: String,
        val: Object
    },
    components: {
        Card,
        ProTargetActualDiffTrend,
    },
    data () {
        return {
            version: 0,
            //tree
            pt: '',
            loading: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['organizationTree', 'orgprogressArr', 'orgtrendArr', 'orglastParams']),
        hasTree () {
            return !_.isEmpty(this.organizationTree);
        },
    },
    watch: {
        cid: {
            handler() {
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
        getProgress() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version
            };
            this.newParams.diff = params;
            if (JSON.stringify(this.orglastParams.diff) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetOrgProgress(params).then(res => {
                this.$store.dispatch('SaveOrgProgressData', res.data);
                const promises = _.map(res.data, o => this.getTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveOrgTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend(subject) {
            this.loading = true;
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                subject: subject,
                version: this.version
            };
            return API.GetOrgTrend(params);
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
