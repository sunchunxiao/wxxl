<template>
  <div class="container">
    <el-row>
      <el-col
        :span="24"
        class="home_overflow common">
        <Card
          v-loading="loading"
          class="min-height-400">
          <el-row>
            <el-col
              :span="24"
              v-if="salePrograssArr.length">
              <template v-for="(item, index) in salePrograssArr">
                <el-col
                  v-if="salePrograssArr.length>0"
                  :key="index"
                  style="width:180px">
                  <ProTargetAchievement
                    :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                    @click.native="clickIndex(index)"
                    :id="`${index}`"
                    :data="item" />
                </el-col>
              </template>
            </el-col>
            <el-col :span="14">
              <div class="card_company_target">
                <el-row class="margin-top-50 align">目标-实际-差异趋势分析:
                  <span class="card_title">{{ sales[index].subject_name }} </span>
                  <span
                    class="card_title"
                    v-if="sales[index].subject_unit"> ( {{ sales[index].subject_unit }} )</span></el-row>
                <template>
                  <el-col
                    v-if="saleTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :unit="sales[index].subject_unit"
                      :show-detail="false"
                      :id="`overview${index}`"
                      :data="saleTrendArr[index]" />
                  </el-col>
                </template>
              </div>
            </el-col>
            <el-col
              class="margin-top-10"
              :span="10">
              <div class="tip">
                <span class="colorSpan positive" />
                <span class="content"> 正向指标达成率(x)</span>
                <span class="colorSpan negative" />
                <span class="content"> 反向指标达成率(2-x)</span>
              </div>
              <radar
                v-if="salesRadarObj"
                :id="'salesRadar'"
                :data="salesRadarObj" />
            </el-col>
          </el-row>
        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import ProTargetAchievement from 'components/ProTargetAchievement';// 目标达成情况总览
import radar from './radar';
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';// 目标-实际-差异趋势分析
import { mapGetters } from 'vuex';
import { sales } from 'data/subject.js';

export default {
    components: {
        Card,
        SearchBar,
        ProTargetAchievement,
        radar,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            sales: sales(),
            form: {
                pt: '', // 周期类型
            },
            cid: '',
            loading: false,
            index: 0,
            style: undefined,
            opciatyBool: false,
            newParams: {},
        };
    },
    computed: {
        ...mapGetters(['salePrograssArr', 'saleTrendArr', 'searchDate', 'homeLastParams','salesRadarObj']),
    },
    mounted() {
        if(Object.keys(this.searchDate).length) {
            this.allRequest();
        }
    },
    watch: {
        searchDate() {
            this.allRequest();
        }
    },
    methods: {
        clickIndex(idx) {
            this.index = idx;
            this.style = idx;
            this.opciatyBool = true;
        },
        select(index) {
            this.style = index;
        },
        //销售
        getOverviewProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version:0
            };
            API.GetSaleProgress(params).then(res => {
                let salesRadarObj = {};
                salesRadarObj.name = res.data.map(el => el.subject_name);
                salesRadarObj.progress = res.data.map(el => el.progress);
                salesRadarObj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveSalesRadarObj', salesRadarObj);
                this.$store.dispatch('SaveSaleProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeSales) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeSales = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getOverviewProgress();
            const promises = _.map(this.sales, o => this.getOverviewTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.sales[k].subject;
                    v.subject_name = this.sales[k].subject_name;
                });
                this.$store.dispatch('SaveSaleTrendArr', resultList);
            });
        },
        getOverviewTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version:0
            };
            return API.GetSaleTrend(params);
        },
        getDateObj () {
            if (this.searchDate.sDate && this.searchDate.eDate) {
                return {
                    pt: this.searchDate.pt,
                    sDate: this.searchDate.sDate,
                    eDate: this.searchDate.eDate,
                };
            }
        },
        getPeriodByPt () {
            const {
                pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    pt: pt,
                    sDate: sDate,
                    eDate: eDate,
                };
            }
        },
    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
