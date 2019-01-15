<template>
  <div class="track">
    <div
      class="shaow"
      @click="handleShaowClick"
      v-show="showDialog" />
    <div
      class="data_container"
      v-show="showDialog">
      <el-table
        stripe
        width="100%"
        height="500"
        v-loading="dialogType=='countUse'?countUseLoading:countEffLoading"
        :data="dialogData">
        <el-table-column
          width="50px"
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
    </div>
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
          width="50px"
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
          min-width="200"
          label="策略" />
        <el-table-column
          prop="count_use"
          label="采纳次数"
          sortable='custom'>
          <template
            slot-scope="scope">
            <div
              @click="handleCountUseClick($event, scope.row)"
              class="name-wrapper cell_count count_use">
              {{ scope.row.count_use }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="count_eff"
          label="有效次数"
          sortable='custom'>
          <template
            slot-scope="scope">
            <div
              @click='handleCountEff($event, scope.row)'
              class="name-wrapper cell_count count_eff">
              {{ scope.row.count_eff }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          label="策略准确度/适用度"
          sortable='custom'>
          <!-- 点击策略准确度,弹出下面这个窗口的所有策略应用情况 -->
          <template slot-scope="scope">
            <div
              @click="handleCountUseClick($event, scope.row)"
              class="name-wrapper cell_count count_rate">
              {{ scope.row.rate }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="page_container"
        v-if="total">
        <el-pagination
          background
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
            dialogType: "",
            showDialog: false,
            countUseLoading: false,
            countEffLoading: false,
            lastCountUseId: "",
            lastCountEffId: ""
        };
    },
    computed: {
        dialogData() {
            let obj = {
                "countUse": this.trackListAll,
                "countEff": this.trackListEff
            };
            return obj[this.dialogType];
        }
    },
    mounted() {
        this.getProductStrategy();
        this.getFliters();
    },
    methods: {
        handleShaowClick() {
            this.showDialog = false;
            for (let i of this.trNodes) {
                i.removeChild(i.childNodes[1]);
            }
        },
        cloneTr($event) {
            let targetClassName = $event.target.className;
            $event.path[3].childNodes.forEach((tdNodes,index) => {
                let cloneCellNodes = tdNodes.childNodes[0].cloneNode(true);
                let className = cloneCellNodes.className += " clone-cell";
                if (index == 0) {
                    className += " border-left";
                } else if (index == $event.path[3].childNodes.length - 1) {
                    className += " border-right";
                }
                let targetDom = cloneCellNodes.getElementsByClassName(targetClassName)[0];
                if (targetDom) {
                    targetDom.className = targetClassName + " active";
                }
                cloneCellNodes.className = className;
                tdNodes.appendChild(cloneCellNodes);
            });
            this.trNodes = $event.path[3].childNodes;
        },
        handleCountUseClick($event, row) {
            this.cloneTr($event);
            this.dialogType = "countUse";
            this.showDialog = true;
            this.show(row);
        },
        handleCountEff($event, row) {
            this.cloneTr($event);
            this.dialogType = "countEff";
            this.showDialog = true;
            this.showEff(row);
        },
        sortChange(val) {//筛选
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
        showEff(val) {//有效次数接口
            if (val.id == this.lastCountEffId) {
                return;
            }
            this.lastCountEffId = val.id;
            this.trackListEff = [];
            const effRecord = 1;//是否只返回有效的应用记录 1是 0否
            const params = {
                strategyId: val.id,
                goodOnly: effRecord
            };
            this.countEffLoading = true;
            API.GetProductApplog(params).then(res => {
                this.trackListEff = res.data;
                this.countEffLoading = false;
            }).catch(() => {
                this.lastCountEffId = "";
            });
        },
        show(val) {//采纳次数
            if (val.id == this.lastCountUseId) {
                return;
            }
            this.lastCountUseId = val.id;
            this.trackListAll = [];
            const unEffRecord = 0;//是否只返回有效的应用记录 1是 0否(全部)
            const params = {
                strategyId: val.id,
                goodOnly: unEffRecord
            };
            this.countUseLoading = true;
            API.GetProductApplog(params).then(res => {
                this.trackListAll = res.data;
                this.countUseLoading = false;
            }).catch(() => {
                this.lastCountUseId = "";
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
                this.trackList = res.data;
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
