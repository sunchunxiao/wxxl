<template>
  <div class="nav-content">
    <el-row
      v-if="supplyTree"
      class="nav-content-row">
      <el-row
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card v-if="supplyProgressArr.length">
            <el-row class="margin-bottom-20 overview_title">目标达成情况总览</el-row>
            <el-col :span="13">
              <template v-for="(item, index) in supplyProgressArr">
                <el-col
                  :key="index"
                  style="width:198px">
                  <ProTargetAchievement
                    :id="`${index}`"
                    @click.native="clickIndex(item,index)"
                    :data="item" />
                </el-col>
              </template>
            </el-col>
            <el-col
              :span="11">
              综合评估
              <radar
                v-if="supplyReachRadarObj"
                :id="'supplyReachRadar'"
                :data="supplyReachRadarObj" />
            </el-col>
          </Card>
        </el-row>
      </el-row>
    </el-row>
    <el-row
      v-else
      class="overview_select">
      暂无数据
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';
import ProTargetAchievement from 'components/ProTargetAchievementCS';// 目标达成情况总览
import radar from '../../Home/radar';
import { mapGetters } from 'vuex';

export default {
    name: "RadarWrap",
    props: {
        cid: String,
        date: Object,
        val: Object
    },
    components: {
        Card,
        radar,
        ProTargetAchievement,
    },
    data () {
        return {
            form: {
                pt: '', // 周期类型
                date: [],
                search: '',
            },
            pt: '',
            loading: false,
            newParams: {}
        };
    },
    computed: {
        ...mapGetters(['supplyTree', 'supplyProgressArr', 'supplyLastParams', 'supplyReachRadarObj']),
        hasTree () {
            return !_.isEmpty(this.supplyTree);
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
        clickIndex(item){
            const params = {
                subject: item.subject,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                cid: this.cid
            };
            //接口
            API.GetSupplyPoor(params).then(res => {
                let obj = {};
                obj.cid = String(res.data.worst),
                obj.arr = res.data.poor;
                if (obj.cid != 'null') {
                    this.$emit('hightArr', obj);
                }
            });
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getProgress();
            this.$store.dispatch("SaveSupplyLastParams", this.newParams);
        },
        //目标达成
        getProgress() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
            };
            this.newParams.progress = params;
            if (JSON.stringify(this.supplyLastParams.progress) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetSupplyProgress(params).then(res => {
                let supplyReachRadarObj = {};
                supplyReachRadarObj.name = res.data.map(el => el.subject_name);
                supplyReachRadarObj.progress = res.data.map(el => el.progress);
                supplyReachRadarObj.subject = res.data.map(el => el.subject);
                this.$store.dispatch('SaveSupplyReachRadar', supplyReachRadarObj);
                this.$store.dispatch('SaveSupplyProgressData', res.data);
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
        // clickIndex(i, idx) {
        //     this[`index${i}`] = idx;
        // },
    }
};
</script>

<style lang="scss">
@import '../../Product/style/overview.scss';
</style>
