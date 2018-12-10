<template>
  <div class="overview">
    <el-row>
      <search-bar
        @input="input"
        @search="handleSearch"
        ref="child"
        url="/home/search"
        :pt-options="['月', '季', '年']" />
    </el-row>
    <el-row
      class="content_row padding_top "
      :gutter="20">
      <el-col
        :span="5"
        class="tree_container1">
        <div class="homeSlider">
          <div class="slider_header">首页</div>
          <div class="slider_menu">
            <template v-for="(item,index) in menuData">
              <a
                class="menu_list"
                :href="item.path"
                @click="select(index)"
                :class="{'menu_list_select':style==index}"
                :key="item.path">{{ item.title }}
                <span :class="{'company_before':style==index}" />
                <img
                  class="menu_list_img"
                  src="../../assets/right.png"
                  alt=""></a>
            </template>
          </div>
        </div>
      </el-col>
      <el-col
        :span="18"
        class="overflow common">
        <el-row id="overview">
          <span
            class="common-title">
            公司关键经营指标
          </span>
          <el-row v-if="overviewArr.length>0">
            <el-row
              class="min-height-400"
              :class="{clickOpen:is0DefalutShow}"
              v-loading="loading">
              <vue-lazy-component>
                <Card>
                  <div class="card_company">
                    <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                    <el-row>
                      <el-col>
                        <template v-for="(item, index) in overviewArr">
                          <el-col
                            :key="index">
                            <ProTargetAchievement
                              :id="`${index}`"
                              :data="item" />
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="card_company_target">
                    <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                    <template v-for="(item, index) in overviewTrendArr">
                      <el-col
                        v-if="overviewTrendArr.length>0"
                        :key="index">
                        <ProTargetActualDiffTrend
                          :id="`${index}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </div>
                </Card>
              </vue-lazy-component>
            </el-row>
            <div
              @click="open(0)"
              class="open">
              <img
                src="../../assets/open.png"
                alt="">
              {{ showMore0 ? '收起次要指标' : '展开次要指标' }}
            </div>
          </el-row>
          <el-row
            v-else
            class="home_select">
            加载中
          </el-row>
        </el-row>
        <el-row
          id="produce"
          class="margin-top-50 min-height-400">
          <span class="common-title">
            产品效率-单品平均效率
          </span>
          <el-row v-if="productArr.length>0">
            <el-row
              :class="{clickOpen:is1DefalutShow}"
              v-loading="loading">
              <vue-lazy-component>
                <Card>
                  <div class="card_company">
                    <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                    <el-row>
                      <el-col>
                        <template v-for="(item, index) in productArr">
                          <el-col
                            v-if="productArr.length>0"
                            :key="index">
                            <ProTargetAchievement
                              :id="`product${index}`"
                              :data="item" />
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="card_company_target">
                    <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                    <template v-for="(item, index) in productTrendArr">
                      <el-col
                        v-if="productTrendArr.length>0"
                        :key="index">
                        <ProTargetActualDiffTrend
                          :id="`product${index}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </div>
                </Card>
              </vue-lazy-component>
            </el-row>
            <div
              @click="open(1)"
              class="open">
              <img
                src="../../assets/open.png"
                alt="">
              {{ showMore1 ? '收起次要指标' : '展开次要指标' }}
            </div>
          </el-row>
          <el-row
            v-else
            class="home_select">
            加载中
          </el-row>
        </el-row>
        <el-row
          id="channel"
          v-loading="loading"
          class="margin-top-50 min-height-400">
          <span class="common-title">
            渠道效率-单店平均效率
          </span>
          <el-row v-if="channelArr.length>0">
            <el-row
              :class="{clickOpen:is2DefalutShow}"
              v-loading="loading">
              <vue-lazy-component>
                <Card>
                  <div class="card_company">
                    <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                    <el-row>
                      <el-col>
                        <template v-for="(item, index) in channelArr">
                          <el-col
                            v-if="channelArr.length>0"
                            :key="index">
                            <ProTargetAchievement
                              :id="`channel${index}`"
                              :data="item" />
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="card_company_target">
                    <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                    <template v-for="(item, index) in channelTrendArr">
                      <el-col
                        v-if="channelTrendArr.length>0"
                        :key="index">
                        <ProTargetActualDiffTrend
                          :id="`channel${index}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </div>
                </Card>
              </vue-lazy-component>
            </el-row>
            <div
              @click="open(2)"
              class="open">
              <img
                src="../../assets/open.png"
                alt="">
              {{ showMore2 ? '收起次要指标' : '展开次要指标' }}
            </div>
          </el-row>
        </el-row>
        <el-row
          id="customer"
          v-loading="loading"
          class="margin-top-50 min-height-400">
          <span class="common-title">
            客户效率-消费者人均效率
          </span>
          <el-row v-if="cusHomeArr.length>0">
            <el-row
              :class="{clickOpen:is3DefalutShow}"
              v-loading="loading">
              <vue-lazy-component>
                <Card>
                  <div class="card_company">
                    <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                    <el-row>
                      <el-col>
                        <template v-for="(item, index) in cusHomeArr">
                          <el-col
                            v-if="cusHomeArr.length>0"
                            :key="index">
                            <ProTargetAchievement
                              :id="`cus${index}`"
                              :data="item" />
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="card_company_target">
                    <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                    <template v-for="(item, index) in cusHomeTrendArr">
                      <el-col
                        v-if="cusHomeTrendArr.length>0"
                        :key="index">
                        <ProTargetActualDiffTrend
                          :id="`cus${index}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </div>
                </Card>
              </vue-lazy-component>
            </el-row>
            <div
              @click="open(3)"
              class="open">
              <img
                src="../../assets/open.png"
                alt="">
              {{ showMore3 ? '收起次要指标' : '展开次要指标' }}
            </div>
          </el-row>
          <el-row
            v-else
            class="home_select">
            ...
          </el-row>
        </el-row>
        <el-row
          id="organization"
          v-loading="loading"
          class="margin-top-50 min-height-400">
          <span class="common-title">
            组织效率-企业人均效率
          </span>
          <el-row v-if="orgHomeArr.length>0">
            <el-row
              :class="{clickOpen:is4DefalutShow}"
              v-loading="loading">
              <vue-lazy-component>
                <Card>
                  <div class="card_company">
                    <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                    <el-row>
                      <el-col>
                        <template v-for="(item, index) in orgHomeArr">
                          <el-col
                            v-if="orgHomeArr.length>0"
                            :key="index">
                            <ProTargetAchievement
                              :id="`org${index}`"
                              :data="item" />
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="card_company_target">
                    <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                    <template v-for="(item, index) in orgTrendArr">
                      <el-col
                        v-if="orgTrendArr.length>0"
                        :key="index">
                        <ProTargetActualDiffTrend
                          :id="`org${index}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </div>
                </Card>
              </vue-lazy-component>
            </el-row>
            <div
              @click="open(4)"
              class="open">
              <img
                src="../../assets/open.png"
                alt="">
              {{ showMore4 ? '收起次要指标' : '展开次要指标' }}
            </div>
          </el-row>
          <el-row
            v-else
            class="home_select">
            ...
          </el-row>
        </el-row>
        <el-row
          id="fund"
          v-loading="loading"
          class="margin-top-50 min-height-400">
          <span class="common-title">
            资金效率
          </span>
          <el-row v-if="fundHomeArr.length>0">
            <el-row
              :class="{clickOpen:is5DefalutShow}"
              v-loading="loading">
              <vue-lazy-component>
                <Card>
                  <div class="card_company">
                    <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                    <el-row>
                      <el-col>
                        <template v-for="(item, index) in fundHomeArr">
                          <el-col
                            v-if="fundHomeArr.length>0"
                            :key="index">
                            <ProTargetAchievement
                              :id="`fund+${index}`"
                              :data="item" />
                          </el-col>
                        </template>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="card_company_target">
                    <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                    <template v-for="(item, index) in fundHomeTrendArr">
                      <el-col
                        v-if="fundHomeTrendArr.length>0"
                        :key="index">
                        <ProTargetActualDiffTrend
                          :id="`fund+${index}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </div>
                </Card>
              </vue-lazy-component>
            </el-row>
            <div
              @click="open(5)"
              class="open">
              <img
                src="../../assets/open.png"
                alt="">
              {{ showMore5 ? '收起次要指标' : '展开次要指标' }}
            </div>
          </el-row>
          <el-row
            v-else
            class="home_select">
            ...
          </el-row>
        </el-row>
      </el-col>
    </el-row>
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
            cid: '',
            defaultProps: TREE_PROPS,
            loading: false,
            //index
            is0DefalutShow:true,
            is1DefalutShow:true,
            is2DefalutShow:true,
            is3DefalutShow:true,
            is4DefalutShow:true,
            is5DefalutShow:true,
            showMore0:false,
            showMore1:false,
            showMore2:false,
            showMore3:false,
            showMore4:false,
            showMore5:false,
            index0: 0,
            index1: 0,
            index2: 0,
            index3: 0,
            // stragety
            stragetyCheckList: [],
            stragetyTitle: '',
            stragety: [],
            checked1: true,
            idArr: [],
            val:{},
            post:1,
            style:0,

        };
    },
    computed: {
        ...mapGetters(['overviewArr','overviewTrendArr','productArr','productTrendArr','channelArr','channelTrendArr','orgHomeArr','orgTrendArr','fundHomeArr','fundHomeTrendArr','cusHomeArr','cusHomeTrendArr']),
        hasTree() {
            return !_.isEmpty(this.productArr);
        }
    },
    mounted() {
        this.allRequest();
    },
    watch: {
        val() {
            this.allRequest();
        }
    },
    methods: {
        open(i) {
            this[`is${i}DefalutShow`] = !this[`is${i}DefalutShow`];
            this[`showMore${i}`] = !this[`showMore${i}`];
        },
        allRequest() {
            //公司
            this.getOverviewProgress();
            this.getProductProgress();
            this.getChannelProgress();
            // 组织
            this.getOrgProgress();
            //资金
            this.getFundProgress();
            //客户
            this.getCusProgress();
        },
        input(val) {
            this.form.date = val;
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
                const promises = _.map(res.data, o => this.getOverviewTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveOverviewTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
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
