<template>
  <div class="container">
    <div>
      <el-row>
        <el-col
          :span="24"
          class="home_overflow common">
          <el-row
            id="produce"
            class="">
            <el-row v-if="pieProfit.length>0">
              <el-row
                v-loading="loading">
                <Card>
                  <el-row>
                    <el-col>
                      <template v-for="(item, index) in pieProfit">
                        <el-col
                          v-if="pieProfit.length>0"
                          :key="index"
                          :span="4">
                          <ProTargetAchievement
                            :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                            @click.native="clickIndex(index)"
                            :id="`${index}`"
                            :data="item" />
                        </el-col>
                      </template>
                    </el-col>
                  </el-row>
                </Card>
              </el-row>
            </el-row>
            <el-row>
              <Card>
                <div class="card_company_target">
                  <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
                  <span class="card_title">净利润额 ( 万元 ) </span></el-row>
                  <template>
                    <el-col
                      v-if="dataProfitTrend.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :id="`product${index}`"
                        :data="dataProfitTrend[index]" />
                    </el-col>
                  </template>
                </div>
              </Card>
            </el-row>
            <!-- <el-row
              v-else
              class="home_select">
              加载中
            </el-row> -->
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
//mock
import { pieProfit } from './mock/pieData';
import { dataProfitTrend } from './mock/trendData';
import { mapGetters } from 'vuex';

const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const MENUDATA = [
    {
        title:'公司经营指标',
        path:'#overview',
    },
    {
        title:'产品效率',
        path:'#produce',
    },
    {
        title:'渠道效率',
        path:'#channel',
    },
    {
        title:'客户效率',
        path:'#customer',
    },
    {
        title:'组织效率',
        path:'#organization',
    },
    {
        title:'资金效率',
        path:'#fund',
    },
];

export default {
    components: {
        Card,
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
            menuData: MENUDATA,
            pieProfit: pieProfit(),
            dataProfitTrend: dataProfitTrend(),
            cid: '',
            defaultProps: TREE_PROPS,
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
        ...mapGetters(['overviewArr','overviewTrendArr','productArr','productTrendArr','channelArr','channelTrendArr','orgHomeArr','orgTrendArr','fundHomeArr','fundHomeTrendArr','cusHomeArr','cusHomeTrendArr']),
        hasTree() {
            return !_.isEmpty(this.productArr);
        }
    },
    mounted() {
        this.getProductProgress();
    },
    watch: {
        val() {
            this.getProductProgress();
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
                const promises = _.map(res.data, o => this.getProductTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveProductTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
        },
        getProductTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetProductTrend(params);
        },
        //渠道
        getChannelProgress() {
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetChannelProgress(params).then(res=>{
                this.$store.dispatch('SaveChannelProgressData', res.data);
                const promises = _.map(res.data, o => this.getChannelTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveChannelTrendArr', resultList);
                });
            });
        },
        getChannelTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetChannelTrend(params);
        },
        //组织
        getOrgProgress() {
            const params = {
                ...this.getPeriodByPt(),
                version:0
            };
            API.GetOrgProgress(params).then(res=>{
                this.$store.dispatch('SaveOrgHomeProgress', res.data);
                const promises = _.map(res.data, o => this.getOrgTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveOrgHomeTrendArr', resultList);
                });
            });
        },
        getOrgTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version:0
            };
            return API.GetOrgTrend(params);
        },
        //资金
        getFundProgress() {
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
        //客户
        getCusProgress() {
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetCusProgress(params).then(res=>{
                this.$store.dispatch('SaveCusHomeProgress', res.data);
                const promises = _.map(res.data, o => this.getCusTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveCusHomeTrendArr', resultList);
                });
            });
        },
        getCusTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetCusTrend(params);
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
