<template>
  <div class="nav-content">
    <el-row
      v-if="channelTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">比例结构与平均值对比分析</el-row>
            <el-row
              v-if="channelStructureArr.length"
              type="flex">
              <el-col :span="16">
                <template v-for="(item, index) in channelStructureArr">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      @id="structureID"
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
                  :unit="getUnit(channelStructureArr[index3])"
                  id="ProportionalStructureAverageComparisonBig"
                  :data="channelStructureArr[index3]" />
              </el-col>
            </el-row>
            <el-row
              v-if="!loading && !channelStructureArr.length"
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
import { channel } from 'data/subject';
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
            //data
            channelSubject: channel()
        };
    },
    computed: {
        ...mapGetters(['channelTree', 'channelStructureArr', 'channelLastParams']),
        hasTree () {
            return !_.isEmpty(this.channelTree);
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
            let obj = this.channelSubject.find(el => {
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
            this.$store.dispatch("SaveChannelLastParams", this.newParams);
        },
        getStructure() {
            const params = {
                chId: this.cid,
                pt: this.getPt(),
                subject: this.form.subject,
                ...this.getPeriodByPt(),
            };
            this.newParams.structure = params;
            if (JSON.stringify(this.channelLastParams.structure) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetChannelStructure(params).then(res => {
                this.$store.dispatch('SaveChannelStructureArr', res.data);
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
