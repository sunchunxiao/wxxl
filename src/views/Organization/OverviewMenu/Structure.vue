<template>
  <div class="nav-content">
    <el-row
      v-if="organizationTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          v-if="hasStructure"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">比例结构与平均值对比分析前端
              <div style="display:flex;align-items:center;margin-top:20px">
                <span class="colorSpan greenSpan" /><span class="avg"> 大于平均值</span>
                <span class="colorSpan yellowSpan" /><span
                  span
                  class="avg">小于平均值且大于等于平均值的二分之一</span>
                <span class="colorSpan redSpan" /><span
                  span
                  class="avg">小于平均值的二分之一</span>
                <span
                  span
                  class="avg"
                  style="font-weight:600">(28结构颜色高亮,字体加粗)</span>
              </div>
            </el-row>
            <el-row type="flex">
              <el-col :span="16">
                <template v-for="(item, index) in orgstructureArr1">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      :unit="getUnit(item, organizationSubject)"
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                class="border-left-2-gray">
                <ProportionalStructureAverageComparisonBig
                  @id="structureID"
                  id="ProportionalStructureAverageComparisonBig"
                  v-if="orgstructureArr1.length>0"
                  :unit="getUnit(orgstructureArr1[index3], organizationSubject)"
                  :data="orgstructureArr1[index3]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row
          v-if="hasStructureBack"
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">比例结构与平均值对比分析后端
              <div style="display:flex;align-items:center;margin-top:20px">
                <span class="colorSpan greenSpan" /><span class="avg"> 大于平均值</span>
                <span class="colorSpan yellowSpan" /><span
                  span
                  class="avg">小于平均值且大于等于平均值的二分之一</span>
                <span class="colorSpan redSpan" /><span
                  span
                  class="avg">小于平均值的二分之一</span>
                <span
                  span
                  class="avg"
                  style="font-weight:600">(28结构颜色高亮,字体加粗)</span>
              </div>
            </el-row>
            <el-row
              v-if="orgstructureArr2.length"
              type="flex">
              <el-col :span="16">
                <template v-for="(item, index) in orgstructureArr2">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(4 ,index)">
                    <ProportionalStructureAverageComparison
                      :id="`orgstructureArr2${index}`"
                      :unit="getUnit(item, orgBackSubject)"
                      :data="sliceData(item)" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                class="border-left-2-gray">
                <ProportionalStructureAverageComparisonBig
                  @id="structureID"
                  v-if="orgstructureArr2"
                  :unit="getUnit(orgstructureArr2[index4], orgBackSubject)"
                  id="ProportionalStructureAverageComparisonBig1"
                  :data="orgstructureArr2[index4]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
      </div>
    </el-row>
    <el-row
      v-else
      class="overview_select">
      暂无数据
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';

// 比例结构与平均值对比分析
import ProportionalStructureAverageComparison from 'components/ProportionalStructureAverageComparison';
import ProportionalStructureAverageComparisonBig from 'components/ProportionalStructureAverageComparisonBig';
//vuex
import { mapGetters } from 'vuex';
import { organization, orgBack } from 'data/subject';

export default {
    props: {
        cid: String,
        val: Object
    },
    components: {
        Card,
        ProportionalStructureAverageComparison,
        ProportionalStructureAverageComparisonBig,
    },
    data () {
        return {
            version: 0,
            //index
            index3: 0,
            index4: 0,
            pt: '',
            loading: false,
            changeDate: {},
            newParams: {},
            organizationSubject: organization(),
            orgBackSubject: orgBack()
        };
    },
    computed: {
        ...mapGetters(['organizationTree',  'orgstructureArr1', 'orgstructureArr2', 'orglastParams']),
        hasTree () {
            return !_.isEmpty(this.organizationTree);
        },
        hasStructure () {
            return !_.isEmpty(this.orgstructureArr1);
        },
        hasStructureBack () {
            return !_.isEmpty(this.orgstructureArr2);
        }
    },
    watch: {
        cid: {
            handler () {
                this.allRequest();
            },
            immediate: true
        },
        val() {
            this.allRequest();
        }
    },
    methods: {
        getUnit(item, sujectData) {
            let obj = sujectData.find(el => {
                return el.subject == item.subject && el.subject_name == item.subject_name;
            });
            return obj ? obj.subject_unit : "";
        },
        sliceData(item) {
            let data = _.cloneDeep(item);
            let num = (data["28nodes"].length - 10) < 0 ? 0 : (data["28nodes"].length - 10);
            data["28nodes"] = data["28nodes"].slice(num);
            data["nodes"] = data["nodes"].slice(num);
            data["values"] = data["values"].slice(num);
            return data;
        },
        clickIndex(i, idx) {
            this[`index${i}`] = idx;
        },
        structureID(data) {
            this.$emit('changeCid', data);
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getStructure1();
            this.getStructure2();
            this.$store.dispatch("SaveOrgLastParams", this.newParams);
        },
        //前端
        getStructure1() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version,
                rType: 1
            };
            this.newParams.structure = params;
            if (JSON.stringify(this.orglastParams.structure) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetOrgStructure(params).then(res => {
                this.$store.dispatch('SaveOrgStructureArr1', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //后端
        getStructure2() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version,
                rType: 2
            };
            // this.newParams.structure = params;
            // if (JSON.stringify(this.orglastParams.structure) == JSON.stringify(params)) {
            //     return;
            // }
            this.loading = true;
            API.GetOrgStructure(params).then(res => {
                this.$store.dispatch('SaveOrgStructureArr2', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        getPt() {
            if (this.val.sDate && this.val.eDate) {
                this.pt = this.val.pt;
            }
            return this.pt;
        },
        getDateObj() {
            return {
                sDate: this.val.sDate,
                eDate: this.val.eDate,
            };
        },
        getPeriodByPt() {
            const {
                // pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    // pt: pt,
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
    }
};
</script>

<style lang="scss">
@import '../../Product/style/overview.scss';
</style>
