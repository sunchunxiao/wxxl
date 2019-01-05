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
        v-model="searchBarValue"
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
        <!-- <el-menu-item index="/home/profitSpace"><span class="dot" />盈利空间</el-menu-item>
        <el-menu-item index="/home/profitability"><span class="dot" />盈利能力</el-menu-item> -->
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
      <el-row>
        <router-view />
      </el-row>
    </div>
  </div>
</template>

<script>
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';

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
        path: "/home/profitability",
    },
    {
        title: "支付能力",
        path: "/home/pay",
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
    },
    data() {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            cid: '',
            menuData: MENUDATA,
            menuDataInput: menuDataInput,
            defaultProps: TREE_PROPS,
            loading: false,
            activePath: "/home",
            val: {},
            changeDate: {},
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
        };
    },
    computed: {
        ...mapGetters(['overviewArr','overviewTrendArr','productArr','productTrendArr','channelArr','channelTrendArr','orgHomeArr','orgTrendArr','fundHomeArr','fundHomeTrendArr','cusHomeArr','cusHomeTrendArr']),
        hasTree() {
            return !_.isEmpty(this.productArr);
        }
    },
    mounted() {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        this.$store.dispatch('SaveSearchDate', this.changeDate);
        // console.log(this.changeDate);
        this.activePath = this.$route.fullPath;
    },
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
        input() {
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
            // 时间改变
            this.$store.dispatch('SaveSearchDate', val);
        },

    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
