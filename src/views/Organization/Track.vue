<template>
  <div class="track">
    <div
      v-loading="loading"
      class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <el-table
        @sort-change="sortChange"
        @filter-change="filterChange"
        :data="trackList"
        stripe>
        <el-table-column
          type="index"
          label="序号" />
        <el-table-column
          prop="level_name"
          label="组织层级"
          column-key="level"
          :filters="[{text: '全公司', value: '1'},{text: '事业部', value: '2'},{text: '部门', value: '3'},{text: '小组', value: '4'}]" />
        <el-table-column
          prop="subject_name"
          label="指标"
          column-key="subject"
          :filters="[{text: '销售额', value: 'S'}, {text: '净利润额', value: 'P'},{text: '成本额', value: 'C'}]" />
        <el-table-column
          prop="rank_name"
          label="评选等级"
          column-key="rank"
          :filters="[{text: '优', value: '1'},{text: '2', value: '良'},{text: '中', value: '3'},{text: '差', value: '4'}]" />
        <el-table-column
          prop="inf_name"
          label="影响因素"
          column-key="inf_name"
          :filters="[{text: '薪酬规划', value: '薪酬规划'},{text: '人员业务能力', value: '人员业务能力'},{text: '总的成本费用', value: '总的成本费用'},{text: '总销售收入', value: '总销售收入'},{text: '治理方式', value: '治理方式'},{text: '员工个人能力', value: '员工个人能力'},{text: '人力资源规划', value: '人力资源规划'},{text: '企业架构', value: '企业架构'},{text: '客单', value: '客单'}]" />
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
              @show='show(scope.row)'
              v-model="scope.row.visible"
              trigger="click"
              placement="top">
              <el-table
                :data="trackListAll">
                <el-table-column
                  type="index"
                  label="序号" />
                <el-table-column
                  prop="node_name"
                  label="应用产品" />
                <el-table-column
                  prop="period"
                  label="时间" />
                <el-table-column
                  prop="rank_before"
                  label="策略应用前" />
                <el-table-column
                  prop="rank_after"
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
          sortable>
          <template slot-scope="scope">
            <el-popover
              @show='showEff(scope.row)'
              v-model="scope.row.visibleEff"
              trigger="click"
              placement="top">
              <el-table
                :data="trackListEff">
                <el-table-column
                  type="index"
                  label="序号" />
                <el-table-column
                  prop="node_name"
                  label="应用产品" />
                <el-table-column
                  prop="period"
                  label="时间" />
                <el-table-column
                  prop="rank_before"
                  label="策略应用前" />
                <el-table-column
                  prop="rank_after"
                  label="策略应用后" />
              </el-table>
              <div
                slot="reference"
                class="name-wrapper cell_count_use">
                {{ scope.row.suc_num }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="acc_rate"
          label="策略准确度/适用度"
          sortable>
          <!-- 点击策略准确度,弹出下面这个窗口的所有策略应用情况 -->
          <template slot-scope="scope">
            <el-popover
              @show='show(scope.row)'
              v-model="scope.row.visibleRate"
              trigger="click"
              placement="top">
              <el-table
                :data="trackListAll">
                <el-table-column
                  type="index"
                  label="序号" />
                <el-table-column
                  prop="node_name"
                  label="应用产品" />
                <el-table-column
                  prop="period"
                  label="时间" />
                <el-table-column
                  prop="rank_before"
                  label="策略应用前" />
                <el-table-column
                  prop="rank_after"
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
// const DESC = 1, ASC = 2;
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
            trackList: [],
            total: 0,
            level: '',
            inf_id: '',
            rank: '',
            subject: '',
            sort: '',
            filterArr: [],
            currentPage: 1,
            trackListAll: [],
            trackListEff: [],
        };
    },
    computed: {
        ...mapGetters(['strategyArr']),
        hasTree() {
            return !_.isEmpty(this.strategyArr);
        }
    },
    mounted() {
        this.getOrgStrategy();
    },
    methods: {
        sortChange(val) {
            this.trackList = this.trackList.map(o => {
                o.visible = false;
                o.visibleEff = false;
                o.visibleRate = false;
                return o;
            });
            let order;
            if (val.prop && val.order) {
                if (val.order === "ascending") {
                    order = 'asc';
                } else {
                    order = 'desc';
                }
                this.sort = val.prop + ':' + order;
                this.getOrgStrategy();
            }
        },
        showEff(val) {
            this.trackListEff = [];
            const effRecord = 1;//是否只返回有效的应用记录 1是 0否
            const params = {
                strategyId: val.id,
                goodOnly: effRecord
            };
            API.GetOrgApplog(params).then(res => {
                this.trackListEff = res.data;
            });
        },
        show(val) {
            this.trackListAll = [];
            const unEffRecord = 0;//是否只返回有效的应用记录 1是 0否(全部)
            const params = {
                strategyId: val.id,
                goodOnly: unEffRecord
            };
            API.GetOrgApplog(params).then(res => {
                this.trackListAll = res.data;
            });
        },
        filterChange(filter){
            this.filterArr.push(filter);
            for (let i of this.filterArr) {
                if (Object.keys(i)[0] === "level") {
                    this.level = i.level.join();
                } else if (Object.keys(i)[0] === "subject") {
                    this.subject = i.subject.join();
                } else if (Object.keys(i)[0] === "rank") {
                    this.rank = i.rank.join();
                } else if (Object.keys(i)[0] === "package") {
                    this.package = i.package.join();
                }
            }
            this.currentPage = 1,//更改筛选条件时从第一页查找
            this.getOrgStrategy();
        },
        getOrgStrategy() {
            this.loading = true;
            const params = {
                page: this.currentPage,
                limit: 10,
                level: this.level,
                subject: this.subject,
                rank: this.rank,
                inf_id: this.inf_id,
                sort: this.sort
            };
            API.GetOrgStrategiesTrack(params).then(res => {
                this.trackList = res.data.map(o => {
                    o.visible = false;
                    o.visibleEff = false;
                    o.visibleRate = false;
                    return o;
                });
                this.total = res.total;
            }).finally(() => {
                this.loading = false;
            });
        },
        handleCurrentChange(val) {
            this.loading = true;
            this.currentPage = val;
            const params = {
                page: this.currentPage,
                limit: 10,
                level: this.level,
                subject: this.subject,
                rank: this.rank,
                inf_id: this.inf_id,
                sort: this.sort
            };
            API.GetOrgStrategiesTrack(params).then(res => {
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
