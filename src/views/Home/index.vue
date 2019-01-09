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
      <el-menu
        router
        :default-active="activePath"
        class="el-menu-demo"
        mode="horizontal">
        <template v-for="item in outernalAssessment">
          <el-submenu
            class="collapse_outernal"
            :index="item.path"
            :key="'collapse_outernal'+item.path">
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
        <div
          class="menu_output outernal">外部评估</div>
        <el-menu-item
          index="/home/sales"
          class="outernal"><span class="dot" />销售</el-menu-item>
        <el-menu-item
          index="/home/profit"
          class="outernal"><span class="dot" />利润</el-menu-item>
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
        <el-menu-item index="/home/equity"><span class="dot" />品牌价值</el-menu-item>
        <div class="menu_output internal">内部评估</div>
        <template v-for="item in menuDataInput">
          <el-menu-item
            class="internal"
            :key="'internal'+item.path"
            :index="item.path">
            <span class="dot" />{{ item.title }}
          </el-menu-item>
        </template>
        <template v-for="item in internalAssessment">
          <el-submenu
            class="collapse_internal"
            :index="item.path"
            :key="'collapse_internal'+item.path">
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
      </el-menu>
    </div>
    <div
      class="overview">
      <el-row>
        <router-view />
      </el-row>
    </div>
  </div>
</template>

<script>
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';

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
const internalAssessment = [
    {
        title: "内部评估",
        path: "",
        children: menuDataInput
    }
];
const menuDataInput2 = [
    {
        title: "销售",
        path: "/home/sales",
    },
    {
        title: "利润",
        path: "/home/profit",
    }
];
const outernalAssessment = [
    {
        title: "外部评估",
        path: "",
        children: menuDataInput2
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
            menuData: MENUDATA,
            menuDataInput: menuDataInput,
            internalAssessment: internalAssessment,
            outernalAssessment: outernalAssessment,
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

    },
    mounted() {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        this.$store.dispatch('SaveSearchDate', this.changeDate);
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
   @import './style/home.scss';
</style>
