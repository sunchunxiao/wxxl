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
              v-if="pieEquity.length>0"
              height="296px"
              :min-move-num="50">
              <template v-for="(item, index) in pieEquity">
                <el-col
                  v-if="pieEquity.length>0"
                  :key="index"
                  :span="4">
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
                  v-if="dataEquity.length>0"
                  :key="index">
                  <ProTargetActualDiffTrend
                    :unit="homeEquity[index].subject_unit"
                    :show-detail="false"
                    :id="`product${index}`"
                    :data="dataEquity[index]" />
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
//mock
import { pieEquity } from './mock/pieData';
import { dataEquity } from './mock/trendData';
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
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            datye:{},
            // pieSales: pieDataSales,
            pieEquity: pieEquity(),
            dataEquity: dataEquity(),
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
        ...mapGetters(['searchDate']),
        hasSubjectName() {
            return this.dataEquity[this.index].subject_name;
        }
    },
    mounted() {
        if(Object.keys(this.searchDate).length){
            // this.allRequest();
        }
    },
    watch: {
        searchDate() {
            // this.allRequest();
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
        //产品
        getProductProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetProductProgress(params).then(res => {
                this.$store.dispatch('SaveProductProgressData', res.data);

            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            this.getProductProgress();
            const promises = _.map(this.homeEquity, o => this.getProductTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeEquity[k].subject;
                    v.subject_name = this.homeEquity[k].subject_name;
                });
                this.$store.dispatch('SaveProductTrendArr', resultList);
            });
        },
        getProductTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetProductTrend(params);
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
        handleSearch(searchDate) {
            // 默认公司的背景色
            this.searchDate = searchDate;
        },

    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
