<template>
  <div class="container">
    <div>
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
                v-if="gainPrograssArr.length>0">
                <template v-for="(item, index) in gainPrograssArr">
                  <el-col
                    v-if="gainPrograssArr.length>0"
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
                  <el-row class="margin-top-20 margin-bottom-20 align">目标-实际-差异趋势分析:
                    <span class="card_title">{{ hasSubjectName }} </span>
                    <span
                      class="card_title"
                      v-if="homeProfitSpace[index].subject_unit"> ( {{ homeProfitSpace[index].subject_unit }} )</span></el-row>
                  <template>
                    <el-col
                      v-if="gainTrendArr.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :unit="homeProfitSpace[index].subject_unit"
                        :show-detail="false"
                        :id="`product${index}`"
                        :data="gainTrendArr[index]" />
                    </el-col>
                  </template>
                </div>
              </el-col>
              <el-col
                class="margin-top-50"
                :span="10">
                <div
                  class="tip"
                  v-show="false">
                  <span class="colorSpan positive" />
                  <span class="content"> 正向指标达成率(x)</span>
                  <span class="colorSpan negative" />
                  <span class="content"> 反向指标达成率(2-x)</span>
                </div>
                <radar
                  v-if="profitSpaceRadarObj"
                  :id="'profitSpaceRadar'"
                  :data="profitSpaceRadarObj" />
              </el-col>
            </el-row>
          </Card>
        </el-col>
      </el-row>
    </div>
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
import { homeProfitSpace } from 'data/subject.js';

export default {
    components: {
        Card,
        radar,
        SearchBar,
        ProTargetAchievement,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            homeProfitSpace: homeProfitSpace(),
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
        ...mapGetters(['gainPrograssArr', 'gainTrendArr', 'searchDate', 'homeLastParams','profitSpaceRadarObj']),
        hasSubjectName() {
            if (this.gainTrendArr.length) {
                return this.homeProfitSpace[this.index].subject_name;
            }
        }
    },
    mounted() {
        if (Object.keys(this.searchDate).length) {
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
        //盈利空间
        getOverviewProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version: 0
            };
            API.GetGainProgress(params).then(res => {
                let obj = {};
                obj.name = res.data.map(el => el.subject_name);
                obj.progress = res.data.map(el => el.progress);
                obj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveSpaceRadar', obj);
                this.$store.dispatch('SaveGainProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeSpace) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeSpace = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getOverviewProgress();
            const promises = _.map(this.homeProfitSpace, o => this.getOverviewTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeProfitSpace[k].subject;
                    v.subject_name = this.homeProfitSpace[k].subject_name;
                });
                this.$store.dispatch('SaveGainTrendArr', resultList);
            });
        },
        getOverviewTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version: 0
            };
            return API.GetGainTrend(params);
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
