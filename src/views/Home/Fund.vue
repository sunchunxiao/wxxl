<template>
  <div class="container">
    <el-row
      :gutter="20">
      <el-col
        :span="25"
        class="home_overflow common">
        <Card
          v-loading="loading"
          id="fund"
          class="min-height-400">
          <slider
            v-if="fundHomeArr.length>0"
            height="296px"
            :min-move-num="50">
            <template v-for="(item, index) in fundHomeArr">
              <el-col
                v-if="fundHomeArr.length>0"
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
            <span class="card_title">{{ hasSubjectName }} ( 万元 ) </span></el-row>
            <template>
              <el-col
                v-if="fundHomeTrendArr.length>0"
                :key="index">
                <ProTargetActualDiffTrend
                  :show-detail="false"
                  :id="`fund${index}`"
                  :data="fundHomeTrendArr[index]" />
              </el-col>
            </template>
          </div>
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
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
//mock
import { dataSales } from './mock/trendData';
import { mapGetters } from 'vuex';

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
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            cid: '',
            // mock
            dataSales: dataSales(),
            loading: false,
            //index
            index: 0,
            // stragety
            val: {},
            post: 1,
            style: undefined,
            opciatyBool: false
        };
    },
    computed: {
        ...mapGetters(['fundHomeArr', 'fundHomeTrendArr', 'searchDate']),
        hasSubjectName() {
            if (this.fundHomeTrendArr.length) {
                return this.fundHomeTrendArr[this.index].subject_name;
            }
        }
    },
    created() {
        this.form.date = this.searchDate;
    },
    mounted() {
        this.getFundProgress();
    },
    watch: {
        searchDate() {
            this.val = this.searchDate;
        },
        val() {
            this.getFundProgress();
        }
    },
    methods: {
        clickIndex(idx) {
            this.index = idx;
            this.style = idx;
            this.opciatyBool = true;
        },
        input(val) {
            this.form.date = val;
        },
        select(index) {
            this.style = index;
        },
        //资金
        getFundProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version:0
            };
            API.GetFundProgress(params).then(res=>{
                this.$store.dispatch('SaveFundHomeProgress', res.data);
                const promises = _.map(res.data, o => this.getFundTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveFundHomeTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
        },
        getFundTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version:0
            };
            return API.GetFundTrend(params);
        },
        getDateObj () {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                return {
                    pt: this.val.pt,
                    sDate: this.val.sDate,
                    eDate: this.val.eDate,
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
        handleSearch(val) {
            // 默认公司的背景色
            this.val = val;
        },

    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
