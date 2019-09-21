<template>
  <div class="nav-content">
    <el-row
      v-if="organizationTree"
      class="nav-content-row">
      <div
        class="overflow">
        <el-row
          v-loading="loading"
          class="min-height-400">
          <Card>
            <el-row class="margin-bottom-20 overview_title">整体绩效预警分析</el-row>
            <el-row v-if="orgrankArr.length ">
              <!-- <el-col :span="14"> -->
              <WarningAnalysis
                id="rank"
                :pos="orgPosArr"
                @changeTime="changeTime"
                @showStragety="showStragety"
                :data="orgrankArr" />
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
import WarningAnalysis from '../WarningAnalysis';

//vuex
import { mapGetters } from 'vuex';

export default {
    props: {
        cid: String,
        is_parent:Array,
        val: Object
    },
    components: {
        Card,
        WarningAnalysis,
    },
    data () {
        return {
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            version: 0,
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
            aa:[]
        };
    },
    computed: {
        ...mapGetters(['organizationTree','orgPosArr', 'orgrankArr','managelastParams']),
        hasTree () {
            return !_.isEmpty(this.organizationTree);
        },
    },
    watch: {
        is_parent:{
            handler () {
                this.allRequest();
            },
            immediate: true
        },
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
    mounted(){
        // console.log(111,this.orgPosArr);
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
                        strategies: this.idArr.join(','),
                    };
                    API.PostOrgStrategyLog(data).then(() => {
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
            this.$store.dispatch("SaveManageLastParams", this.newParams);
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
                version:this.version,
            };
            this.newParams.rank = params;
            if (JSON.stringify(this.managelastParams.rank) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetOrgRank(params).then(res => {
                // console.log(111,res.data[0].loc);
                if (res.data[0].loc.length) {
                    this.$store.dispatch('SaveOrgPosArr', res.data[0].loc);
                }else{
                    this.$store.dispatch('SaveOrgPosArr', []);
                }
                this.$store.dispatch('SaveOrgRankArr', res.data);
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
                rank: rank,
                time_label: time_label,
            };
            if (this.showStragetyId === cid && this.subject === subject) {
                return;
            }
            this.showStragetyId = cid;
            this.subject = subject;
            this.stragety = [];
            this.stragetyMessage = '';
            API.GetOrgStrategy(params).then(res => {
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
@import '../../../Product/style/overview.scss';
</style>
