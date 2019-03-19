<template>
  <div class="container">
    <div>
      <el-row>
        <el-col
          :span="24"
          class="home_overflow common">
          <Card
            v-loading="loading"
            id="brand"
            class="min-height-400">
            <slider
              v-if="brandPrograssArr.length>0"
              height="296px"
              :min-move-num="50">
              <template v-for="(item, index) in brandPrograssArr">
                <el-col
                  v-if="brandPrograssArr.length>0"
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
            <div class="card_company_target">
              <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
                <span class="card_title">{{ hasSubjectName }} </span>
                <span
                  class="card_title"
                  v-if="homeEquity[index].subject_unit"> ( {{ homeEquity[index].subject_unit }} )</span>
              </el-row>
              <template>
                <el-col
                  v-if="brandTrendArr.length>0"
                  :key="index">
                  <ProTargetActualDiffTrend
                    :unit="homeEquity[index].subject_unit"
                    :show-detail="false"
                    :id="`product${index}`"
                    :data="brandTrendArr[index]" />
                </el-col>
              </template>
            </div>
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
import Slider from 'components/Slider';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
//vuex
import { mapGetters } from 'vuex';
//data
import { homeEquity } from 'data/subject.js';

export default {
    components: {
        Card,
        Slider,
        SearchBar,
        ProTargetAchievement,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            homeEquity: homeEquity(),
            form: {
                pt: '', // 周期类型
                search: '', // 暂时没有接口 先这样
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
        ...mapGetters(['brandPrograssArr', 'brandTrendArr', 'searchDate','homeLastParams']),
        hasSubjectName() {
            return this.homeEquity[this.index].subject_name;
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
        getOverviewTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetOverviewTrend(params);
        },
        //品牌价值
        getBrandProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version: 0
            };
            API.GetBrandProgress(params).then(res => {
                this.$store.dispatch('SaveBrandProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeBrand) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeBrand = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getBrandProgress();
            const promises = _.map(this.homeEquity, o => this.getBrandTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeEquity[k].subject;
                    v.subject_name = this.homeEquity[k].subject_name;
                });
                this.$store.dispatch('SaveBrandTrendArr', resultList);
            });
        },
        getBrandTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version: 0
            };
            return API.GetBrandTrend(params);
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
   @import '../Product/style/overview.scss';
   @import './style/home.scss'
</style>
