<template>
  <div class="nav-content">
    <el-row
      v-if="supplyTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">智能评选和智能策略</el-row>
            <span>(*号为有策略)</span>
            <el-row v-if="supplyRankArr.length">
              <el-col :span="14">
                <IntelligentSelection
                  id="rank"
                  @changeTime="changeTime"
                  @showStragety="showStragety"
                  :data="supplyRankArr" />
              </el-col>
              <el-col :span="10">
                <div class="stragety">
                  <div class="stragety-title">智能策略</div>
                  <div
                    class="stragety-box">
                    <div class="margin-bottom-10">{{ stragetyTitle }}</div>
                    <el-checkbox-group
                      v-if="stragety.length"
                      v-model="stragetyCheckList">
                      <el-checkbox
                        v-for="(item,index) in stragety"
                        :key="index"
                        :label="item.id"
                        @change="change">{{ item.strategy }}</el-checkbox>
                    </el-checkbox-group>
                    <el-row
                      class="stragety-box-data">
                      {{ stragetyMessage }}
                    </el-row>
                    <el-button
                      @click="submit"
                      type="primary"
                      class="center">确 认</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row
              v-else
              class="overview_select">
              暂无数据
            </el-row>
          </Card>
        </el-row>
      </div>
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';
// 智能评选和智能策略
import IntelligentSelection from 'components/IntelligentSelection';

//vuex
import { mapGetters } from 'vuex';

export default {
    props: {
        cid: String,
        val: Object
    },
    components: {
        Card,
        IntelligentSelection,
    },
    data () {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            //tree
            pt: '',
            loading: false,
            // stragety
            stragetyCheckList: [],
            stragetyTitle: '',
            stragety: [],
            stragetyMessage: '',
            idArr: [],
            post: 1,
            changeDate: {},
            newParams: {},
        };
    },
    computed: {
        ...mapGetters(['supplyTree', 'supplyRankArr','supplyLastParams']),
        hasTree () {
            return !_.isEmpty(this.supplyTree);
        },
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
        change() {
            this.idArr = [];
            for (let i of this.stragetyCheckList) {
                let stragetyObj = this.stragety.find(el => {
                    return el.id == i;
                });
                this.idArr.push(stragetyObj.id);
            }
        },
        submit() {
            let data1 = JSON.parse(localStorage.data);
            if (this.stragety.length) {
                this.$confirm('确认?', {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    const data = {
                        cid: data1.cid,
                        subject: data1.subject,
                        time_label: data1.time_label,
                        strategies: this.idArr.join(',')
                    };
                    API.PostSupplySave(data).then(() => {
                        this.$message({
                            showClose: true,
                            message: '保存成功'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                        duration: 1500
                    });
                });
            } else {
                this.error('无应用策略');
            }
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getRank();
            this.$store.dispatch("SaveSupplyLastParams", this.newParams);
        },
        getRank() {
            if (this.getPt() === '日') {
                this.pt = '周';
            } else {
                this.pt = this.getPt();
            }
            const params = {
                cid: this.cid,
                pt: this.pt,
                ...this.getPeriodByPt(),
            };
            this.newParams.rank = params;
            if (JSON.stringify(this.supplyLastParams.rank) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetSupplyRank(params).then(res => {
                this.$store.dispatch('SaveSupplyRankArr', res.data);
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
                    pt: '周',
                    sDate: '2018-01-01',
                    eDate: '2018-01-31',
                    // 先写死个时间
                    // sDate: moment().startOf('week').format('YYYY-MM-DD'),
                    // eDate: moment().format('YYYY-MM-DD'),
                };
            }
        },
        changeTime() {
            this.stragetyTitle = '';
            this.stragety = [];
        },
        showStragety(data) {
            localStorage.setItem("data", JSON.stringify(data));
            const {
                cid,
                brand,
                name,
                subject,
                time_label,
                rank
            } = data;
            this.stragetyTitle = `${brand} - ${name} - ${rank}`;
            const params = {
                cid: cid,
                subject: subject,
                // rank: rank,
                time_label: time_label,
            };
            if (this.showStragetyId === cid && this.subject === subject) {
                return;
            }
            this.showStragetyId = cid;
            this.subject = subject;
            this.stragety = [];
            this.stragetyMessage = '';
            API.GetSupplyMatch(params).then(res => {
                this.stragetyCheckList = [];
                this.idArr = [];
                this.stragety = res.data;
                if (!res.data.length) {
                    this.stragetyMessage = '暂无数据';
                }
                const checked = 1;//1是选中,0是不选中
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].is_selected === checked) {
                        this.stragetyCheckList.push(res.data[i].id);
                        this.idArr.push(res.data[i].id);
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
@import '../../Product/style/overview.scss';
</style>
