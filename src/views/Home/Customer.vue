<template>
  <div class="container">
    <div>
      <el-row>
        <el-col
          :span="24"
          class="home_overflow common">
          <Card
            v-loading="loading"
            class="min-height-400">
            <el-row>
              <el-col
                :span="24"
                v-if="cusHomeArr.length>0">
                <template v-for="(item, index) in cusHomeArr">
                  <el-col
                    v-if="cusHomeArr.length>0"
                    :key="index"
                    style="width:180px">
                    <ProTargetAchievement
                      :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                      @click.native="clickIndex(index)"
                      :id="`${index}`"
                      :data="item" />
                  </el-col>
                </template>
              </el-col>
              <el-col :span="14">
                <div class="card_company_target">
                  <el-row class="margin-top-20 margin-bottom-20 align">目标-实际-差异趋势分析:
                    <span class="card_title">{{ hasSubjectName }}</span><span
                      class="card_title"
                      v-if="homeCustomer[index].subject_unit"> ( {{ homeCustomer[index].subject_unit }} )</span>
                  </el-row>
                  <template>
                    <el-col
                      v-if="cusHomeTrendArr.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :unit="homeCustomer[index].subject_unit"
                        :show-detail="false"
                        :id="`customer${index}`"
                        :data="cusHomeTrendArr[index]" />
                    </el-col>
                  </template>
                </div>
              </el-col>
              <el-col
                class="margin-top-50"
                :span="10">
                <div
                  class="tip"
                  v-show="false">
                  <span class="colorSpan positive" />
                  <span class="content"> 正向指标达成率(x)</span>
                  <span class="colorSpan negative" />
                  <span class="content"> 反向指标达成率(2-x)</span>
                </div>
                <radar
                  v-if="customerRadarObj"
                  :id="'customerRadar'"
                  :data="customerRadarObj" />
              </el-col>
            </el-row>
          </Card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import API from './api';
import Card from 'components/Card';
import SearchBar from 'components/SearchBar';
import ProTargetAchievement from 'components/ProTargetAchievement';// 目标达成情况总览
import radar from './radar';
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';// 目标-实际-差异趋势分析
import { dataSales } from './mock/trendData';
import { mapGetters } from 'vuex';
import { homeCustomer } from 'data/subject.js';

export default {
    components: {
        Card,
        SearchBar,
        ProTargetAchievement,
        radar,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            homeCustomer: homeCustomer(),
            form: {
                pt: '', // 周期类型
                search: '',
            },
            cid: '',
            dataSales: dataSales(), // mock
            loading: false,
            index: 0,
            post: 1,
            style: undefined,
            opciatyBool: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['cusHomeArr', 'cusHomeTrendArr', 'searchDate', 'homeLastParams' ,'customerRadarObj']),
        hasSubjectName() {
            if (this.cusHomeTrendArr.length) {
                return this.cusHomeTrendArr[this.index].subject_name;
            }
        }
    },
    mounted() {
        if (Object.keys(this.searchDate).length) {
            this.allRequest();
        }
    },
    watch: {
        searchDate() {
            this.allRequest();
        }
    },
    methods: {
        clickIndex(idx) {
            this.index = idx;
            this.style = idx;
            this.opciatyBool = true;
        },
        select(index) {
            this.style = index;
        },
        //客户
        getCusProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetCusProgress(params).then(res => {
                let customerRadarObj = {};
                customerRadarObj.name = res.data.map(el => el.subject_name);
                customerRadarObj.progress = res.data.map(el => el.progress);
                customerRadarObj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveCustomerRadarObj', customerRadarObj);
                this.$store.dispatch('SaveCusHomeProgress', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeCustomer) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeCustomer = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getCusProgress();
            const promises = _.map(this.homeCustomer, o => this.getCusTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeCustomer[k].subject;
                    v.subject_name = this.homeCustomer[k].subject_name;
                });
                this.$store.dispatch('SaveCusHomeTrendArr', resultList);
            });
        },
        getCusTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetCusTrend(params);
        },
        getDateObj () {
            if (this.searchDate.sDate && this.searchDate.eDate) {
                return {
                    pt: this.searchDate.pt,
                    sDate: this.searchDate.sDate,
                    eDate: this.searchDate.eDate,
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
                };
            }
        },
    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
