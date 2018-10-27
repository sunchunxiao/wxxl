<template>
  <div class="contrast">
    <el-row>
      <el-form 
        ref="form" 
        :model="form" 
        label-width="100px" 
        size="mini">
        <el-col :span="5">
          <el-form-item label="时间单位选择">
            <el-select v-model="form.unit">
              <el-option 
                label="日" 
                value="day"/>
              <el-option 
                label="周" 
                value="week"/>
              <el-option 
                label="月" 
                value="month"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="时间段选择">
            <el-date-picker 
              v-model="form.time" 
              type="datetimerange" 
              range-separator="至" 
              start-placeholder="开始日期"
              end-placeholder="结束日期" 
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd" 
              align="right"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="精确搜索">
            <el-input 
              v-model="form.search" 
              placeholder="产品编号/产品名称">
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-search"/>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary">go</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row 
      class="content_row" 
      :gutter="20">
      <el-col 
        :span="5" 
        class="tree_container">
        <div class="title">毛利目标达成率</div>
        <div class="company">
          <span class="left">{{ organizationTree.name }}</span>
          <span class="right">{{ calculatePercent(organizationTree.real_total, organizationTree.target_total).percent + '%' }}</span>
        </div>
        <!-- 有多个tree -->
        <el-tree 
          :data="organizationTree.children" 
          :props="defaultProps" 
          @node-click="handleNodeClick" 
          show-checkbox
          @check-change="handleCheckChange">
          <span 
            class="custom-tree-node" 
            slot-scope="{ node, data }">
            <span class="label">{{ data.name }}</span>
            <span :class="{percent: true, red: !calculatePercent(data.real_total, data.target_total).largerThanOne, blue: calculatePercent(data.real_total, data.target_total).largerThanOne}">{{ calculatePercent(data.real_total, data.target_total).percent + '%' }}</span>
            <div 
              :class="{progress: true, 'border-radius0': calculatePercent(data.real_total, data.target_total).largerThanOne}"
              :style="{width: calculatePercent(data.real_total, data.target_total).largerThanOne ? '105%' : `${calculatePercent(data.real_total, data.target_total).percent + 5}%`}"/>
          </span>
        </el-tree>
      </el-col>
      <el-col 
        :span="19" 
        class="overflow">
        <el-row v-loading="loading">
          <Card v-if="type==1||type==3">
            <el-row class="card-title">组织对比分析和平均值分析前端</el-row>
            <el-row >
              <el-col :span="6">
                <template v-for="(item, index) in orgcompareArr">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(0 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item.subject_name" 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="18" 
                v-if="orgcompareArr.length > 0">
                <ConOrgComparisonAverageBig 
                  :title="orgcompareArr[index0].subject_name" 
                  :data="orgcompareArr[index0]" 
                  id="ConOrgComparisonAverage"
                  :index="index0"/>
              </el-col>
            </el-row>

          </Card>
          <Card v-if="type==2||type==3">
            <el-row class="card-title">组织对比分析和平均值分析后端</el-row>
            <el-row>
              <el-col :span="6">
                <template v-for="(item, index) in orgcompareArrback">
                  <el-col 
                    :key="index" 
                    :span="12" 
                    @click.native="clickIndex(1 ,index)">
                    <ConOrgComparisonAverage 
                      :title="item.subject_name" 
                      :id="`${index+orgcompareArr.length}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="18" 
                v-if="orgcompareArrback.length > 0">
                <ConOrgComparisonAverageBig 
                  :title="orgcompareArrback[index1].subject_name" 
                  :data="orgcompareArrback[index1]" 
                  id="ConOrgComparisonAverage1"
                  :index="index0"/>
              </el-col>
            </el-row>

          </Card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import API from './api';
	import Card from '../../components/Card';
	// 组织对比分析和平均值分析
	import ConOrgComparisonAverage from '../../components/ConOrgnization';
	import ConOrgComparisonAverageBig from '../../components/ConOrgnizationBig';

	import mockPieData from './mock/pieData.js';
	import mockComparisonAverageData from './mock/comparisonAverageData.js';
	import tree from './mock/productTreeData.js';

    import { mapGetters } from 'vuex';
    const TREE_PROPS = {
        children: 'children',
        label: 'name'
    };
    const TIMEPT = {
        '周': 'week',
        '月': 'month',
        '季': 'quarter',
        '年': 'year'
    };

	export default {
		components: {
			Card,
			ConOrgComparisonAverage,
			ConOrgComparisonAverageBig
		},
		data() {
			return {
				form: {
					pt: '月',
					date: [],
					search: '',
					subject: 'S', // S: 销售额 P: 利润额
					version: '0'
				},
				loading: false,
				cid: 1,
				tree: tree,
				treeData: tree.data.children,
				defaultProps: TREE_PROPS,
				pieData: mockPieData(),
				comparisonAverageData: mockComparisonAverageData(),
				index0: 0,
				index1: 0,
				length:0,
				type:3
			};
		},
		computed: {
			...mapGetters(['organizationTree', 'orgprogressArr', 'orgcompareArr','orgcompareArrback']),
			hasTree() {
				return !_.isEmpty(this.organizationTree);
			}
		},
		watch: {
			form: {
				handler: function() {},
				deep: true
			},
			cid: function() {
					// 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
					// 暂时先在这里做
					this.getProgressbefore();
					this.getProgressback();

			}
		},
		mounted() {
			if (!this.hasTree) {
				this.getTree();
			}
			this.getProgressbefore();
			this.getProgressback();

		},

		methods: {
			getTree() {
				const params = {
					pt: this.form.pt,
					subject: this.form.subject,
					...this.getPeriodByPt(),
					version: this.form.version
				};
				API.GetOrgTree(params).then(res => {
					//                  console.log(res)
					this.type = res.tree.type;
					this.$store.dispatch('SaveOrgTree', res.tree);
				});
			},
			getProgressbefore() {
				const params = {
					rType:1
				};
				API.GetOrgSubject(params).then(res => {
					// console.log(res.data)
					// this.$store.dispatch('SaveOrgProgressData', res.data);
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});

						this.$store.dispatch('SaveOrgCompareArr', resultList);
					});
				});
			},
			getTrend(subject) {
				const params = {
					cid: this.cid,
					pt: this.form.pt,
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version,
					rType: 1
				};
				return API.GetOrgCompare(params);
			},
			getProgressback() {
				const params = {
					rType:2
				};
				API.GetOrgSubject(params).then(res => {

					const promises = _.map(res.data, o => this.getTrendback(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});

						this.$store.dispatch('SaveOrgCompareArrback', resultList);
					});
				});
			},
			getTrendback(subject) {
				const params = {
					cid: this.cid,
					pt: this.form.pt,
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version,
					rType: 2
				};
				return API.GetOrgCompare(params);
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
			getDateObj() {
				const {
					date
				} = this.form;
				return {
					sDate: date[0] || '',
					eDate: date[1] || '',
				};
			},
			handleNodeClick(data) {
				this.type = data.type;
				if (data.children != undefined) {
					this.cid = data.cid;
					this.loading = true;
					//                  setTimeout(() => {
					//                      this.getProgress();
					//                      this.getStructure();
					//                      this.getRank();
					//                  }, 300);
					setTimeout(() => {
						this.loading = false;
					}, 1000);
				}
			},
			handleCheckChange(data, checked, indeterminate) {
			// console.log(data, checked, indeterminate);
			},
			clickIndex(i, idx) {
				this[`index${i}`] = idx;

			},
			calculatePercent(a, b) {
				if (b > 0) {
					const percent = parseInt(a / b * 100);
					const largerThanOne = (a / b) > 1;
					return {
						percent,
						largerThanOne
					};
				}
				return {};
			},
		}
	};
</script>

<style lang="scss">
    @import '../Product/style/contrast.scss';
</style>
