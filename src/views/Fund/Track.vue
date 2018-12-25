<template>
  <div class="track">
    <div
      v-loading="loading"
      class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <el-table
        @sort-change='sortChange'
        @filter-change="filterChange"
        :data="trackList"
        stripe>
        <el-table-column
          type="index"
          label="序号" />
        <el-table-column
          prop="level_name"
          label="资金层级"
          :filters="filtersLevel"
          column-key="level" />
        <el-table-column
          prop="subject_name"
          label="指标"
          :filters="filtersSubject"
          column-key="subject" />
        <el-table-column
          prop="rank_name"
          label="评选等级"
          :filters="filtersRank"
          column-key="rank" />
        <el-table-column
          prop="inf_name"
          label="影响因素"
          :filters="filtersInfo"
          column-key="inf_id" />
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
              @show = 'show(scope.row)'
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
            trackList: [],
            filtersLevel: [],
            filtersSubject: [],
            filtersRank: [],
            filtersInfo: [],
            total: 0,
            level: '',
            inf_id: '',
            rank: '',
            subject: '',
            sort: '',
            filterArr: [],
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
    mounted(){
        this.getFundStrategy();
        this.getFliters();
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
                this.getFundStrategy();
            }
        },
        showEff(val) {
            this.trackListEff = [];
            const effRecord = 1;//是否只返回有效的应用记录 1是 0否
            const params = {
                strategyId: val.id,
                goodOnly: effRecord
            };
            API.GetFundApplog(params).then(res => {
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
            API.GetFundApplog(params).then(res => {
                this.trackListAll = res.data;
            });
        },
        getFliters() {
            API.GetFundFilter().then(res => {
                this.filtersLevel = res.level;
                this.filtersSubject = res.subject;
                this.filtersRank = res.rank;
                this.filtersInfo = res.package;
            });
        },
        filterChange (filter) {
            this.filterArr.push(filter);
            for (let i of this.filterArr) {
                if (Object.keys(i)[0] === "level") {
                    this.level = i.level.join();
                } else if (Object.keys(i)[0] === "subject") {
                    this.subject = i.subject.join();
                } else if (Object.keys(i)[0] === "rank") {
                    this.rank = i.rank.join();
                } else if (Object.keys(i)[0] === "inf_id") {
                    this.inf_id = i.inf_id.join();
                }
            }
            this.currentPage = 1,//更改筛选条件时从第一页查找
            this.getFundStrategy();
        },
        getFundStrategy() {
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
            API.GetFundStrategiesTrack(params).then(res => {
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
            this.loading= true;
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
