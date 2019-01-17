<template>
  <div class="container">
    <el-row>
      <el-col
        :span="24"
        class="home_overflow common">
        <Card
          v-loading="loading"
          id="produce"
          class="min-height-400">
          <slider
            v-if="productArr.length>0"
            height="296px"
            :min-move-num="50">
            <template v-for="(item, index) in productArr">
              <el-col
                v-if="productArr.length>0"
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
          <div class="card_company_target">
            <el-row class="margin-bottom-20 align">目标-实际-差异趋势分析:
              <span class="card_title">{{ hasSubjectName }}</span>
              <span
                class="card_title"
                v-if="homeProduct[index].subject_unit"> ( {{ homeProduct[index].subject_unit }} )</span>
            </el-row>
            <template>
              <el-col
                v-if="productTrendArr.length>0"
                :key="index">
                <ProTargetActualDiffTrend
                  :unit="homeProduct[index].subject_unit"
                  :show-detail="false"
                  :id="`product${index}`"
                  :data="productTrendArr[index]" />
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
import { mapGetters } from 'vuex';
//data
import { homeProduct } from 'data/subject.js';

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
            //data
            homeProduct: homeProduct(),
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            cid: '',
            loading: false,
            //index
            index: 0,
            post: 1,
            style: undefined,
            opciatyBool: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['productArr', 'productTrendArr', 'searchDate', 'homeLastParams']),
        hasSubjectName() {
            if (this.productTrendArr.length) {
                return this.productTrendArr[this.index].subject_name;
            }
        }
    },
    created(){
        this.form.date = this.searchDate;
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
        //产品
        getProductProgress() {
            const params = {
                ...this.getPeriodByPt(),
            };
            this.loading = true;
            API.GetProductProgress(params).then(res => {
                this.$store.dispatch('SaveProductProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        allRequest() {
            const params = {
                ...this.getPeriodByPt(),
            };
            if (JSON.stringify(this.homeLastParams.homeProduct) == JSON.stringify(params)) {
                return;
            }
            this.newParams.homeProduct = params;
            this.$store.dispatch("SaveHomeLastParams", this.newParams);
            this.getProductProgress();
            const promises = _.map(this.homeProduct, o => this.getProductTrend(o.subject));
            Promise.all(promises).then(resultList => {
                _.forEach(resultList, (v, k) => {
                    v.subject = this.homeProduct[k].subject;
                    v.subject_name = this.homeProduct[k].subject_name;
                });
                this.$store.dispatch('SaveProductTrendArr', resultList);
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
            if (this.searchDate.sDate && this.searchDate.eDate) {
                return {
                    pt: this.searchDate.pt,
                    sDate: this.searchDate.sDate,
                    eDate: this.searchDate.eDate,
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
    }
};
</script>

<style lang="scss">
   @import '../Product/style/overview.scss';
	@import './style/home.scss'
</style>
