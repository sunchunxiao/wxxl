<template>
  <div class="track">
    <div class="table_container">
      <div class="title">策略跟踪和策略应用</div>
      <el-table 
        @sort-change='sortChange'
        :data="trackList" 
        stripe>
        <el-table-column 
          type="index" 
          label="序号"/>
        <el-table-column 
          prop="level" 
          label="产品层级" 
          :filters="[{text: '公司', value: '公司'},{text: '平台', value: '平台'},{text: '店铺', value: '店铺'}]" 
          :filter-method="filterA"/>
        <el-table-column 
          prop="subject" 
          label="指标" 
          :filters="[{text: '销售额', value: '销售额'}, {text: '日销', value: '日销'},{text: '毛利额', value: '毛利额'},{text: '成本', value: '成本'},{text: '投入产出比', value: '投入产出比'},{text: '冗余', value: '冗余'}]" 
          :filter-method="filterB"/>
        <el-table-column 
          prop="rank" 
          label="评选等级" 
          :filters="[{text: '优', value: '优'},{text: '良', value: '良'},{text: '中', value: '中'},{text: '差', value: '差'}]" 
          :filter-method="filterC"/>
        <el-table-column 
          prop="package" 
          label="影响因素" 
          :filters="[{text: '推广', value: '推广'},{text: '活动', value: '活动'},{text: '发货', value: '发货'},{text: '流量', value: '流量'},{text: '转化', value: '转化'},{text: '客单', value: '客单'},{text: '渠道规划', value: '渠道规划'},{text: '渠道运营', value: '渠道运营'}]" 
          :filter-method="filterD"/>
        <el-table-column 
          prop="strategy" 
          label="策略"/>
        <el-table-column 
          prop="count_use" 
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
                  label="序号"/>
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
                {{ scope.row.count_use }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column 
          prop="count_eff" 
          label="有效次数" 
          sortable/>
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
                :data="trackList1">
                <el-table-column
                  type="index"
                  label="序号"/>
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
					pt: '日', // 周期类型
					date: [], // date
					search: '', // 暂时没有接口 先这样
					subject: 'S', // S: 销售额 P: 利润额
				},
				trackList:[],
				total:0,
                currentPage: 1,
                tableData: tableData,
                trackList1:[]
            };
        },
        
		mounted(){
			this.getChannelStrategy();
		},
        methods: {
            sortChange(){
				this.trackList = this.trackList.map(o=>{o.visible=false;o.visibleRate = false;return o;});
			},
            show(val){
				// console.log(val);
				this.trackList1 = [];
				if(val){
					this.trackList1.push({
					level:"公司-品牌A-平台A",
					time:'2018.3.2',
					rank1:'差',
					rank2:'优'
				},{
					level:"公司-品牌A-平台A",
					time:'2018.3.2',
					rank1:'中',
					rank2:'差'
				});
				}
			},
            getChannelStrategy() {
				const params = {
					page: this.currentPage,
					per_page: 10,
					level: '',
					package:'供应商',
					subject: this.form.subject,
					sort:''
				};
				API.GetChannelStrategy(params).then(res => {
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
				API.GetChannelStrategy(params).then(res => {
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
