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

export default {
    components: {
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
