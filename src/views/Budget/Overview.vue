<template>
  <div class="budget">
    <el-row class="time_header">
      <SelectFilter
        ref="child"
        @change="handleChange" />
    </el-row>
    <el-row
      class="mgb10"
      :gutter="10">
      <el-col :span="24">
        <Card
          v-loading="loading"
          style="min-height:300px;">
          <div>当前下单进度</div>
          <template v-for="(item, index) in budgetsNowDataArr">
            <el-col
              :key="index"
              style="width:50%">
              <Bar
                v-if="budgetsNowDataArr.length"
                :id="`${index}`"
                :data="item" />
            </el-col>
          </template>
        </Card>
      </el-col>
    </el-row>
    <div class="capacity mgb10">
      <div
        v-loading="loading"
        class="table_container">
        <div class="title">本季度预算使用</div>
        <div class="el-table">
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="el-table__body"
            style="width:100%;">
            <tbody>
              <tr class="el-table__row">
                <td width="10%"><div class="cell" /></td>
                <td><div class="cell">{{ seasonMonth[0] }}</div></td>
                <td><div class="cell">{{ seasonMonth[1] }}</div></td>
                <td><div class="cell">{{ seasonMonth[2] }}</div></td>
              </tr>
              <tr
                class="el-table__row"
                v-for="(c,idx) in budgetData['capacity']"
                :key="idx">
                <td><div class="cell">{{ c.supplier }}</div></td>
                <td>
                  <div class="cell">
                    <div :style="{background:'#FCD5B4',color:'#000',width:c.month1+'%'}">
                      {{ c.month1 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div :style="{background:'#FCD5B4',color:'#000',width:c.month2+'%'}">
                      {{ c.month2 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div :style="{background:'#FCD5B4',color:'#000',width:c.month3+'%'}">
                      {{ c.month3 }}%
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <el-row
      class="mgb10"
      :gutter="10">
      <el-col :span="12">
        <Card
          v-loading="loading"
          style="min-height:300px;">
          <div>首单预算使用</div>
          <template v-for="(item, index) in budgetsFirstDataArr">
            <el-col
              :key="index"
              style="width:50%">
              <Bar
                v-if="budgetsNowDataArr.length"
                :id="`aa${index}`"
                :data="item" />
            </el-col>
          </template>
        </Card>
      </el-col>
      <el-col :span="12">
        <Card
          v-loading="loading"
          style="min-height:300px;">
          <div>返单预算进度</div>
          <template v-for="(item, index) in budgetsreturnDataArr">
            <el-col
              :key="index"
              style="width:50%">
              <Bar
                v-if="budgetsreturnDataArr.length"
                :id="`bb${index}`"
                :data="item" />
            </el-col>
          </template>
        </Card>
      </el-col>
    </el-row>
    <el-row class="mgb10">
      <el-col :span="24">
        <Card
          v-loading="loading"
          style="min-height:450px;">
          <span>各业务部门下单进度</span>
          <ProgressBar
            :id="`overviewDepartment`"
            :y-axis="yAxisDepartment"
            :data="budgetData['department_order_progress']" />
        </Card>
      </el-col>
    </el-row>
    <el-row class="mgb10">
      <el-col :span="24">
        <Card
          v-loading="loading"
          style="min-height:450px;">
          <span>各工厂下单进度</span>
          <ProgressBar
            :id="`overviewSupplier`"
            :y-axis="yAxisSupplier"
            :data="budgetData['supplier_order_progress']" />
        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from './api';
import Bar from './bar';
import Card from 'components/Card';
import SelectFilter from './SelectFilter';
import ProgressBar from './ProgressBar';
import Slider from 'components/Slider';
import { mapGetters } from 'vuex';

export default {
    components: {
        Card,
        Bar,
        Slider,
        SelectFilter,
        ProgressBar,
    },
    data() {
        return {
            //货品预算数据
            budgetData:{
                now_order_progress:{},//当前下单进度
                first_order_progress:{},//首单下单进度
                return_order_progress:{},//返单下单进度
                department_order_progress:{},//各业务部门下单进度
                supplier_order_progress:{},//各工厂下单进度
                capacity:[]//本季度产能使用
            },
            yAxisNow:["预算使用","下单款数"],
            yAxisFirst:["首单预算","首单款数"],
            yAxisReturn:["返单预算","返单款数"],
            yAxisDepartment:["五部","四部","三部","二部","一部","总"],
            yAxisSupplier:["供应商E","供应商D","供应商C","供应商B","供应商A","总"],
            loading: false,
            seasonMonth:[],
        };
    },
    computed: {
        ...mapGetters([ 'budgetsNowDataArr','budgetsFirstDataArr','budgetsreturnDataArr']),
    },
    mounted() {},
    watch: {},
    methods: {
        //获取货品预算数据
        getBudgetData(form) {
            this.loading = true;
            const params = {};
            API.GetBudget(params).then(res => {
                this.budgetData["now_order_progress"] = res.data["now_order_progress"];
                this.budgetData["first_order_progress"] = res.data["first_order_progress"];
                this.budgetData["return_order_progress"] = res.data["return_order_progress"];
                this.budgetData["department_order_progress"] = res.data["department_order_progress"];
                this.budgetData["supplier_order_progress"] = res.data["supplier_order_progress"];

                //当前
                let nowOrder = this.budgetData["now_order_progress"];
                let obj = {},obj1 = {},nowArr=[];
                obj.subject_name = '预算使用';
                obj.real = nowOrder['actual_order_num'];
                obj.target = nowOrder['target_order_num'];
                obj.progress = obj.real / obj.target;
                obj.subject = 'JS';

                obj1.subject_name = '下单款数';
                obj1.real = nowOrder['actual_style_num'];
                obj1.target = nowOrder['target_style_num'];
                obj1.progress = obj1.real / obj1.target;
                obj1.subject = 'JS';
                nowArr.push(obj1,obj);
                this.$store.dispatch('SaveBudgetsNowData', nowArr);

                //首单下单进度
                let firstOrder = this.budgetData["first_order_progress"];
                let firstobj = {},firstobj1 = {},firstArr=[];
                firstobj.subject_name = '首单预算';

                firstobj.real = firstOrder['actual_order_num'];
                firstobj.target = firstOrder['target_order_num'];
                firstobj.progress = firstobj.real / firstobj.target;
                firstobj.subject = 'JS';

                firstobj1.subject_name = '首单款数';
                firstobj1.real = firstOrder['actual_style_num'];
                firstobj1.target = firstOrder['target_style_num'];
                firstobj1.progress = firstobj1.real / firstobj1.target;
                firstobj1.subject = 'JS';

                firstArr.push(firstobj1,firstobj);
                this.$store.dispatch('SaveBudgetsFirstData', firstArr);

                //返单预算进度
                let returnOrder = this.budgetData["return_order_progress"];
                let returnobj = {},returnobj1 = {},returnArr=[];
                returnobj.subject_name = '返单预算';
                returnobj.real = returnOrder['actual_order_num'];
                returnobj.target = returnOrder['target_order_num'];
                returnobj.progress = returnobj.real / returnobj.target;

                returnobj1.subject_name = '返单款数';
                returnobj1.real = returnOrder['actual_style_num'];
                returnobj1.target = returnOrder['target_style_num'];
                returnobj1.progress = returnobj1.real / returnobj1.target;
                returnobj1.subject = 'FD';

                returnArr.push(returnobj1,returnobj);
                this.$store.dispatch('SaveBudgetsreturnData', returnArr);

                if(form.season === "春季"){
                    this.seasonMonth.length = 0;
                    this.seasonMonth.push("3月","4月","5月");
                }else if(form.season === "夏季"){
                    this.seasonMonth.length = 0;
                    this.seasonMonth.push("6月","7月","8月");
                }else if(form.season === "秋季"){
                    this.seasonMonth.length = 0;
                    this.seasonMonth.push("9月","10月","11月");
                }else if(form.season === "冬季"){
                    this.seasonMonth.length = 0;
                    this.seasonMonth.push("12月","1月","2月");
                }
                let capacity = [
                    {
                        supplier:'全部',
                        month1:res.data["capacity"]["total"][0],
                        month2:res.data["capacity"]["total"][1],
                        month3:res.data["capacity"]["total"][2]
                    },
                    {
                        supplier:'工厂A',
                        month1:res.data["capacity"]["s5"][0],
                        month2:res.data["capacity"]["s5"][1],
                        month3:res.data["capacity"]["s5"][2]
                    },
                    {
                        supplier:'工厂B',
                        month1:res.data["capacity"]["s4"][0],
                        month2:res.data["capacity"]["s4"][1],
                        month3:res.data["capacity"]["s4"][2]
                    },
                    {
                        supplier:'工厂C',
                        month1:res.data["capacity"]["s3"][0],
                        month2:res.data["capacity"]["s3"][1],
                        month3:res.data["capacity"]["s3"][2]
                    },
                    {
                        supplier:'工厂D',
                        month1:res.data["capacity"]["s2"][0],
                        month2:res.data["capacity"]["s2"][1],
                        month3:res.data["capacity"]["s2"][2]
                    },
                    {
                        supplier:'工厂E',
                        month1:res.data["capacity"]["s1"][0],
                        month2:res.data["capacity"]["s1"][1],
                        month3:res.data["capacity"]["s1"][2]
                    }
                ];
                this.budgetData["capacity"] = capacity;
            }).finally(() => {
                this.loading = false;
            });
        },
        //下拉筛选
        handleChange(form) {
            this.getBudgetData(form);
        },
    }
};
</script>

<style lang="scss">
    @import './style/overview.scss';
</style>
<style lang="scss" scoped>
    .container .container_wrap .right > div[data-v-fae5bece]:first-child{
        min-height:1990px;
        overflow:hidden;
    }
</style>
