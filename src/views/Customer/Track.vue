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
          label="客户层级" 
          :filters="[{text: '公司', value: '公司'},{text: '整体人群', value: '整体人群'},{text: '聚类人群', value: '聚类人群'},{text: '典型客户', value: '典型客户'}]" 
          :filter-method="filterA"/>
        <el-table-column 
          prop="subject_name" 
          label="指标" 
          :filters="[{text: '销售额', value: '销售额'}, {text: '利润额', value: '利润额'},{text: '成本', value: '成本'},{text: '日销', value: '日销'},{text: '投入产出比', value: '投入产出比'},{text: '冗余', value: '冗余'}]" 
          :filter-method="filterB"/>
        <el-table-column 
          prop="rank_name" 
          label="评选等级" 
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]" 
          :filter-method="filterC"/>
        <el-table-column 
          prop="inf_name" 
          label="影响因素" 
          :filters="[{text: '推广计划', value: '推广计划'},{text: '费用预算管控', value: '费用预算管控'},{text: '客户结构', value: '客户结构'},{text: '流量', value: '流量'},{text: '客群定位', value: '客群定位'},{text: '客单', value: '客单'},{text: '客户运营', value: '客户运营'},{text: '品牌竞争力', value: '品牌竞争力'}]" 
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
                currentPage: 1,
                trackList:[],
                total:0
            };
        },
        mounted(){
			this.getProductStrategy();
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
				API.GetCusStrategiesTrack(params).then(res => {
					this.trackList = res.data;
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
                this.currentPage = val;
            }
        }
    };
</script>

<style lang="scss">
    @import '../Product/style/track.scss'
</style>
