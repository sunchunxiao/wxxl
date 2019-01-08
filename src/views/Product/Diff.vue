<template>
  <div class="nav-content">
    <el-row
      v-if="productTree"
      class="nav-content-row"
      :gutter="20">
      <el-col
        :span="17"
        class="overflow">
        <el-row
          v-if="trendArr.length>0"
          v-loading="loading"
          class="">
          <Card>
            <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in trendArr">
                <el-col
                  :key="index"
                  :span="12"
                  @click.native="clickIndex(1 ,index)">
                  <ProTargetActualDiffTrend
                    v-if="trendArr.length"
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
import API from './api';
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
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            //tree
            pt: '',
            loading: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['productTree', 'progressArr', 'trendArr', 'lastParams']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        },
    },
    watch: {
        cid: {
            handler() {
                this.allRequest();
            },
            immediate: true
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
        }
    },
    methods: {
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getProgress();
            this.$store.dispatch("SaveLastParams", this.newParams);
        },
        getProgress() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            this.newParams.diff = params;
            if (JSON.stringify(this.lastParams.diff) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetProductProgress(params).then(res => {
                this.$store.dispatch('SaveProgressData', res.data);
                const promises = _.map(res.data, o => this.getTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveTrendArr', resultList);
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
                subject: subject
            };
            return API.GetProductTrend(params);
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
@import './style/overview.scss';
</style>
