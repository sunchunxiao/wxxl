<template>
  <div class="track">
    <div class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <el-table 
        @sort-change="sortChange"
        :data="trackList" 
        stripe>
        <el-table-column 
          type="index" 
          label="序号" />
        <el-table-column 
          prop="level_name" 
          label="组织层级" 
          :filters="[{text: '全公司', value: '全公司'},{text: '事业部', value: '事业部'},{text: '部门', value: '部门'},{text: '小组', value: '小组'}]" 
          :filter-method="filterA" />
        <el-table-column 
          prop="subject_name" 
          label="指标" 
          :filters="[{text: '销售额', value: '销售额'}, {text: '利润', value: '利润'},{text: '成本', value: '成本'},{text: '日销', value: '日销'},{text: '投入产出比', value: '投入产出比'},{text: '人员冗余值', value: '人员冗余值'}]" 
          :filter-method="filterB" />
        <el-table-column 
          prop="rank_name" 
          label="评选等级" 
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]" 
          :filter-method="filterC" />
        <el-table-column 
          prop="inf_name" 
          label="影响因素" 
          :filters="[{text: '薪酬规划', value: '薪酬规划'},{text: '人员业务能力', value: '人员业务能力'},{text: '总的成本费用', value: '总的成本费用'},{text: '总销售收入', value: '总销售收入'},{text: '治理方式', value: '治理方式'},{text: '员工个人能力', value: '员工个人能力'},{text: '人力资源规划', value: '人力资源规划'},{text: '企业架构', value: '企业架构'},{text: '客单', value: '客单'}]" 
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
                :data="trackList1">
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
                  label="策略应用前" />
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
                :data="trackList1">
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
                  label="策略应用前" />
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
const TIMEPT = {
  '周': 'week',
  '月': 'month',
  '季': 'quarter',
  '年': 'year'
};
	
export default {
  components: {},
  data() {
    return {
      form: {
        pt: '月',
        date: [],
        search: '',
        subject: 'S', // S: 销售额 P: 利润额
        version: '0'
      },
      trackList:[],
      total:0,
      currentPage: 1,
      trackList1:[]
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
    // console.log(this.strategyArr)
  },
  methods: {
    sortChange(){
      this.trackList = this.trackList.map(o=>{o.visible=false;o.visibleRate = false;return o;});
    },
    show(val){
      this.trackList1 = [];
      if(val){
        this.trackList1.push({
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
      const params = {
        subject: '',
        page: this.currentPage,
        limit: 10,
        package:'供应商',
        ...this.getPeriodByPt(),
      };
      API.GetOrgStrategiesTrack(params).then(res => {
        this.trackList = res.data.map(o=>{o.visible=false;o.visibleRate=false;return o;});
        this.total = res.total;
					
      });
    },
    getDateObj() {
      const {
        date
      } = this.form;
      return {
        sDate: date[0] || '',
        eDate: date[1] || '',
      };
    },
    getPeriodByPt() {
      const {
        sDate,
        eDate
      } = this.getDateObj();
      const {
        pt
      } = this.form;
      if (sDate && eDate) { // 计算时间周期
        if (pt === '日') {
          return {
            sDate,
            eDate
          };
        }
        let unit = TIMEPT[pt];
        if (unit) {
          return {
            sDate: moment(sDate).startOf(unit).format('YYYY-MM-DD'),
            eDate: moment(eDate).endOf(unit).format('YYYY-MM-DD')
          };
        } else {
          return {
            sDate: '2018-01-01',
            eDate: '2018-06-01',
            // 先写死个时间
            // sDate: moment().startOf('week').format('YYYY-MM-DD'),
            // eDate: moment().format('YYYY-MM-DD'),
          };
        }
      } else {
        return {
          sDate: '2018-01-01',
          eDate: '2018-06-01',
          // 先写死个时间
          // sDate: moment().startOf('week').format('YYYY-MM-DD'),
          // eDate: moment().format('YYYY-MM-DD'),
        };
      }
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
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      const params = {
        page: this.currentPage,
        limit: 10,
        subject: '',
        ...this.getPeriodByPt(),
      };
      API.GetOrgStrategiesTrack(params).then(res => {
        this.trackList = res.data;
        // this.$store.dispatch('SaveProductStrategy', res.data);
      });
    }
  }
};
</script>

<style lang="scss">
	@import '../Product/style/track.scss'
</style>
