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
          prop="level"
          label="产品层级"
          column-key="level"
          :filters="filtersLevel" />
        <el-table-column
          prop="subject"
          label="指标"
          column-key="subject"
          :filters="filtersSubject" />
        <el-table-column
          prop="rank"
          label="评选等级"
          column-key="rank"
          :filters="filtersRank" />
        <el-table-column
          prop="package"
          label="影响因素"
          column-key="package"
          :filters="filtersPackage" />
        <el-table-column
          prop="strategy"
          label="策略" />
        <el-table-column
          prop="count_use"
          label="采纳次数"
          sortable>
          <template
            slot-scope="scope">
            <el-popover
              @show='show(scope.row)'
              trigger="click"
              v-model="scope.row.visible"
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
                  prop='rank_after'
                  label="策略应用后" />
              </el-table>
              <div
                slot="reference"
                class="name-wrapper cell_count_use">
                {{ scope.row.count_use }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="count_eff"
          label="有效次数"
          sortable>
          <template
            slot-scope="scope">
            <el-popover
              @show='showEff(scope.row)'
              trigger="click"
              v-model="scope.row.visibleEff"
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
                  prop='rank_after'
                  label="策略应用后" />
              </el-table>
              <div
                slot="reference"
                class="name-wrapper cell_count_use">
                {{ scope.row.count_eff }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
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
                  prop='rank_after'
                  label="策略应用后" />
              </el-table>
              <div
                slot="reference"
                class="name-wrapper cell_count_use">
                {{ scope.row.rate }}
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

// const SUBJECT = ['level','subject']; // S: 销售额 P: 利润额
export default {
    components: {},
    data() {
        return {
            form: {
                pt: '日', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            loading: false,
            trackList: [],
            filtersLevel: [],
            filtersSubject: [],
            filtersRank: [],
            filtersPackage: [],
            total: 0,
            level: '',
            package: '',
            rank: '',
            subject: '',
            sort: '',
            filterArr: [],
            currentPage: 1,
            trackListAll: [],
            trackListEff: [],
        };
    },
    mounted() {
        this.getProductStrategy();
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
                this.getProductStrategy();
            }
        },
        showEff(val) {
            this.trackListEff = [];
            const effRecord = 1;//是否只返回有效的应用记录 1是 0否
            const params = {
                strategyId: val.id,
                goodOnly: effRecord
            };
            API.GetProductApplog(params).then(res => {
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
            API.GetProductApplog(params).then(res => {
                this.trackListAll = res.data;
            });
        },
        filterChange(filter) {
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
            this.getProductStrategy();
        },
        getFliters() {
            API.GetProductFilter().then(res => {
                this.filtersLevel = res.level;
                this.filtersSubject = res.subject;
                this.filtersRank = res.rank;
                this.filtersPackage = res.package;
            });
        },
        getProductStrategy() {
            this.loading = true;
            const params = {
                page: this.currentPage,
                per_page: 10,
                level: this.level,
                subject: this.subject,
                rank:this.rank,
                package: this.package,
                sort: this.sort
            };
            API.GetProductStrategy(params).then(res => {
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
                per_page: 10,
                level: this.level,
                subject: this.subject,
                rank: this.rank,
                package: this.package,
                sort: this.sort
            };
            API.GetProductStrategy(params).then(res => {
                this.trackList = res.data;
            }).finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>

<style lang="scss">
	@import './style/track.scss'
</style>
