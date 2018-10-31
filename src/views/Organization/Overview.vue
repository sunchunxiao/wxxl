<template>
  <div class="overview">
    <el-row>
      <el-form 
        ref="form" 
        :model="form" 
        label-width="100px" 
        size="mini">
        <el-col :span="5">
          <el-form-item label="时间单位选择">
            <el-select v-model="form.pt">
              <el-option 
                label="月" 
                value="day"/>
              <el-option 
                label="季" 
                value="week"/>
              <el-option 
                label="年" 
                value="month"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="时间段选择">
            <el-date-picker 
              v-model="form.date" 
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
          :highlight-current="true" 
          @node-click="handleNodeClick">
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
          <Card>
            <el-row class="card-title">目标达成情况总览</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in orgprogressArr">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(0 ,index)">
                    <ProTargetAchievement 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                v-if="orgprogressArr.length > 0" 
                :span="8" 
                class="border-left">
                <ProTargetAchievementBig 
                  :id="'select'" 
                  :data="orgprogressArr[index0]"/>
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">目标-实际-差异趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in orgtrendArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(1 ,index)">
                  <ProTargetActualDiffTrend 
                    :id="`${index}`" 
                    :data="item"/>
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">同比环比趋势分析</el-row>
            <el-row>
              <template v-for="(item, index) in orgtrendArr">
                <el-col 
                  :key="index" 
                  :span="12" 
                  @click.native="clickIndex(2 ,index)">
                  <ProYearOnYearTrend 
                    :id="`${index}`" 
                    :data="item"/>
                </el-col>
              </template>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-if="type==1||type==3" 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析前端</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in orgstructureArr1">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison 
                      :id="`${index}`" 
                      :data="item"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProportionalStructureAverageComparisonBig 
                  id="ProportionalStructureAverageComparisonBig" 
                  v-if="orgstructureArr1.length>0"
                  :data="orgstructureArr1[index3]"/>
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-if="type==2||type==3" 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">比例结构与平均值对比分析后端</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item1, index) in orgstructureArr2">
                  <el-col 
                    :key="index" 
                    :span="6" 
                    @click.native="clickIndex(4 ,index)">
                    <ProportionalStructureAverageComparison 
                      :id="`${index+orgstructureArr1.length}`" 
                      :data="item1"/>
                  </el-col>
                </template>
              </el-col>
              <el-col 
                :span="8" 
                class="border-left">
                <ProportionalStructureAverageComparisonBig 
                  v-if="orgstructureArr2.length>0" 
                  id="ProportionalStructureAverageComparisonBig1" 
                  :data="orgstructureArr2[index4]"/>
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row 
          v-loading="loading" 
          class="margin-top-10">
          <Card>
            <el-row class="card-title">智能评选和智能策略</el-row>
            <el-row>
              <el-col :span="14">
                <IntelligentSelection 
                  id="rank" 
                  @showStragety="showStragety" 
                  :data="orgrankArr"/>
              </el-col>
              <el-col :span="10">
                <div class="stragety">
                  <div class="stragety-title">智能策略</div>
                  <div class="stragety-box">
                    <div class="stragety-selected-title">{{ stragetyTitle }}</div>
                    <el-checkbox-group v-model="stragetyCheckList">
                      <el-checkbox 
                        v-for="(item,index) in stragety" 
                        :key="index" 
                        :label="item.strategy" 
                        @change="change"/>
                    </el-checkbox-group>
                    <el-button 
                      @click="submit" 
                      type="primary" 
                      class="center">确 认</el-button>
                  </div>
                </div>
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
	import moment from 'moment';
	import Card from '../../components/Card';
	// 目标达成情况总览
	import ProTargetAchievement from '../../components/ProTargetAchievement';
	import ProTargetAchievementBig from '../../components/ProTargetAchievementBig';
	// 目标-实际-差异趋势分析
	import ProTargetActualDiffTrend from '../../components/ProTargetActualDiffTrend';
	// import ProTargetActualDiffTrendBig from '../../components/ProTargetActualDiffTrendBig';
	// 同比环比趋势分析
	import ProYearOnYearTrend from '../../components/ProYearOnYearTrend';
	// import ProYearOnYearTrendBig from '../../components/ProYearOnYearTrendBig';
	// 比例结构与平均值对比分析
	import ProportionalStructureAverageComparison from '../../components/ProportionalStructureAverageComparison';
	import ProportionalStructureAverageComparisonBig from '../../components/ProportionalStructureAverageComparisonBig';
	// 智能评选和智能策略
	import IntelligentSelection from '../../components/IntelligentSelection';

	// tree
	import tree from './mock/productTreeData.js';
	// mock
	import mockPieData from './mock/pieData.js';
	import mockTrendData from './mock/trendData.js';
	import mockAverageData from './mock/averageData.js';
	import mockHeatmapData from './mock/heatmapData.js';

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
			ProYearOnYearTrend,
			// ProYearOnYearTrendBig,
			ProportionalStructureAverageComparison,
			ProportionalStructureAverageComparisonBig,
			IntelligentSelection,
			ProTargetAchievement,
			ProTargetAchievementBig,
			ProTargetActualDiffTrend,
			// ProTargetActualDiffTrendBig
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
				cid: 1,
				loading: false,
				// tree
				tree: tree,
				treeData: tree.data.children,
				defaultProps: TREE_PROPS,
				// index
				index0: 0,
				index1: 0,
				index2: 0,
				index3: 0,
				index4: 0,
				// mockData
				pieData: mockPieData(),
				trendData: mockTrendData(),
				averageData: mockAverageData(),
				averageData1: mockAverageData(),
				heatmapData: mockHeatmapData(),
				// stragety
				stragetyCheckList: [],
				stragetyTitle: '',
				stragety: [],
				type: 3,
				idArr: [],
			};
		},
		computed: {
			...mapGetters(['organizationTree', 'orgprogressArr', 'orgtrendArr', 'orgstructureArr1', 'orgstructureArr2',
				'orgrankArr'
			]),
			hasTree() {
				return !_.isEmpty(this.organizationTree);
			}
		},
		mounted() {
			if (!this.hasTree) {
				this.getTree();
			}
			this.initFormDataFromUrl();
			// console.log(this.orgrankArr)
		},
		watch: {
			form: {
				handler: function() {},
				deep: true
			},
			cid: function() {
				// 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
				// 暂时先在这里做
				this.getProgress();
				this.getStructure1();
				this.getStructure2();
				this.getRank();
			}
		},
		methods: {
			change() {
				this.idArr = [];
				for (let j of this.stragetyCheckList) {
					let stragetyObj = this.stragety.find(el => {

						return el.strategy == j;
					});
					this.idArr.push(stragetyObj.id);
				}
				// console.log(this.stragetyCheckList, this.idArr);
			},
			submit() {
				let data1 = JSON.parse(localStorage.data);

				this.$confirm('确认?', {
					confirmButtonText: '保存',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					const data = {
						cid: data1.cid,
						rank:this.Rank(data1.rank),
						subject: data1.subject,
						time_label: data1.time_label,
						strategies: this.idArr.join(',')
					};
					API.PostOrgStrategyLog(data).then(() => {
						this.$message({
							showClose: true,
							message: '保存成功'
						});
						// console.log(res.api_info)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消',
						duration: 1500
					});
				});

			},
			getTree() {
				const params = {
					pt: this.form.pt,
					subject: this.form.subject,
					...this.getPeriodByPt(),
					version: this.form.version
				};
				API.GetOrgTree(params).then(res => {
					this.type = res.tree.type;
					this.$store.dispatch('SaveOrgTree', res.tree);
				});
			},
			getProgress() {
				const params = {
					pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version
				};
				API.GetOrgProgress(params).then(res => {
					this.$store.dispatch('SaveOrgProgressData', res.data);
					const promises = _.map(res.data, o => this.getTrend(o.subject));
					Promise.all(promises).then(resultList => {
						_.forEach(resultList, (v, k) => {
							v.subject = res.data[k].subject;
							v.subject_name = res.data[k].subject_name;
						});

						this.$store.dispatch('SaveOrgTrendArr', resultList);
					});
				});
			},
			getTrend(subject) {
				const params = {
					cid: this.cid,
					pt: this.form.pt,
					...this.getPeriodByPt(),
					subject: subject,
					version: this.form.version
				};
				return API.GetOrgTrend(params);
			},
			//前端
			getStructure1() {
				// console.log(this.type)
				const params = {
					pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version,
					rType: 1
				};
				API.GetOrgStructure(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveOrgStructureArr1', res.data);
				});
			},
			//后端
			getStructure2() {
				// console.log(this.type)
				const params = {
					pt: this.form.pt,
					cid: this.cid,
					...this.getPeriodByPt(),
					version: this.form.version,
					rType: 2
				};
				API.GetOrgStructure(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveOrgStructureArr2', res.data);
				});
			},
			getRank() {
				const params = {
					cid: this.cid,
					pt: this.form.pt,
					version: this.form.version,
					...this.getPeriodByPt(),
				};
				API.GetOrgRank(params).then(res => {
					// console.log(res.data);
					this.$store.dispatch('SaveOrgRankArr', res.data);
				});
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
			initFormDataFromUrl() {
				const {
					pt = '月', sDate = '', eDate = '', subject = 'S', cid = '1',
				} = this.$route.query;
				let formData = {
					pt: pt,
					subject: subject,
				};
				if (moment(sDate).isValid() && moment(eDate).isValid()) {
					formData.date = [sDate, eDate];
				}
				this.cid = cid;
				this.form = { ...this.form,
					...formData
				};
			},
			handleNodeClick(data) {
				this.type = data.type;
				if (data.children != undefined) {
					this.cid = data.cid;
					this.loading = true;
					//                     setTimeout(() => {
					//                         this.pieData = mockPieData();
					//                         this.trendData = mockTrendData();
					//                         this.averageData = mockAverageData();
					//                         this.heatmapData = mockHeatmapData();
					//                     }, 300);
					setTimeout(() => {
						this.loading = false;
					}, 1000);
				}

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
			clickIndex(i, idx) {
				this[`index${i}`] = idx;
			},
			Rank(score) {
				if (score =='差') {
					return 4;
				}
				if (score == '中') {
					return 3;
				}
				if (score =='良') {
					return 2;
				}
				if (score =='优') {
					return 1;
				}
				return 4;
			},
			showStragety(data) {
				// console.log(data)
				localStorage.setItem("data", JSON.stringify(data));
				const {
					cid,
					brand,
					name,
					subject,
					time_label,
					rank
				} = data;

				// console.log(cid, brand, name, rank)
				this.stragetyTitle = `${brand} - ${name} - ${rank}`;
				const params = {
					cid: cid,
					subject: subject,
					rank: this.Rank(rank),
					time_label: time_label,
				};

				API.GetOrgStrategy(params).then(res => {
					// console.log(res.data)
					this.stragetyCheckList = [];
					this.stragety = res.data;
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].status == 1) {
							this.stragetyCheckList.push(res.data[i].strategy);
							// console.log(this.stragetyCheckList)
						}
					}
					// this.$store.dispatch('SaveRankArr', res.data);
				});

			}
		}
	};
</script>

<style lang="scss">
    @import '../Product/style/overview.scss'
</style>
