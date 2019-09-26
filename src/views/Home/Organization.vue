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
              <el-col :span="16">
                <slider
                  v-if="orgHomeArr.length>0"
                  height="295px"
                  :min-move-num="50">
                  <template v-for="(item, index) in orgHomeArr">
                    <el-col
                      v-if="orgHomeArr.length>0"
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
              <el-col :span="8">
                <radar
                  v-if="organizationRadarObj"
                  :id="'organizationRadar'"
                  :data="organizationRadarObj" />
              </el-col>
              <el-col :span="24">
                <div class="card_company_target">
                  <el-row class="margin-top-20 margin-bottom-20 align">目标-实际-差异趋势分析:
                    <span class="card_title">{{ hasSubjectName }} </span>
                    <span
                      class="card_title"
                      v-if="homeOrganization[index].subject_unit"> ( {{ homeOrganization[index].subject_unit }} )</span>
                  </el-row>
                  <template>
                    <el-col
                      v-if="orgTrendArr.length>0"
                      :key="index">
                      <ProTargetActualDiffTrend
                        :unit="homeOrganization[index].subject_unit"
                        :show-detail="false"
                        :id="`org${index}`"
                        :data="orgTrendArr[index]" />
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
import ProTargetAchievement from 'components/ProTargetAchievement';// 目标达成情况总览
import radar from './radar';
import ProTargetActualDiffTrend from 'components/ProTargetActualDiffTrend';// 目标-实际-差异趋势分析
import { dataSales } from './mock/trendData';
import { mapGetters } from 'vuex';
import { homeOrganization } from 'data/subject.js';

export default {
    components: {
        Card,
        Slider,
        SearchBar,
        ProTargetAchievement,
        radar,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            homeOrganization: homeOrganization(),
            form: {
                pt: '', // 周期类型
                search: '',
            },
            cid: '',
            dataSales: dataSales(),// mock
            loading: false,
            index: 0,
            style: undefined,
            opciatyBool: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['orgHomeArr','orgTrendArr', 'searchDate', 'homeLastParams', 'organizationRadarObj']),
        hasSubjectName() {
            if (this.orgTrendArr.length) {
                return this.orgTrendArr[this.index].subject_name;
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
        //组织
        getOrgProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
                version:0
            };
            API.GetOrgProgress(params).then(res => {
                let organizationRadarObj = {};
                organizationRadarObj.name = res.data.map(el => el.subject_name);
                organizationRadarObj.progress = res.data.map(el => el.progress);
                this.$store.dispatch('SaveOrganizationRadarObj', organizationRadarObj);
                this.$store.dispatch('SaveOrgHomeProgress', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeOrg) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeOrg = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getOrgProgress();
            const promises = _.map(this.homeOrganization, o => this.getOrgTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeOrganization[k].subject;
                    v.subject_name = this.homeOrganization[k].subject_name;
                });
                this.$store.dispatch('SaveOrgHomeTrendArr', resultList);
            });
        },
        getOrgTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject,
                version:0
            };
            return API.GetOrgTrend(params);
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
