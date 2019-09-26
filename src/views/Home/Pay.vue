<template>
  <div class="container">
    <div>
      <el-row>
        <el-col
          :span="24"
          class="home_overflow common">
          <Card
            v-loading="loading"
            id="pay"
            class="min-height-400">
            <el-row>
              <el-col :span="16">
                <slider
                  v-if="payPrograssArr.length>0"
                  height="296px"
                  :min-move-num="50">
                  <template v-for="(item, index) in payPrograssArr">
                    <el-col
                      v-if="payPrograssArr.length>0"
                      :key="index"
                      style="width:198px">
                      <ProTargetAchievement
                        :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                        @click.native="clickIndex(index)"
                        :id="`${index}`"
                        :data="item" />
                    </el-col>
                  </template>
                </slider>
              </el-col>
              <el-col
                :gutter="10"
                :span="8">
                <radar
                  v-if="payRadarObj.name"
                  :id="'payRadar'"
                  :data="payRadarObj" />
              </el-col>
              <el-col :span="24">
                <div class="card_company_target">
                  <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
                    <span class="card_title">{{ hasSubjectName }}</span>
                    <!-- 单位 -->
                    <span
                      class="card_title"
                      v-if="homePay[index].subject_unit"> ( {{ homePay[index].subject_unit }} )</span>
                  </el-row>
                  <template>
                    <el-col
                      v-if="payTrendArr.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :unit="homePay[index].subject_unit"
                        :show-detail="false"
                        :id="`product${index}`"
                        :data="payTrendArr[index]" />
                    </el-col>
                  </template>
                </div>
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
import Slider from 'components/Slider';
// 目标达成情况总览
import ProTargetAchievement from 'components/ProTargetAchievement';
// 目标-实际-差异趋势分析
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';
import radar from './radar';
//vuex
import { mapGetters } from 'vuex';
//data
import { homePay } from 'data/subject.js';

export default {
    components: {
        Card,
        Slider,
        radar,
        SearchBar,
        ProTargetAchievement,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            homePay: homePay(),
            form: {
                pt: '', // 周期类型
                search: '', // 暂时没有接口 先这样
            },
            cid: '',
            loading: false,
            //index
            index: 0,
            style: undefined,
            opciatyBool: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['payPrograssArr', 'payTrendArr', 'searchDate', 'homeLastParams','payRadarObj']),
        hasSubjectName() {
            return this.homePay[this.index].subject_name;
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
        //支付能力
        getPayProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version: 0
            };
            API.GetPayProgress(params).then(res => {
                res.data.map(i=>{i.divide=1;});
                let obj = {};
                obj.name = res.data.map(el=>el.subject_name);
                obj.progress = res.data.map(el=>el.progress);
                // obj.target = res.data.map(el=>el.target);
                this.$store.dispatch('SavePayRadar', obj);
                this.$store.dispatch('SavePayProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homePay) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homePay = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getPayProgress();
            const promises = _.map(this.homePay, o => this.getProductTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homePay[k].subject;
                    v.subject_name = this.homePay[k].subject_name;
                });
                this.$store.dispatch('SavePayTrendArr', resultList);
            });
        },
        getProductTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version: 0
            };
            return API.GetPayTrend(params);
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
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
