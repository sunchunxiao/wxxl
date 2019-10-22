<template>
  <div class="nav-content">
    <el-row
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="fundCostObj">
            <el-col
              :span="24">
              <Budget
                v-if="fundCostObj"
                :id="'fundReachRadar'"
                :data="fundCostObj" />
            </el-col>
          </Card>
        </el-row>
      </div>
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';
import Budget from '../FundBudget';
import { mapGetters } from 'vuex';

export default {
    name: "BudgetWrap",
    props: {
        cid: String,
        date: Object,
        val: Object
    },
    components: {
        Card,
        Budget,
    },
    data () {
        return {
            version: 0,
            pt: '',
            loading: false,
            newParams: {},
            sliderKey: ""
        };
    },
    computed: {
        ...mapGetters(['fundCostObj','fundTree', 'fundlastParams', 'fundReachRadarObj']),
        hasTree () {
            return !_.isEmpty(this.fundTree);
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
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getCost();
            this.$store.dispatch("SaveFundLastParams", this.newParams);
        },
        //目标达成
        getCost() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version
            };
            this.newParams.budget = params;
            if (JSON.stringify(this.fundlastParams.budget) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetFundCost(params).then(res => {
                this.$store.dispatch('SaveFundCost', res.data);
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
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
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
        clickIndex(i, idx) {
            this[`index${i}`] = idx;
        },
    }
};
</script>

<style lang="scss">
@import '../../Product/style/overview.scss';
</style>
