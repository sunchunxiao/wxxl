<template>
  <div class="track">
    <div class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <el-table 
        :data="trackList" 
        stripe>
        <el-table-column 
          type="index" 
          label="序号"/>
        <el-table-column 
          prop="level_name" 
          label="组织层级" 
          :filters="[{text: '公司', value: '公司'},{text: '事业部', value: '事业部'},{text: '部门', value: '部门'},{text: '一级小组', value: '一级小组'}]" 
          :filter-method="filterA"/>
        <el-table-column 
          prop="subject_name" 
          label="指标" 
          :filters="[{text: '销售额', value: '销售额'}, {text: '净利润额', value: '净利润额'},{text: '人力成本额', value: '人力成本额'},{text: '日销', value: '日销'},{text: '投入产出比', value: '投入产出比'},{text: '人员冗余值', value: '人员冗余值'}]" 
          :filter-method="filterB"/>
        <el-table-column 
          prop="rank" 
          label="评选等级" 
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]" 
          :filter-method="filterC"/>
        <el-table-column 
          prop="inf_name" 
          label="影响因素" 
          :filters="[{text: '薪酬规划', value: '薪酬规划'},{text: '人员业务能力', value: '人员业务能力'},{text: '总的成本费用', value: '总的成本费用'},{text: '总销售收入', value: '总销售收入'},{text: '治理方式', value: '治理方式'},{text: '员工个人能力', value: '员工个人能力'},{text: '人力资源规划', value: '人力资源规划'},{text: '企业架构', value: '企业架构'},{text: '客单', value: '客单'}]" 
          :filter-method="filterD"/>
        <el-table-column 
          prop="strategy" 
          label="策略"/>
        <el-table-column 
          prop="use_num" 
          label="采纳次数" 
          :filters="[{text: '30', value: '30'},{text: '21', value: '21'},{text: '20', value: '20'},{text: '16', value: '16'},{text: '15', value: '15'},{text: '12', value: '12'},{text: '10', value: '10'},{text: '8', value: '8'},{text: '7', value: '7'},{text: '6', value: '6'}]" 
          :filter-method="filterF"/>
        <el-table-column 
          prop="suc_num" 
          label="有效次数" 
          :filters="[{text: '19', value: '19'},{text: '18', value: '18'},{text: '14', value: '14'},{text: '12', value: '12'},{text: '10', value: '10'},{text: '9', value: '9'},{text: '8', value: '8'},{text: '7', value: '7'},{text: '5', value: '5'},{text: '4', value: '4'},{text: '3', value: '3'},]" 
          :filter-method="filterG"/>
        <el-table-column 
          prop="acc_rate" 
          label="策略准确度/适用度" 
          :filters="[{text: '100%', value: '100%'},{text: '95%', value: '95%'},{text: '93%', value: '93%'},{text: '90%', value: '90%'},{text: '87%', value: '87%'},{text: '83%', value: '83%'},{text: '75%', value: '75%'},{text: '67%', value: '67%'},{text: '60%', value: '60%'},{text: '50%', value: '50%'},]" 
          :filter-method="filterH"/>
      </el-table>
      <div class="page_container">
        <el-pagination 
          @current-change="handleCurrentChange" 
          :current-page="currentPage" 
          :page-size="10" 
          layout="total, prev, pager, next, jumper" 
          :total="total"/>
      </div>
    </div>
  </div>
</template>

<script>
    import API from './api';
	import _ from 'lodash';
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
				
			};
		},
		watch: {

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
			getProductStrategy() {
				const params = {
					subject: '',
					page: this.currentPage,
					limit: 10,
					package:'供应商',
					...this.getPeriodByPt(),
				};
				API.GetOrgStrategiesTrack(params).then(res => {
					// console.log(res.data)
					this.trackList = res.data;
					this.total = res.total;
					for(let i=0;i<res.data.length;i++){
						res.data[i].rank = this.rank(res.data[i].rank);
					}
					// this.$store.dispatch('SaveProductStrategy', res.data);
				});
			},
			rank(score) {
				if (1 == score) {
					return '差';
				}
				if (2 == score) {
					return '中';
				}
				if (3 == score) {
					return '良';
				}
				if (4 === score) {
					return '优';
				}
				return '差';
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
