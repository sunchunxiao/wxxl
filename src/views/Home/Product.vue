<template>
  <div class="container">
    <div>
      <el-row
        :gutter="20">
        <el-col
          :span="25"
          class="home_overflow common">
          <el-row
            id="produce"
            class="">
            <el-row
              v-loading="loading"
              v-if="productArr.length>0">
              <Card>
                <slider
                  height="296px"
                  :min-move-num="50">
                  <template v-for="(item, index) in productArr">
                    <el-col
                      v-if="productArr.length>0"
                      :key="index"
                      style="width:198px">
                      <ProTargetAchievement
                        :id="`${index}`"
                        :data="item" />
                    </el-col>
                  </template>
                </slider>
              </Card>
            </el-row>
            <el-row
              style="margin-left:100px">
              <Card>
                <div class="card_company_target">
                  <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
                  <span class="card_title">销售额 ( 万元 ) </span></el-row>
                  <template v-for="(item, index) in dataSales">
                    <el-col
                      v-if="dataSales.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :id="`product${index}`"
                        :data="item" />
                    </el-col>
                  </template>
                </div>
              </Card>
            </el-row>
            <!-- <el-row
              v-else
              class="home_select">
              加载中
            </el-row> -->
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import Slider from 'components/Slider';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
//mock
import { dataSales } from './mock/trendData';
import { mapGetters } from 'vuex';

export default {
    components: {
        Card,
        SearchBar,
        ProTargetAchievement,
        ProTargetActualDiffTrend,
        Slider
    },
    data() {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            // mock
            dataSales: dataSales(),
            cid: '',
            loading: false,
            //index
            index0: 0,
            index1: 0,
            index2: 0,
            index3: 0,
            // stragety
            val: {},
            post: 1,
            style: 0,

        };
    },
    computed: {
        ...mapGetters(['productArr','productTrendArr']),
        hasTree() {
            return !_.isEmpty(this.productArr);
        }
    },
    mounted() {
        this.allRequest();
    },
    watch: {
        val() {
            this.allRequest();
        }
    },
    methods: {
        allRequest() {
            this.getProductProgress();
        },
        input(val) {
            this.form.date = val;
        },
        select(index) {
            this.style = index;
        },
        //产品
        getProductProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetProductProgress(params).then(res => {
                this.$store.dispatch('SaveProductProgressData', res.data);
                const promises = _.map(res.data, o => this.getProductTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveProductTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
            });
        },
        getProductTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetProductTrend(params);
        },
        getDateObj () {
            const {
                date
            } = this.form;
            if (this.val.sDate && this.val.eDate) {
                return {
                    pt: this.val.pt,
                    sDate: this.val.sDate,
                    eDate: this.val.eDate,
                };
            } else {
                return {
                    pt: date.pt,
                    sDate: date.sDate,
                    eDate: date.eDate,
                };
            }
        },
        getPeriodByPt () {
            const {
                pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    pt: pt,
                    sDate: sDate,
                    eDate: eDate,
                };
            } else {
                return {
                    pt: '月',
                    sDate: '2018-01-01',
                    eDate: '2018-06-01',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        handleSearch(val) {
            // 默认公司的背景色
            this.val = val;
        },

    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
