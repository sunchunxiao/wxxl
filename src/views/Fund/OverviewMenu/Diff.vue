<template>
  <div class="nav-content">
    <el-row
      v-if="fundTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">目标-实际-差异趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in fundtrendArr">
                <el-col
                  :key="index"
                  :span="12">
                  <ProTargetActualDiffTrend
                    v-if="fundtrendArr.length"
                    :unit="getUnit(item)"
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
import { fund, fundBack } from 'data/subject';

// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';

//vuex
import { mapGetters } from 'vuex';
export default {
    props: {
        cid: String,
        val: Object,
        type: Number
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
            newParams: {},
            //data
            fundSubject: fund(),
            fundBackSubject: fundBack(),
        };
    },
    computed: {
        ...mapGetters(['fundTree','fundtrendArr', 'fundlastParams']),
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
        getUnit(item) {
            let subjectData = this.type != 2 ? this.fundSubject : this.fundBackSubject;
            let obj = subjectData.find(el => {
                return el.subject == item.subject && el.subject_name == item.subject_name;
            });
            return obj ? obj.subject_unit : "";
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getProgress();
            this.$store.dispatch("SaveFundLastParams", this.newParams);
        },
        getProgress() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version
            };
            this.newParams.trend = params;
            if (JSON.stringify(this.fundlastParams.trend) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            let subjectData = this.type != 2 ? this.fundSubject : this.fundBackSubject;
            const promises = _.map(subjectData, o => this.getTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = subjectData[k].subject;
                    v.subject_name = subjectData[k].subject_name;
                });
                this.$store.dispatch('SaveFundTrendArr', resultList);
            }).finally(() => {
                this.loading = false;
            });
        },
        getTrend(subject) {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                subject: subject,
                version: this.version
            };
            this.newParams.diff = _.cloneDeep(params);
            delete this.newParams.diff.subject;
            return API.GetFundTrend(params);
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
