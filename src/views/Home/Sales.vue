<template>
  <div class="container">
    <el-row>
      <el-col
        :span="24"
        class="home_overflow common">
        <el-row
          id="sales">
          <Card
            v-loading="loading"
            class="min-height-400">
            <slider
              height="296px"
              v-if="overviewArr.length"
              :min-move-num="50">
              <template v-for="(item, index) in [overviewArr[0]]">
                <el-col
                  v-if="overviewArr.length>0"
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
                  v-if="sales[index].subject_unit"> ( {{ sales[index].subject_unit }} )</span></el-row>
              <template>
                <el-col
                  v-if="overviewTrendArr.length>0"
                  :key="index">
                  <ProTargetActualDiffTrend
                    :unit="sales[index].subject_unit"
                    :show-detail="false"
                    :id="`overview${index}`"
                    :data="overviewTrendArr[index]" />
                </el-col>
              </template>
            </div>
          </Card>
        </el-row>
      </el-col>
    </el-row>
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
import { pieSales } from './mock/pieData';
import { dataSales } from './mock/trendData';
import { mapGetters } from 'vuex';
//data
import { sales } from 'data/subject.js';
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
            sales: sales(),
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            datye:{},
            //mock
            pieSales:pieSales(),
            dataSales: dataSales(),
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
        ...mapGetters(['overviewArr', 'overviewTrendArr', 'searchDate', 'homeLastParams']),
        hasSubjectName() {
            if (this.overviewTrendArr.length) {
                return this.overviewTrendArr[this.index].subject_name;
            }
        }
    },
    created() {
        this.form.date = this.searchDate;
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
        //公司
        getOverviewProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetOverviewProgress(params).then(res => {
                this.$store.dispatch('SaveOverviewProgressData', res.data);
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
                this.$store.dispatch('SaveOverviewTrendArr', resultList);
            });
        },
        getOverviewTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetOverviewTrend(params);
        },
        getDateObj () {
            const {
                date
            } = this.form;
            if (this.searchDate.sDate && this.searchDate.eDate) {
                return {
                    pt: this.searchDate.pt,
                    sDate: this.searchDate.sDate,
                    eDate: this.searchDate.eDate,
                };
            } else {
                return {
                    pt: date.pt,
                    sDate: date.sDate,
                    eDate: date.eDate,
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
