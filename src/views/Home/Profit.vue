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
            <el-col :span="16">
              <slider
                v-if="profitPrograssArr.length"
                height="295px"
                :min-move-num="50">
                <template v-for="(item, index) in profitPrograssArr">
                  <el-col
                    v-if="profitPrograssArr.length>0"
                    :key="index"
                    style="width:198px">
                    <ProTargetAchievement
                      :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                      @click.native="clickIndex(index)"
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </slider>
            </el-col>
            <el-col :span="8">
              <radar
                v-if="profitRadarObj"
                :id="'profitRadar'"
                :data="profitRadarObj" />
            </el-col>
            <el-col :span="24">
              <div class="card_company_target">
                <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
                  <span class="card_title">{{ profit[index].subject_name }} </span>
                  <span
                    class="card_title"
                    v-if="profit[index].subject_unit"> ( {{ profit[index].subject_unit }} )</span>
                </el-row>
                <template>
                  <el-col
                    v-if="profitTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :unit="profit[index].subject_unit"
                      :show-detail="false"
                      :id="`overview${index}`"
                      :data="profitTrendArr[index]" />
                  </el-col>
                </template>
              </div>
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
import Slider from 'components/Slider';
import ProTargetAchievement from 'components/ProTargetAchievement';// 目标达成情况总览
import radar from './radar';
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';// 目标-实际-差异趋势分析
import { mapGetters } from 'vuex';
import { profit } from 'data/subject.js';

export default {
    components: {
        Card,
        Slider,
        SearchBar,
        ProTargetAchievement,
        radar,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            profit: profit(),
            form: {
                pt: '', // 周期类型
                search: '',
            },
            cid: '',
            loading: false,
            //index
            index: 0,
            style: undefined,
            opciatyBool: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['profitPrograssArr','profitTrendArr', 'searchDate', 'homeLastParams','profitRadarObj']),
    },
    mounted() {
        if(Object.keys(this.searchDate).length){
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
        //利润
        getOverviewProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version:0
            };
            API.GetProfitProgress(params).then(res => {
                let profitRadarObj = {};
                profitRadarObj.name = res.data.map(el => el.subject_name);
                profitRadarObj.progress = res.data.map(el => el.progress);
                this.$store.dispatch('SaveProfitRadarObj', profitRadarObj);
                this.$store.dispatch('SaveProfitProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeProfit) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeProfit = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getOverviewProgress();
            const promises = _.map(this.profit, o => this.getOverviewTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.profit[k].subject;
                    v.subject_name = this.profit[k].subject_name;
                });
                this.$store.dispatch('SaveProfitTrendArr', resultList);
            });
        },
        getOverviewTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version: 0
            };
            return API.GetProfitTrend(params);
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
            } else {
                return {
                    pt: '月',
                    sDate: '2018-01-01',
                    eDate: '2018-06-01',
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
