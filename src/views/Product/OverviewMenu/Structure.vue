<template>
  <div class="nav-content">
    <el-row
      v-if="productTree"
      class="nav-content-row">
      <el-col
        class="overflow">
        <el-row
          v-loading="loading"
          class="">
          <Card>
            <el-row class="margin-bottom-20 overview_title">比例结构与平均值对比分析</el-row>
            <el-row type="flex">
              <el-col
                :span="16">
                <template v-for="(item, index) in structureArr">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      v-if="structureArr.length"
                      @id="structureID"
                      :id="`${index}`"
                      :data="sliceData(item)" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                class="border-left-2-gray">
                <ProportionalStructureAverageComparisonBig
                  @id="structureID"
                  v-if="structureArr.length"
                  id="ProportionalStructureAverageComparisonBig"
                  :data="structureArr[index3]" />
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
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            //index
            index3: 0,
            pt: '',
            loading: false,
            changeDate: {},
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['productTree', 'structureArr','lastParams']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        },
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
        sliceData(item) {
            let data = _.cloneDeep(item);
            let num = data["28nodes"].length - 10;
            data["28nodes"] = data["28nodes"].slice(num);
            data["nodes"] = data["nodes"].slice(num);
            data["values"] = data["values"].slice(num);
            return data;
        },
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
            this.getStructure();
            this.$store.dispatch("SaveLastParams", this.newParams);
        },
        getStructure() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            this.newParams.structure = params;
            if (JSON.stringify(this.lastParams.structure) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetProductStructure(params).then(res => {
                this.$store.dispatch('SaveStructureArr', res.data);
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
@import '../style/overview.scss';
</style>
