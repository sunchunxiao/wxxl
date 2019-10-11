<template>
  <div class="container">
    <el-row
      class="time_header">
      <search-bar
        ref="child"
        @search="handleSearch"
        url="/product/search"
        placeholder="产品编号/产品名称"
        v-model="searchBarValue"
        :pt-options="[ '月', '季']" />
    </el-row>
    <div class="overview outshaow">
      <div
        class="shaow"
        @click="handleShaowClick"
        v-show="showDialog" />
      <Card>
        <el-row class="margin-bottom-20 overview_title manage_title">
          <div>
            <template>
              供应商等级
              <el-select
                v-model="valueRank"
                @change="handleSelectChange('等级',valueRank)"
                placeholder="请选择">
                <el-option
                  v-for="item in optionsRank"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type" />
              </el-select>
            </template>
          </div>
          <div class="supply_left">
            <template>
              供应商名称
              <el-select
                v-model="valueName"
                @change="handleSelectChange('名称',valueName)"
                placeholder="请选择">
                <el-option
                  v-for="item in optionsName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </template>
          </div>
        </el-row>
        <ManageRadar
          v-if="orggossipArr.length"
          :id="'outRadar'"
          :data="orggossipArr" />
        <!-- 表格 -->
        <div class="track">
          <div
            class="data_container"
            v-show="showDialog">
            <el-table
              stripe
              width="100%"
              height="400"
              :data="dialogData">
              <el-table-column
                prop="eff"
                label="策略" />
            </el-table>
          </div>
          <div
            v-loading="loading"
            class="table_container">
            <!-- <div class="title">策略跟踪和策略应用</div> -->
            <el-table
              :cell-style="changeCellStyle"
              :data="optionScore"
              stripe>
              <el-table-column
                type="index"
                width="50px"
                label="序号" />
              <el-table-column
                prop="type_name"
                label="供应商等级" />
              <el-table-column
                prop="name"
                label="供应商名称" />
              <el-table-column
                prop="comprehensive"
                sortable
                label="综合得分">
                <template
                  slot-scope="scope">
                  <div
                    @click="handleCountUseClick($event, scope.row,'comprehensive')"
                    class="name-wrapper cell_count count_use">
                    {{ scope.row.comprehensive }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="strategy"
                label="分项得分">
                <el-table-column
                  prop="production_capacity"
                  min-width="100"
                  label="产能"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'production_capacity')"
                      class="name-wrapper cell_count count_use">
                      {{ scope.row.production_capacity }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quality"
                  min-width="100"
                  label="品质"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'quality')"
                      class="name-wrapper cell_count count_use">
                      {{ scope.row.quality }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="性价"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'price')"
                      class="name-wrapper cell_count count_use">
                      {{ scope.row.price }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="delivery"
                  label="交付"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'delivery')"
                      class="name-wrapper cell_count count_use">
                      {{ scope.row.delivery }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="effectiveness"
                  label="效率"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'effectiveness')"
                      class="name-wrapper cell_count count_rate">
                      {{ scope.row.effectiveness }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="service"
                  label="服务"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'service')"
                      class="name-wrapper cell_count count_rate">
                      {{ scope.row.service }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="funds"
                  label="资金"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'funds')"
                      class="name-wrapper cell_count count_rate">
                      {{ scope.row.funds }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="development"
                  label="开发"
                  sortable>
                  <template
                    slot-scope="scope">
                    <div
                      @click="handleCountUseClick($event, scope.row,'development')"
                      class="name-wrapper cell_count count_rate">
                      {{ scope.row.development }}
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import ManageRadar from '../ManageRadar';

//vuex
import { mapGetters } from 'vuex';

export default {
    components: {
        Card,
        SearchBar,
        ManageRadar
    },
    data () {
        return {
            optionsRank:[],
            optionsName:[],
            optionScore:[],
            optionScoreRadar:{},
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            //tree
            pt: '',
            //js
            loading: false,
            // stragety
            val: {},
            searchBarValue: {
                pt: '',
                sDate: '',
                eDate: ''
            },
            changeDate: {},
            //views
            currView: '',
            valueRank: 1,
            valueName: '0',
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
            // filterArr: [],
            optionScoreAll: [],
            dialogType: "",
            showDialog: false,
            comprehensive:'',
            production_capacity:''
        };
    },
    computed: {
        ...mapGetters(['orgradarArr','orggossipArr']),
        dialogData() {
            let optionScore = this.optionScoreAll.map(el=>{
                let obj = {};
                obj.eff= el;
                return obj;
            });
            return optionScore;
        }
    },
    watch: {
        val() {
            this.allRequest();
        }
    },
    mounted () {
        this.val = this.searchBarValue;
        this.currView = this.$route.params.name;
        //获取初始时间
        this.changeDate = this.searchBarValue;
        this.getRank();
        // this.getOrgStrategy();
        // this.getFliters();
    },
    methods: {
        changeCellStyle({ row,columnIndex }) {
            if (columnIndex == 3) {
                if(row.comprehensive == this.comprehensive) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            } else if (columnIndex == 4) {
                if(row.production_capacity == this.production_capacity) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 5) {
                if(row.quality == this.quality) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 6) {
                if(row.price == this.price) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 7) {
                if(row.delivery == this.delivery) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 8) {
                if(row.effectiveness == this.effectiveness) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 9) {
                if(row.service == this.service) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 10) {
                if(row.funds == this.funds) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }else if (columnIndex == 11) {
                if(row.development == this.development) {
                    return 'color:rgba(255,51,51,0.7)';
                }
            }
        },
        handleSelectChange(typeName,value) {
            if (typeName=='等级') {
                this.getName(value);
            }
            this.getScore(this.valueRank,this.valueName);
            this.getGossip(this.valueRank,this.valueName);
        },
        getGossip(type,id) {
            const params = {
                type: type,
                id: id,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            API.GetSupplyGossip(params).then(res => {
                this.$store.dispatch('SaveOrgGossipArr', [res.data]);
            }).finally(() => {
                this.loading = false;
            });
        },
        getScore(type,id) {
            const params = {
                type: type,
                id: id,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            API.GetSupplyScore(params).then(res => {
                let Name = Object.keys(res.data[0]);
                this.minMath(res.data, Name);
                this.optionScore = res.data;
            }).finally(() => {
                this.loading = false;
            });
        },
        //最小值标红
        minMath(data,strArr){
            for(let i of strArr){
                let strMin = data.map((el)=>{
                    return el[i];
                });
                this[i] = Math.min.apply(Math,strMin);
            }
        },
        getName(type) {
            const params = {
                type:type
            };
            API.GetSupplyList(params).then(res => {
                this.optionsName = res.data;
            });
        },
        getRank() {
            API.GetSupplyRank().then(res => {
                this.optionsRank = res.data;
                this.getName(1);
                this.getScore(this.valueRank,this.valueName);
                this.getGossip(this.valueRank,this.valueName);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            this.getScore(this.valueRank,this.valueName);
            this.getGossip(this.valueRank,this.valueName);
        },
        getPt() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                this.pt = this.val.pt;
            } else {
                this.pt = date.pt;
            }
            return this.pt;
        },
        getDateObj() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                return {
                    sDate: this.val.sDate,
                    eDate: this.val.eDate,
                };
            } else {
                return {
                    sDate: date.sDate,
                    eDate: date.eDate,
                };
            }
        },
        getPeriodByPt() {
            const {
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    sDate: sDate,
                    eDate: eDate,
                };
            } else {
                return {
                    pt: '日',
                    sDate: '2018-01-01',
                    eDate: '2018-01-31',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        handleSearch(val) {
            this.val = val;
            //搜索相同的id,改变时间
            if (this.changeDate.sDate !== val.sDate || this.changeDate.eDate !== val.eDate) {
                this.allRequest();
                this.treeClone = _.cloneDeep(this.productTree);
            }
            this.changeDate = this.searchBarValue;
        },
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
        handleCountUseClick($event, row,type) {
            this.cloneTr($event);
            this.showDialog = true;
            this.show(row,type);
        },
        // handleCountEff($event, row) {
        //     this.cloneTr($event);
        //     this.showDialog = true;
        //     this.showEff(row);
        // },
        sortChange(val) {
            this.optionScore = this.optionScore;
            let order;
            if (val.prop && val.order) {
                if (val.order === "ascending") {
                    order = 'asc';
                } else {
                    order = 'desc';
                }
                this.sort = val.prop + ':' + order;
            }
        },
        show(val,type) {
            this.optionScoreAll = [];
            const params = {
                item_type: type,
                score: parseInt(val[type])
            };
            API.GetOrgStrategy(params).then(res => {
                this.optionScoreAll = res.data;
            });
        },
        // getFliters() {
        //     API.GetOrgFilter().then(res => {
        //         this.filtersLevel = res.level;
        //         this.filtersSubject = res.subject;
        //         this.filtersRank = res.rank;
        //         this.filtersInfo = res.package;
        //     });
        // },
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
                this.optionScore = res.data;
                this.total = res.total;
            }).finally(() => {
                this.loading = false;
            });
        },
        // handleCurrentChange(val) {
        //     this.loading = true;
        //     this.currentPage = val;
        //     const params = {
        //         page: this.currentPage,
        //         limit: 10,
        //         level: this.level,
        //         subject: this.subject,
        //         rank: this.rank,
        //         inf_id: this.inf_id,
        //         sort: this.sort
        //     };
        //     API.GetOrgStrategiesTrack(params).then(res => {
        //         this.optionScore = res.data;
        //     }).finally(() => {
        //         this.loading = false;
        //     });
        // }
    }
};
</script>

<style lang="scss">
.outshaow{
    position: relative;
    .shaow {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        opacity: 0.5;
        z-index: 1;
        background: white;
    }
    .track .table_container .el-table .el-table__row .cell:not(.clone-cell) .cell_count{
        text-decoration:none;
    }
    tbody > tr{
            td {
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                &:first-child {
                    border-left: 1px solid transparent;
                }
                &:last-child {
                    border-right: 1px solid transparent;
                }
            }
            &:hover {
                td {
                    border-color: #f5f7fa!important;
                }
            }
        }
}
.manage_title {
    display: flex;
    justify-content: left;
    .supply_left{
        margin-left: 30px
    }
}
.el-table--border{
    border-bottom: 1px solid #ebeef5;
}
@import '../../Product/style/overview.scss';
@import '../../Product/style/track.scss'
</style>
