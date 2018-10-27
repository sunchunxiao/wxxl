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
          :filters="[{text: '品类', value: '品类'}]" 
          :filter-method="filterA"/>
        <el-table-column 
          prop="subject_name" 
          label="指标" 
          :filters="[{text: '产品成本', value: '产品成本'}, {text: '日销', value: '日销'}]" 
          :filter-method="filterB"/>
        <el-table-column 
          prop="rank" 
          label="评选等级" 
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]" 
          :filter-method="filterC"/>
        <el-table-column 
          prop="inf_name" 
          label="影响因素" 
          :filters="[{text: '供应商', value: '供应商'},{text: '采购', value: '采购'},{text: '预算', value: '预算'},{text: '包装', value: '包装'},{text: '摄影', value: '摄影'},{text: '流量', value: '流量'},{text: '转化', value: '转化'},{text: '客单', value: '客单'}]" 
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
	
	const tableData = [{
			a: '品类',
			b: '产品成本',
			c: '优',
			d: '供应商',
			e: '按品类梳理供应商结构，对供应商报价进行综合评估和管理',
			f: '10',
			g: '10',
			h: '100%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '优',
			d: '采购',
			e: '持续优化采购渠道',
			f: '8',
			g: '8',
			h: '100%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '良',
			d: '预算',
			e: '持续优化品类成本管控预算结构',
			f: '12',
			g: '12',
			h: '100%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '良',
			d: '供应商',
			e: '按品类梳理供应商结构，对供应商报价进行综合评估和管理',
			f: '10',
			g: '9',
			h: '90%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '良',
			d: '采购',
			e: '持续优化采购渠道',
			f: '8',
			g: '4',
			h: '50%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '预算',
			e: '梳理现有品类成本预算结构',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '预算',
			e: '加强各环节成本预算管控',
			f: '6',
			g: '3',
			h: '50%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '包装',
			e: '查验包装成本中高成本环节，对其进行评估、调整或删除',
			f: '7',
			g: '7',
			h: '100%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '包装',
			e: '按预算整体控制包装成本',
			f: '16',
			g: '12',
			h: '75%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '供应商',
			e: '寻找新的高性价比供应商资源',
			f: '6',
			g: '5',
			h: '83%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '供应商',
			e: '建立供应商管理体系',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '供应商',
			e: '梳理品类供应商资源，根据不同的品类预算进行合理供应商资源配置',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '采购',
			e: '对高成本采购渠道或环节进行查验',
			f: '16',
			g: '12',
			h: '75%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '采购',
			e: '寻找新的高性价比采购渠道',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '中',
			d: '摄影',
			e: '查验摄影环节中高成本环节，对其进行评估调整',
			f: '16',
			g: '12',
			h: '75%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '预算',
			e: '梳理现有品类整体成本预算结构',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '预算',
			e: '加强各环节成本预算管控',
			f: '15',
			g: '14',
			h: '93%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '包装',
			e: '查验包装成本中高成本环节，对其进行评估、调整或删除',
			f: '15',
			g: '14',
			h: '93%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '包装',
			e: '按预算整体控制包装成本',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '供应商',
			e: '按品类查验报价较高的供应商，对其进行评估与调整',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '采购',
			e: '对高成本采购渠道或环节进行查验',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '采购',
			e: '寻找新的高性价比采购渠道',
			f: '15',
			g: '14',
			h: '93%'
		},
		{
			a: '品类',
			b: '产品成本',
			c: '差',
			d: '摄影',
			e: '查验摄影环节中高成本环节，对其进行评估调整',
			f: '16',
			g: '12',
			h: '75%'
		},
		{
			a: '品类',
			b: '日销',
			c: '优',
			d: '流量',
			e: '精准流量引流',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '日销',
			c: '优',
			d: '转化',
			e: '优化品类结构',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '优',
			d: '转化',
			e: '优化品类生活方式/场景展现',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '优',
			d: '转化',
			e: '优化商品运营',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '日销',
			c: '优',
			d: '客单',
			e: '优化服务',
			f: '15',
			g: '14',
			h: '93%'
		},
		{
			a: '品类',
			b: '日销',
			c: '优',
			d: '客单',
			e: '优化视觉',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '日销',
			c: '良',
			d: '流量',
			e: '精准流量引流',
			f: '30',
			g: '26',
			h: '87%'
		},
		{
			a: '品类',
			b: '日销',
			c: '良',
			d: '转化',
			e: '优化品类结构',
			f: '15',
			g: '14',
			h: '93%'
		},
		{
			a: '品类',
			b: '日销',
			c: '良',
			d: '转化',
			e: '优化品类生活方式/场景展现',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '日销',
			c: '良',
			d: '转化',
			e: '优化商品运营',
			f: '30',
			g: '26',
			h: '87%'
		},
		{
			a: '品类',
			b: '日销',
			c: '良',
			d: '客单',
			e: '优化服务',
			f: '16',
			g: '12',
			h: '75%'
		},
		{
			a: '品类',
			b: '日销',
			c: '良',
			d: '客单',
			e: '优化视觉',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '流量',
			e: '调整品类价格分布',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '流量',
			e: '突出品类差异化展现',
			f: '15',
			g: '14',
			h: '93%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '转化',
			e: '加强品类搭配',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '转化',
			e: '加强品类生活方式/场景表达',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '转化',
			e: '提升商品运营整体能力',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '客单',
			e: '加强场景引导',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '客单',
			e: '加强客服服务',
			f: '16',
			g: '12',
			h: '75%'
		},
		{
			a: '品类',
			b: '日销',
			c: '中',
			d: '客单',
			e: '加强关联销售与关联搭配',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '流量',
			e: '调整品类价格分布',
			f: '30',
			g: '26',
			h: '87%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '流量',
			e: '突出品类差异化展现',
			f: '20',
			g: '19',
			h: '95%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '转化',
			e: '加强品类搭配',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '转化',
			e: '加强品类生活方式/场景表达',
			f: '30',
			g: '26',
			h: '87%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '转化',
			e: '提升商品运营整体能力',
			f: '30',
			g: '26',
			h: '87%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '转化',
			e: '对销量转化极低的品类进行删除',
			f: '30',
			g: '18',
			h: '60%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '客单',
			e: '加强场景引导',
			f: '21',
			g: '14',
			h: '67%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '客单',
			e: '加强客服服务',
			f: '30',
			g: '26',
			h: '87%'
		},
		{
			a: '品类',
			b: '日销',
			c: '差',
			d: '客单',
			e: '加强关联销售与关联搭配',
			f: '30',
			g: '26',
			h: '87%'
		},
	];
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
				tableData: tableData
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
					subject: this.form.subject,
					page: this.currentPage,
					limit: 10,
					package:'供应商',
					...this.getPeriodByPt(),
				};
				API.GetOrgStrategiesTrack(params).then(res => {
					// console.log(res.data)
					this.trackList = res.data;
					this.total = res.total;
					// this.$store.dispatch('SaveProductStrategy', res.data);
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
