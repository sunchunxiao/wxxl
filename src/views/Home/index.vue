<template>
  <div class="home_container">
    <el-row
      class="time_header">
      <search-bar
        @input="input"
        @search="handleSearch"
        :has-search="false"
        ref="child"
        url="/home/search"
        :pt-options="['月', '季', '年']" />
    </el-row>
    <div class="home_menu">
      <div class="menu_output">外部评估</div>
      <el-menu
        router
        :default-active="activePath"
        class="el-menu-demo"
        mode="horizontal">
        <el-menu-item index="/home/sales"><span class="dot" />销售</el-menu-item>
        <el-menu-item index="/home/profit"><span class="dot" />利润</el-menu-item>
        <template v-for="item in menuData">
          <el-submenu
            :index="item.path"
            :key="item.path">
            <template slot="title">
              <span class="dot" />{{ item.title }}
            </template>
            <template v-for="itm in item.children">
              <el-menu-item
                :index="`${item.path}${itm.path}`"
                :key="`${item.path}${itm.path}`">
                <span>
                  <span class="dot" /> {{ itm.title }}
                </span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <el-menu-item index="/home/equity">品牌价值</el-menu-item>
      </el-menu>
      <div class="menu_output">内部评估</div>
      <el-menu
        router
        class="el-menu-demo"
        mode="horizontal">
        <template v-for="item in menuDataInput">
          <el-menu-item
            :key="item.path"
            :index="item.path">
            <span class="dot" />{{ item.title }}
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="overview">
      <el-row
        class="content_row "
        :gutter="20">
        <router-view />
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

import { mapGetters } from 'vuex';

const TREE_PROPS = {
    children: 'children',
    label: 'name'
};
const menuDataInput = [
    {
        title: "盈利空间",
        path: "/home/profitSpace",
    },
    {
        title: "盈利能力",
        path: "/home/profit",
    },
    {
        title: "支付能力",
        path: "/home/profitability",
    }
];
const MENUDATA = [
    {
        title: "五项效率",
        path: "/home",
        children: [
            {
                title: "产品效率",
                path: "/product"
            },
            {
                title: "渠道效率",
                path: "/channel"
            },
            {
                title: "客户效率",
                path: "/customer"
            },
            {
                title: "组织效率",
                path: "/organization"
            },
            {
                title: "资金效率",
                path: "/fund"
            }
        ]
    }
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
            menuDataInput: menuDataInput,
            cid: '',
            defaultProps: TREE_PROPS,
            loading: false,
            activePath: "/home",
            val: {}
        };
    },
    computed: {
        ...mapGetters(['overviewArr','overviewTrendArr','productArr','productTrendArr','channelArr','channelTrendArr','orgHomeArr','orgTrendArr','fundHomeArr','fundHomeTrendArr','cusHomeArr','cusHomeTrendArr']),
        hasTree() {
            return !_.isEmpty(this.productArr);
        }
    },
    mounted() {
        // this.getProductProgress();
        this.activePath = this.$route.fullPath;
    },
    // watch: {
    //     val() {
    //         // this.getProductProgress();
    //     }

    // },
    watch: {
        ['$route.fullPath']: function (val) {
            if (val === '/home') {
                this.activePath = 'placeholder';
                return;
            }
            this.activePath = val;
        }
    },
    methods: {
        input(val) {
            this.form.date = val;
        },
        select(index) {
            this.style = index;
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
