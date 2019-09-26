<template>
  <div class="container">
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
                v-if="channelArr.length>0"
                height="295px"
                :min-move-num="50">
                <template v-for="(item, index) in channelArr">
                  <el-col
                    v-if="channelArr.length>0"
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
                v-if="channelRadarObj"
                :id="'channelRadar'"
                :data="channelRadarObj" />
            </el-col>
            <el-col :span="24">
              <div class="card_company_target">
                <el-row class="margin-top-20 margin-bottom-20 align">目标-实际-差异趋势分析:
                  <span class="card_title">{{ hasSubjectName }}</span>
                  <span
                    class="card_title"
                    v-if="homeChannel[index].subject_unit"> ( {{ homeChannel[index].subject_unit }} )</span>
                </el-row>
                <template>
                  <el-col
                    v-if="channelTrendArr.length>0"
                    :key="index">
                    <ProTargetActualDiffTrend
                      :unit="homeChannel[index].subject_unit"
                      :show-detail="false"
                      :id="`channel${index}`"
                      :data="channelTrendArr[index]" />
                  </el-col>
                </template>
              </div>
            </el-col>
          </el-row>
        </Card>
      </el-col>
    </el-row>
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
import { homeChannel } from 'data/subject.js';

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
            homeChannel: homeChannel(),
            form: {
                pt: '', // 周期类型
                search: '',
            },
            cid: '',
            dataSales: dataSales(),// mock
            loading: false,
            index: 0,
            post: 1,
            style: undefined,
            opciatyBool: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['channelArr', 'channelTrendArr', 'searchDate','homeLastParams','channelRadarObj']),
        hasSubjectName() {
            if (this.channelTrendArr.length) {
                return this.channelTrendArr[this.index].subject_name;
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
        //渠道
        getChannelProgress() {
            const params = {
                ...this.getPeriodByPt(),
            };
            this.loading = true;
            API.GetChannelProgress(params).then(res => {
                res.data.map(i=>{i.divide=1;});
                let channelRadarObj = {};
                channelRadarObj.name = res.data.map(el => el.subject_name);
                channelRadarObj.progress = res.data.map(el => el.progress);
                this.$store.dispatch('SaveChannelRadarObj', channelRadarObj);
                this.$store.dispatch('SaveChannelProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.channel) == JSON.stringify(params)) {
                return;
            }
            this.newParams.channel = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getChannelProgress();
            const promises = _.map(this.homeChannel, o => this.getChannelTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeChannel[k].subject;
                    v.subject_name = this.homeChannel[k].subject_name;
                });
                this.$store.dispatch('SaveChannelTrendArr', resultList);
            });
        },
        getChannelTrend(subject) {
            const params = {
                ...this.getPeriodByPt(),
                subject: subject
            };
            return API.GetChannelTrend(params);
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
