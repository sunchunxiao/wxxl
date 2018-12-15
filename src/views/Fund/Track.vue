<template>
  <div class="track">
    <div
      v-loading="loading"
      class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <el-table
        @sort-change='sortChange'
        :data="trackList"
        stripe>
        <el-table-column
          type="index"
          label="序号" />
        <el-table-column
          prop="level_name"
          label="资金层级"
          :filters="[{text: '全公司', value: '全公司'},{text: '事业部', value: '事业部'},{text: '部门', value: '部门'},{text: '小组', value: '小组'}]"
          :filter-method="filterA" />
        <el-table-column
          prop="subject_name"
          label="指标"
          :filters="[{text: '销售额', value: '销售额'}, {text: '利润', value: '利润'},{text: '成本', value: '成本'},{text: '回款额', value: '回款额'},{text: '投资回报率', value: '投资回报率'},{text: '净利率', value: '净利率'},{text: '净现金流', value: '净现金流'},{text: '资金周转率', value: '资金周转率'},{text: '资金冗余值', value: '资金冗余值'}]"
          :filter-method="filterB" />
        <el-table-column
          prop="rank_name"
          label="评选等级"
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]"
          :filter-method="filterC" />
        <el-table-column
          prop="inf_name"
          label="影响因素"
          :filters="[{text: '经营规划', value: '经营规划'},{text: '预算管控', value: '预算管控'},{text: '总销售量', value: '总销售量'},{text: '应收能力', value: '应收能力'},{text: '资产结构规划', value: '资产结构规划'},{text: '流动资金使用', value: '流动资金使用'},{text: '主营业务收入', value: '主营业务收入'},{text: '营运资金管理', value: '营运资金管理'}]"
          :filter-method="filterD" />
        <el-table-column
          prop="strategy"
          label="策略" />
        <el-table-column
          prop="use_num"
          label="采纳次数"
          sortable>
          <!-- 点击策略准确度,弹出下面这个窗口的所有策略应用情况 -->
          <template slot-scope="scope">
            <el-popover
              @show = 'show(scope.row)'
              v-model="scope.row.visible"
              trigger="click"
              placement="top">
              <el-table
                :data="trackListAll">
                <el-table-column
                  type="index"
                  label="序号" />
                <el-table-column
                  prop="level"
                  label="应用产品" />
                <el-table-column
                  prop="time"
                  label="时间" />
                <el-table-column
                  prop="rank1"
                  label="策略应用前" />
                <el-table-column
                  prop="rank2"
                  label="策略应用后" />
              </el-table>
              <div
                slot="reference"
                class="name-wrapper cell_count_use">
                {{ scope.row.use_num }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="suc_num"
          label="有效次数"
          sortable />
        <el-table-column
          prop="acc_rate"
          label="策略准确度/适用度"
          sortable>
          <!-- 点击策略准确度,弹出下面这个窗口的所有策略应用情况 -->
          <template slot-scope="scope">
            <el-popover
              @show = 'show(scope.row)'
              v-model="scope.row.visibleRate"
              trigger="click"
              placement="top">
              <el-table
                :data="trackListAll">
                <el-table-column
                  type="index"
                  label="序号" />
                <el-table-column
                  prop="level"
                  label="应用产品" />
                <el-table-column
                  prop="time"
                  label="时间" />
                <el-table-column
                  prop="rank1"
                  label="策略应用前" />
                <el-table-column
                  prop="rank2"
                  label="策略应用后" />
              </el-table>
              <div
                slot="reference"
                class="name-wrapper cell_count_use">
                {{ scope.row.acc_rate }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_container">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total" />
      </div>
    </div>
  </div>
</template>

<script>
import API from './api';
import { mapGetters } from 'vuex';
const SUBJECT = 'P'; // S: 销售额 P: 利润额
export default {
    components: {},
    data() {
        return {
            form: {
                pt: '月',
                date: [],
                search: '',
                version: '0'
            },
            loading: false,
            currentPage: 1,
            trackList:[],
            total:0,
            arr:[],
            trackListAll:[]
        };
    },

    computed: {
        ...mapGetters(['strategyArr']),
        hasTree() {
            return !_.isEmpty(this.strategyArr);
        }
    },
    mounted(){
        this.getProductStrategy();
    },
    methods: {
        sortChange() {
            this.trackList = this.trackList.map(o => {
                o.visible = false;
                o.visibleRate = false;
                return o;
            });
        },
        show(val) {
            this.trackListAll = [];
            if(val){
                this.trackListAll.push({
                    level:"事业部A-部门A",
                    time:'2018.1.2',
                    rank1:'差',
                    rank2:'优'
                },{
                    level:"事业部A-部门B",
                    time:'2018.1.2',
                    rank1:'中',
                    rank2:'差'
                });
            }
        },
        getProductStrategy() {
            this.loading = true;
            const params = {
                subject: SUBJECT,
                page: this.currentPage,
                limit: 10,
            };
            API.GetFundStrategiesTrack(params).then(res => {
                this.trackList = res.data.map(o => {
                    o.visible = false;
                    o.visibleRate = false;
                    return o;
                });
                this.total = res.total;
            }).finally(() => {
                this.loading = false;
            });
        },
        filterA(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterB(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterC(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterD(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterF(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterG(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterH(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        handleCurrentChange(val) {
            this.loading= true;
            this.currentPage = val;
            const params = {
                page: this.currentPage,
                limit: 10,
                subject: SUBJECT,
            };
            API.GetFundStrategiesTrack(params).then(res => {
                this.trackList = res.data;
            }).finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>

<style lang="scss">
	@import '../Product/style/track.scss'
</style>
