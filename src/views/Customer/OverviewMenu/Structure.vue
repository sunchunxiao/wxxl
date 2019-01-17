<template>
  <div class="nav-content">
    <el-row
      v-if="customerTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">比例结构与平均值对比分析</el-row>
            <el-row
              v-if="cusstructureArr.length"
              type="flex">
              <el-col :span="16">
                <template v-for="(item, index) in cusstructureArr">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      :id="`${index}`"
                      :unit="getUnit(item)"
                      :data="sliceData(item)" />
                  </el-col>
                </template>
              </el-col>
              <el-col
                :span="8"
                class="border-left-2-gray">
                <ProportionalStructureAverageComparisonBig
                  @id="structureID"
                  id="ProportionalStructureAverageComparisonBig"
                  :unit="getUnit(cusstructureArr[index3])"
                  :data="cusstructureArr[index3]" />
              </el-col>
            </el-row>
            <el-row
              v-if="!loading && !cusstructureArr.length"
              class="overview_select">
              暂无数据
            </el-row>
          </Card>
        </el-row>
      </div>
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
//data 指标
import { customer } from 'data/subject';

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
            newParams: {},
            customerSubject: customer(),
        };
    },
    computed: {
        ...mapGetters(['customerTree', 'cusstructureArr','cusLastParams']),
        hasTree () {
            return !_.isEmpty(this.customerTree);
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
        getUnit(item) {
            let obj = this.customerSubject.find(el => {
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
            this.getStructure();
            this.$store.dispatch("SaveCustLastParams", this.newParams);
        },
        getStructure() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            this.newParams.structure = params;
            if (JSON.stringify(this.cusLastParams.structure) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetCusStructure(params).then(res => {
                this.$store.dispatch('SaveCusStructureArr', res.data);
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
