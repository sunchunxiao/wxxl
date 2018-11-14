<template>
  <div class="track">
    <div class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <!-- <el-table :data="strategyArr.slice((currentPage - 1) * 10, currentPage * 10)" stripe> -->
      <el-table
        :data="trackList"
        stripe>
        <el-table-column
          type="index"
          label="序号"/>
        <el-table-column
          prop="level"
          label="产品层级"
          :filters="[{text: '公司', value: '公司'},{text: '品类', value: '品类'},{text: '品牌', value: '品牌'},{text: '品种', value: '品种'},{text: '单品', value: '单品'}]"
          :filter-method="filterA"/>
        <el-table-column
          prop="subject"
          label="指标"
          :filters="[{text: '销售额', value: '销售额'}, {text: '产品成本', value: '产品成本'},{text: '毛利额', value: '毛利额'},{text: '产品投入产出比', value: '产品投入产出比'},{text: '库存周转率', value: '库存周转率'},{text: '日销', value: '日销'}]"
          :filter-method="filterB"/>
        <el-table-column
          prop="rank"
          label="评选等级"
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]"
          :filter-method="filterC"/>
        <el-table-column
          prop="package"
          label="影响因素"
          :filters="[{text: '供应商', value: '供应商'},{text: '采购', value: '采购'},{text: '预算', value: '预算'},{text: '包装', value: '包装'},{text: '摄影', value: '摄影'},{text: '流量', value: '流量'},{text: '转化', value: '转化'},{text: '客单', value: '客单'}]"
          :filter-method="filterD"/>
        <el-table-column
          prop="strategy"
          label="策略"/>
        <el-table-column
          prop="count_use"
          label="采纳次数"
          :filters="[{text: '30', value: '30'},{text: '21', value: '21'},{text: '20', value: '20'},{text: '16', value: '16'},{text: '15', value: '15'},{text: '12', value: '12'},{text: '10', value: '10'},{text: '8', value: '8'},{text: '7', value: '7'},{text: '6', value: '6'}]"
          :filter-method="filterF"/>
        <el-table-column
          prop="count_eff"
          label="有效次数"
          :filters="[{text: '19', value: '19'},{text: '18', value: '18'},{text: '14', value: '14'},{text: '12', value: '12'},{text: '10', value: '10'},{text: '9', value: '9'},{text: '8', value: '8'},{text: '7', value: '7'},{text: '5', value: '5'},{text: '4', value: '4'},{text: '3', value: '3'},]"
          :filter-method="filterG"/>
        <el-table-column
          prop="rate"
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
					pt: '日', // 周期类型
					date: [], // date
					search: '', // 暂时没有接口 先这样
					subject: 'S', // S: 销售额 P: 利润额
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
		},
		methods: {
			getProductStrategy() {
				const params = {
					page: this.currentPage,
					per_page: 10,
					level: "",
					package:'供应商',
					subject: this.form.subject,
					...this.getPeriodByPt(),
				};
				API.GetProductStrategy(params).then(res => {
					// console.log(res.data)
					this.trackList = res.data;
					this.total = res.total;
					this.$store.dispatch('SaveProductStrategy', res.data);
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
				// console.log(val)
				this.currentPage = val;
				const params = {
					page: this.currentPage,
					per_page: 10,
					level: 1,
					package:'供应商',
					subject: this.form.subject,
					...this.getPeriodByPt(),
				};
				API.GetProductStrategy(params).then(res => {
					this.trackList = res.data;
					// this.$store.dispatch('SaveProductStrategy', res.data);
				});
			}
		}
	};
</script>

<style lang="scss">
	@import './style/track.scss'
</style>
