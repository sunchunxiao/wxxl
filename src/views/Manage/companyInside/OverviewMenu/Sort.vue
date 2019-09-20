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
            <el-row class="margin-bottom-20 overview_title">整体绩效排序分析</el-row>
            <el-row
              style="justify-content:space-around"
              type="flex">
              <el-col
                :span="10"
                class="">
                <el-row
                  style="text-align:center;font-size:14px"
                  class="margin-bottom-20 overview_title">{{ name }}绩效排序</el-row>
                <SortStructure
                  v-if="orgsortArr.bro"
                  @id="structureID"
                  id="SortStructure1"
                  :data="orgsortArr.bro" />
              </el-col>
              <span class="span_split"><img
                src="../../../../assets/resizeApi.png"
                alt=""></span>
              <el-col
                :span="10"
                class="">
                <el-row
                  style="text-align:center;font-size:14px"
                  class="margin-bottom-20 overview_title">部门绩效排序</el-row>
                <SortStructure
                  v-if="orgsortArr.son"
                  @id="structureID"
                  id="SortStructure"
                  :data="orgsortArr.son" />
              </el-col>
            </el-row>
            <!-- <el-row
              v-if="!loading && !orgsortArr.length"
              class="overview_select">
              暂无数据
            </el-row> -->
          </Card>
        </el-row>
      </div>
    </el-row>
  </div>
</template>

<script>
import API from '../api';
import Card from 'components/Card';

// 比例结构与平均值对比分析
import SortStructure from 'components/SortStructure';
//vuex
import { mapGetters } from 'vuex';
import { organization } from 'data/subject';

export default {
    props: {
        cid: String,
        name:String,
        val: Object
    },
    components: {
        Card,
        SortStructure,
    },
    data () {
        return {
            version: 0,
            form: {
                pt: '', // 周期类型
                date: [], // date
                search: '', // 暂时没有接口 先这样
            },
            //index
            index3: 0,
            pt: '',
            loading: false,
            changeDate: {},
            newParams: {},
            organizationSubject: organization()
        };
    },
    computed: {
        ...mapGetters(['organizationTree','orgsortArr', 'orgstructureArr1', 'orgstructureArr2', 'managelastParams']),
        hasStructure () {
            return !_.isEmpty(this.orgsortArr);
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
        },
    },
    mounted(){
    },
    methods: {
        clickIndex(i, idx) {
            this[`index${i}`] = idx;
        },
        structureID(data) {
            this.$emit('changeCid', data);
        },
        allRequest() {
            if (!this.cid) {
                return;
            }
            this.getSort();
            this.$store.dispatch("SaveManageLastParams", this.newParams);
        },
        //前端
        getSort() {
            const params = {
                cid: this.cid,
                pt: this.getPt(),
                ...this.getPeriodByPt(),
                version: this.version,
                rType: 1
            };
            this.newParams.structure = params;
            if (JSON.stringify(this.managelastParams.structure) == JSON.stringify(params)) {
                return;
            }
            this.loading = true;
            API.GetOrgStructure(params).then(res => {
                this.$store.dispatch('SaveOrgSort', res.data);
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
                // pt,
                sDate,
                eDate
            } = this.getDateObj();
            if (sDate && eDate) { // 计算时间周期
                return {
                    // pt: pt,
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
    }
};
</script>

<style lang="scss">
.span_split{
    display: flex;
    align-items: center;
    // font-size: 50px;
    img{
        width: 50%
    }
}
@import '../../../Product/style/overview.scss';
</style>
