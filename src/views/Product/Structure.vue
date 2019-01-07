<template>
  <div class="nav-content">
    <el-row
      v-if="productTree"
      class="nav-content-row"
      :gutter="20">
      <el-col
        :span="17"
        class="overflow">
        <el-row
          v-loading="loading"
          class="">
          <Card>
            <el-row class="margin-bottom-20">比例结构与平均值对比分析</el-row>
            <el-row>
              <el-col :span="16">
                <template v-for="(item, index) in structureArr">
                  <el-col
                    :key="index"
                    :span="6"
                    @click.native="clickIndex(3 ,index)">
                    <ProportionalStructureAverageComparison
                      v-if="structureArr.length"
                      @id="structureID"
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
import API from './api';
import Card from 'components/Card';

// 比例结构与平均值对比分析
import ProportionalStructureAverageComparison from 'components/ProportionalStructureAverageComparison';
import ProportionalStructureAverageComparisonBig from 'components/ProportionalStructureAverageComparisonBig';
//vuex
import { mapGetters } from 'vuex';
export default {
    props: {
        cid: String,
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
            val: {},
            changeDate: {},
        };
    },
    computed: {
        ...mapGetters(['productTree', 'structureArr']),
        hasTree () {
            return !_.isEmpty(this.productTree);
        },
    },
    mounted () {
        // console.log(this.$store.state.product.tree1)
        //获取初始时间
        this.changeDate = this.searchBarValue;
        this.getStructure();
    },
    watch: {
        cid() {
            // 点击左侧树节点时, 请求右侧数据 看下是在点击树节点的时候做还是在这里做
            this.allRequest();
        }
    },
    methods: {
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
            this.getStructure();
        },
        getStructure() {
            this.loading = true;
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            API.GetProductStructure(params).then(res => {
                this.$store.dispatch('SaveStructureArr', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        getPt() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                this.pt = this.val.pt;
            }else{
                this.pt = date.pt;
            }
            return this.pt;
        },
        getDateObj() {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                return {
                    sDate: this.val.sDate,
                    eDate: this.val.eDate,
                };
            } else {
                return {
                    sDate: date.sDate,
                    eDate: date.eDate,
                };
            }
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
@import './style/overview.scss';
</style>
