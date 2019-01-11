<template>
  <div class="nav-content">
    <el-row
      v-if="fundTree"
      class="nav-content-row">
      <el-col
        class="overflow">
        <el-row
          v-if="hasStructure"
          v-loading="loading"
          class="margin-top-10 min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">比例结构与平均值对比分析前端</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in fundstructureArr1">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                class="border-left-2-gray">
                <ProportionalStructureAverageComparisonBig
                  id="ProportionalStructureAverageComparisonBig"
                  v-if="fundstructureArr1.length>0"
                  :data="fundstructureArr1[index3]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
        <el-row
          v-if="hasStructureBack"
          v-loading="loading"
          class="margin-top-10 min-height-400">
          <Card>
            <el-row class="margin-bottom-20">比例结构与平均值对比分析后端</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item1, index) in fundstructureArr2">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(4 ,index)">
                    <ProportionalStructureAverageComparison
                      :id="`fundstructureArr2${index}`"
                      :data="item1" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                class="border-left-2-gray">
                <ProportionalStructureAverageComparisonBig
                  v-if="fundstructureArr2"
                  id="ProportionalStructureAverageComparisonBig1"
                  :data="fundstructureArr2[index4]" />
              </el-col>
            </el-row>
          </Card>
        </el-row>
      </el-col>
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
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['fundTree', 'fundstructureArr1', 'fundstructureArr2', 'fundlastParams']),
        hasTree () {
            return !_.isEmpty(this.fundTree);
        },
        hasStructure () {
            return !_.isEmpty(this.fundstructureArr1);
        },
        hasStructureBack () {
            return !_.isEmpty(this.fundstructureArr2);
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
        clickIndex(i, idx) {
            this[`index${i}`] = idx;
        },
        structureID(data) {
            this.cid = data;
            this.nodeArr = [];
            this.nodeArr.push(this.cid);
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.cid); // tree元素的ref 绑定的node-key
            });
            this.isbac = false;
            this.highlight = true;
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getStructure1();
            this.getStructure2();
            this.$store.dispatch("SaveFundLastParams", this.newParams);
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
            if (JSON.stringify(this.fundlastParams.structure) == JSON.stringify(params)) {
                return;
            }
            API.GetFundStructure(params).then(res => {
                this.$store.dispatch('SaveFundStructureArr1', res.data);
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
            this.newParams.structure = params;
            if (JSON.stringify(this.fundlastParams.structure) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetFundStructure(params).then(res => {
                this.$store.dispatch('SaveFundStructureArr2', res.data);
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
