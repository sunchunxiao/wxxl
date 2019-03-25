<template>
  <div class="home_container">
    <el-row
      class="time_header">
      <search-bar
        @search="handleSearch"
        :has-search="false"
        ref="child"
        url="/home/search"
        v-model="searchBarValue"
        :pt-options="['月', '季', '年']" />
    </el-row>
    <div class="home_menu">
      <div class="common-wrap">
        <span
          class="span"
          :key="item.id"
          v-for="item in tabs"
          :class="{'bacground':currView==item.id}"
          @click="handleClick(item.id)"><span class="dot" />{{ item.value }}</span>
      </div>
      <component
        :is="currentTabComponent" />
    </div>
  </div>
</template>

<script>
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import Product from './Product.vue';
import Channel from './Channel.vue';
import Customer from './Customer.vue';
import Organization from './Organization.vue';
import Fund from './Fund.vue';
const OVER_TABS = [{
    id: 'product',
    value: '产品效率'
},{
    id: 'channel',
    value: '渠道效率'
},{
    id: 'customer',
    value: '客户效率'
},{
    id: 'organization',
    value: '组织效率'
},{
    id: 'fund',
    value: '资金效率'
}];

export default {
    components: {
        "product": Product,
        "channel": Channel,
        "customer": Customer,
        "organization": Organization,
        "fund": Fund,
        Card,
        SearchBar,
    },
    data() {
        return {
            form: {
                pt: '', // 周期类型
                search: '', // 暂时没有接口 先这样
            },
            loading: false,
            activePath: "/home/core",
            //views
            tabs: OVER_TABS,
            currView: '',
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
        currentTabComponent: function() {
            return this.currView;
        },
    },
    mounted() {
        //获取初始时间
        this.changeDate = this.searchBarValue;
        this.currView = this.$route.params.name;
        this.$store.dispatch('SaveSearchDate', this.changeDate);
        this.activePath = this.$route.fullPath;
        this.currView = this.$route.params.name;
    },
    watch: {
        ['$route.fullPath']: function (val) {
            if (val === '/home/core') {
                this.activePath = 'placeholder';
                return;
            }
            this.activePath = val;
        }
    },
    methods: {
        handleClick(id) {
            this.currView = id;
            this.$router.push(`/home/core/${id}`);
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
