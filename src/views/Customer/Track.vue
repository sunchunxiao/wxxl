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
          label="客户层级"
          column-key="level"
          :filters="[{text: '平台', value: '平台'},{text: '店铺', value: '店铺'},{text: '城市', value: '城市'}]" />
        <el-table-column
          prop="subject_name"
          label="指标"
          column-key="subject_name"
          :filters="[{text: '销售额', value: 'S'}, {text: '利润额', value: 'P'},{text: '成本', value: 'C'}]" />
        <el-table-column
          prop="rank_name"
          label="评选等级"
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]"
          :filter-method="filterC" />
        <el-table-column
          prop="inf_name"
          label="影响因素"
          :filters="[{text: '推广计划', value: '推广计划'},{text: '费用预算管控', value: '费用预算管控'},{text: '客户结构', value: '客户结构'},{text: '流量', value: '流量'},{text: '客群定位', value: '客群定位'},{text: '客单', value: '客单'},{text: '客户运营', value: '客户运营'},{text: '品牌竞争力', value: '品牌竞争力'}]"
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
// const SUBJECT = 'P'; // S: 销售额 P: 利润额
export default {
    components: {},
    data() {
        return {
            form: {
                pt: '月',
                date: [],
                search: '',
            },
            loading: false,
            currentPage: 1,
            trackList: [],
            total: 0,
            level: '',
            package: '',
            rank: '',
            subject: '',
            acc_soft: '',
            use_soft: '',
            suc_soft: '',
            filterArr: [],
            trackListAll: [],
            trackListEff: [],
        };
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
        showEff(val) {
            this.trackListEff = [];
            const effRecord = 1;//是否只返回有效的应用记录 1是 0否
            const params = {
                strategyId: val.id,
                goodOnly: effRecord
            };
            API.GetCusApplog(params).then(res => {
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
            API.GetCusApplog(params).then(res => {
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
            this.getProductStrategy();
        },
        getProductStrategy() {
            this.loading = true;
            const params = {
                page: this.currentPage,
                limit: 10,
                level: this.level,
                subject: this.subject,
                rank : this.rank,
                package: this.package,
                acc_soft: this.acc_soft,
                use_soft: this.use_soft,
                suc_soft: this.suc_soft
            };
            API.GetCusStrategiesTrack(params).then(res => {
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
                level: this.level,
                subject: this.subject,
                rank : this.rank,
                package: this.package,
                acc_soft: this.acc_soft,
                use_soft: this.use_soft,
                suc_soft: this.suc_soft
            };
            API.GetCusStrategiesTrack(params).then(res => {
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
