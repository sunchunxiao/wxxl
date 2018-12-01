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
            <div class="menu_company"><span class="company_before" /> 公司关键经营指标</div>
            <template v-for="(item,index) in menuData">
              <a
                class="menu_list"
                :href="item.path"
                @click="select(index)"
                :class="{'menu_list_select':style==index}"
                :key="item.path">{{ item.title }}
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
        <el-row id="#company">
          <span
            class="common-title">
            公司关键经营指标
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in productArr">
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
                <template v-for="(item, index) in productTrendArr">
                  <el-col
                    :key="index">
                    <ProTargetActualDiffTrend
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row
          id="produce"
          v-loading="loading"
          class="margin-top-50">
          <span class="common-title">
            产品效率-单品平均效率
          </span>
          <el-row v-loading="loading">
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
                          :id="`${index+productArr.length}`"
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
                      :id="`${index+productTrendArr.length}`"
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row
          id="channel"
          v-loading="loading"
          class="margin-top-50">
          <span class="common-title">
            渠道效率-单店平均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in channelArr">
                      <el-col
                        v-if="productArr.length>0"
                        :key="index">
                        <ProTargetAchievement
                          :id="`${index+productArr.length*2}`"
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
                    v-if="productTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :id="`${index+productTrendArr.length*2}`"
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row
          id="customer"
          v-loading="loading"
          class="margin-top-50">
          <span class="common-title">
            客户效率-消费者人均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieCustomer">
                      <el-col
                        v-if="productArr.length>0"
                        :key="index">
                        <ProTargetAchievement
                          :id="`${index+productArr.length*3}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataCustomer">
                  <el-col
                    v-if="productTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :id="`${index+productTrendArr.length*3}`"
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row
          id="organization"
          v-loading="loading"
          class="margin-top-50">
          <span class="common-title">
            组织效率-企业人均效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieOrganization">
                      <el-col
                        v-if="productArr.length>0"
                        :key="index">
                        <ProTargetAchievement
                          :id="`${index+productArr.length*4}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataOrganization">
                  <el-col
                    v-if="productTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :id="`${index+productTrendArr.length*4}`"
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
          </el-row>
        </el-row>
        <el-row
          id="fund"
          v-loading="loading"
          class="margin-top-50">
          <span class="common-title">
            资金效率
          </span>
          <el-row v-loading="loading">
            <Card>
              <div class="card_company">
                <el-row class="margin-bottom-20">目标达成情况总览</el-row>
                <el-row>
                  <el-col>
                    <template v-for="(item, index) in pieFund">
                      <el-col
                        v-if="productArr.length>0"
                        :key="index">
                        <ProTargetAchievement
                          :id="`${index+productArr.length*5}`"
                          :data="item" />
                      </el-col>
                    </template>
                  </el-col>
                </el-row>
              </div>
              <div class="card_company_target">
                <el-row class="margin-bottom-20">目标-实际-差异趋势分析</el-row>
                <template v-for="(item, index) in dataFund">
                  <el-col
                    v-if="productTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :id="`${index+productTrendArr.length*5}`"
                      :data="item" />
                  </el-col>
                </template>
              </div>
            </Card>
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
import ProTargetAchievementBig from 'components/ProTargetAchievementBig';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';

// mock
import { dataProduce,dataChannel,dataCustomer,dataOrganization,dataFund } from './mock/trendData.js';
import { pieChannel,pieDataProduce,pieCustomer,pieOrganization,pieFund } from './mock/pieData.js';

import { mapGetters } from 'vuex';
const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const MENUDATA = [
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
        ProTargetAchievementBig,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
                subject: 'S', // S: 销售额 P: 利润额
            },
            menuData: MENUDATA,
            pieData1:pieChannel(),
            pieDataProduce:pieDataProduce(),
            pieCustomer:pieCustomer(),
            pieOrganization:pieOrganization(),
            pieFund:pieFund(),
            trend:dataProduce(),
            dataChannel:dataChannel(),
            dataCustomer:dataCustomer(),
            dataOrganization:dataOrganization(),
            dataFund:dataFund(),
            // mockData
            // pieData: mockPieData(),
            cid: '',
            defaultProps: TREE_PROPS,
            loading: false,
            // index
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
            style:undefined
        };
    },
    computed: {
        ...mapGetters(['productArr','productTrendArr','channelArr','channelTrendArr']),
        hasTree() {
            return !_.isEmpty(this.productArr);
        }
    },
    mounted() {
        if (!this.hasTree) {
            this.getProductProgress();
            this.getChannelProgress();
        }
    },
    watch: {
        cid: function() {
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
            // 暂时先在这里做
            //   this.getProductProgress();
        }
    },
    methods: {
        input (val) {
            this.form.date = val;
        },
        select(index){
            this.style = index;
        },
        //产品
        getProductProgress() {
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
        getChannelProgress(){
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
        getDateObj () {
            const {
                date
            } = this.form;
            // console.log(this.val.sDate,date);
            if (this.val.sDate != undefined && this.val.eDate != undefined) {
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
            this.loading = true;
            this.val = val;

            this.getProductProgress();
            this.getChannelProgress();
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },

    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
