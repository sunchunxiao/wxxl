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
            <el-row v-if="cusHomeArr.length>0">
              <el-row
                v-loading="loading">
                <Card>
                  <el-row>
                    <el-col>
                      <template v-for="(item, index) in cusHomeArr">
                        <el-col
                          v-if="cusHomeArr.length>0"
                          :key="index"
                          :span="4">
                          <ProTargetAchievement
                            :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                            @click.native="clickIndex(index)"
                            :id="`${index}`"
                            :data="item" />
                        </el-col>
                      </template>
                    </el-col>
                  </el-row>
                </Card>
              </el-row>
            </el-row>
            <el-row
              style="margin-left:100px">
              <Card>
                <div class="card_company_target">
                  <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
                  <span class="card_title">{{ hasSubjectName }} ( 万元 ) </span></el-row>
                  <template>
                    <el-col
                      v-if="cusHomeTrendArr.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :id="`customer${index}`"
                        :data="cusHomeTrendArr[index]" />
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
    },
    data() {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            cid: '',
            // mock
            dataSales: dataSales(),
            loading: false,
            //index
            index: 0,
            // stragety
            val: {},
            post: 1,
            style: undefined,
            opciatyBool: false
        };
    },
    computed: {
        ...mapGetters(['cusHomeArr', 'cusHomeTrendArr', 'searchDate']),
        hasSubjectName() {
            if (this.cusHomeTrendArr.length) {
                return this.cusHomeTrendArr[this.index].subject_name;
            }
        }
    },
    created() {
        this.form.date = this.searchDate;
    },
    mounted() {
        this.getCusProgress();
    },
    watch: {
        searchDate() {
            this.val = this.searchDate;
        },
        val() {
            this.getCusProgress();
        }
    },
    methods: {
        clickIndex(idx) {
            this.index = idx;
            this.style = idx;
            this.opciatyBool = true;
        },
        input(val) {
            this.form.date = val;
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
            API.GetCusProgress(params).then(res=>{
                this.$store.dispatch('SaveCusHomeProgress', res.data);
                const promises = _.map(res.data, o => this.getCusTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveCusHomeTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
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
