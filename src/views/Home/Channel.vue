<template>
  <div class="container">
    <el-row>
      <el-col
        :span="24"
        class="home_overflow common">
        <Card
          v-loading="loading"
          id="channel"
          class="min-height-400">
          <slider
            v-if="channelArr.length>0"
            height="296px"
            :min-move-num="50">
            <template v-for="(item, index) in channelArr">
              <el-col
                v-if="channelArr.length>0"
                :key="index"
                :span="4">
                <ProTargetAchievement
                  :class="{'menu_list_opciaty':style==index, 'menu_list_opciatyAll':opciatyBool}"
                  @click.native="clickIndex(index)"
                  :id="`${index}`"
                  :data="item" />
              </el-col>
            </template>
          </slider>
          <div class="card_company_target">
            <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
            <span class="card_title">{{ hasSubjectName }} ( 万元 ) </span></el-row>
            <template>
              <el-col
                v-if="channelTrendArr.length>0"
                :key="index">
                <ProTargetActualDiffTrend
                  :show-detail="false"
                  :id="`channel${index}`"
                  :data="channelTrendArr[index]" />
              </el-col>
            </template>
          </div>
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
        Slider,
        SearchBar,
        ProTargetAchievement,
        ProTargetActualDiffTrend,
    },
    data() {
        return {
            form: {
                pt: '', // 周期类型
                date: {}, // date
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
        ...mapGetters(['channelArr', 'channelTrendArr', 'searchDate']),
        hasSubjectName() {
            if (this.channelTrendArr.length) {
                return this.channelTrendArr[this.index].subject_name;
            }
        }
    },
    created() {
        this.form.date = this.searchDate;
    },
    mounted() {
        this.getChannelProgress();
    },
    watch: {
        searchDate() {
            this.val = this.searchDate;
        },
        val() {
            this.getChannelProgress();
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
        //渠道
        getChannelProgress() {
            this.loading = true;
            const params = {
                ...this.getPeriodByPt(),
            };
            API.GetChannelProgress(params).then(res=>{
                this.$store.dispatch('SaveChannelProgressData', res.data);
                const promises = _.map(res.data, o => this.getChannelTrend(o.subject));
                Promise.all(promises).then(resultList => {
                    _.forEach(resultList, (v, k) => {
                        v.subject = res.data[k].subject;
                        v.subject_name = res.data[k].subject_name;
                    });
                    this.$store.dispatch('SaveChannelTrendArr', resultList);
                });
            }).finally(() => {
                this.loading = false;
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
