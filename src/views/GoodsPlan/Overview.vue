<template>
  <div class="plan">
    <el-row class="time_header">
      <SelectFilter
        ref="child"
        @change="handleChange" />
    </el-row>
    <el-row
        class="mgb10 wrap"
        v-loading="loading">
        <div>当前下单进度</div>
        <el-col
            v-for="(planNow, index) in planNowDataArr"
            :span="12"
            :key="index">
            <PlanBudgetPie
                v-if="planNowDataArr.length"
                :id="`overviewNow${index}`"
                :data="planNow" />
        </el-col>
    </el-row>
    <el-row
        class="mgb10 wrap"
        v-loading="loading"
        :gutter="10">
        <div class="title" style="left:20px;">首单下单进度</div>
        <el-col
            v-for="(planFirst, index) in planFirstDataArr"
            :span="6"
            :key="`overviewFirst${index}`">
            <PlanBudgetPie
                v-if="planFirstDataArr.length"
                :id="`overviewFirst${index}`"
                :data="planFirst" />
        </el-col>
        <div class="title" style="left:50%;">返单下单进度</div>
        <el-col
            v-for="(planReturn, index) in planReturnDataArr"
            :span="6"
            :key="`overviewReturn${index}`">
            <PlanBudgetPie
                v-if="planReturnDataArr.length"
                :id="`overviewReturn${index}`"
                :data="planReturn" />
        </el-col>
    </el-row>
    <el-row 
        class="mgb10 wrap"
        v-loading="loading">
        <div>各业务部门下单进度</div>
        <el-col 
            :span="24">
            <ProgressBar
                :id="`overviewDepartment`"
                :y-axis="yAxisDepartment"
                :data="planData['department_order_progress']" />
        </el-col>
    </el-row>
    <el-row 
        class="mgb10 wrap"
        v-loading="loading">
        <div>各工厂下单进度</div>
        <el-col 
            :span="24">
            <ProgressBar
                :id="`overviewSupplier`"
                :y-axis = "yAxisSupplier"
                :data="planData['supplier_order_progress']" />
        </el-col>
    </el-row>
    <div class="capacity">
      <div
        v-loading="loading"
        class="table_container">
        <div class="title">本季度产能使用</div>
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
                v-for="(c,idx) in planData['capacity']"
                :key="idx">
                <td><div class="cell">{{ c.supplier }}</div></td>
                <td>
                  <div class="cell">
                    <div :style="{background:'#2AE09E',color:'#fff',width:c.month1+'%'}">
                      {{ c.month1 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div :style="{background:'#2AE09E',color:'#fff',width:c.month2+'%'}">
                      {{ c.month2 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div :style="{background:'#2AE09E',color:'#fff',width:c.month3+'%'}">
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
  </div>
</template>

<script>
import API from './api';
import SelectFilter from './SelectFilter';
import PlanBudgetPie from 'components/PlanBudgetPie';
import ProgressBar from './ProgressBar';
import { mapGetters } from 'vuex';

export default {
    components: {
        PlanBudgetPie,
        SelectFilter,
        ProgressBar,
    },
    data() {
        return {
            //货品计划数据
            planData:{
                now_order_progress:{},//当前下单进度
                first_order_progress:{},//首单下单进度
                return_order_progress:{},//返单下单进度
                department_order_progress:{},//各业务部门下单进度
                supplier_order_progress:{},//各工厂下单进度
                capacity:[]//本季度产能使用
            },
            yAxisNow:["下单件数","下单款数"],
            yAxisFirst:["首单件数","首单款数"],
            yAxisReturn:["返单件数","返单款数"],
            yAxisDepartment:["五部","四部","三部","二部","一部","总"],
            yAxisSupplier:["供应商E","供应商D","供应商C","供应商B","供应商A","总"],
            loading: false,
            seasonMonth:[],
        };
    },
    computed: {
        ...mapGetters([ 'planNowDataArr','planFirstDataArr','planReturnDataArr']),
    },
    mounted() {},
    watch: {},
    methods: {
        //获取货品计划数据
        getPlanData(form) {
            this.loading = true;
            const params = {};
            API.GetPlan(params).then(res => {
                this.planData["now_order_progress"] = res.data["now_order_progress"];
                this.planData["first_order_progress"] = res.data["first_order_progress"];
                this.planData["return_order_progress"] = res.data["return_order_progress"];
                this.planData["department_order_progress"] = res.data["department_order_progress"];
                this.planData["supplier_order_progress"] = res.data["supplier_order_progress"];

                /*
                * PlanBudgetPie:
                * subject_name 标题 real 实际 target 目标 progress 进度条 subject 展示对象
                */
                function formatPie(type,sbjName1,sbjName2,data,store){
                    let styleNum = {}, orderNum = {}, arr=[];
                    styleNum.subject_name = sbjName1;
                    styleNum.real = data[`${type}_order_progress`]['actual_style_num'];
                    styleNum.target = data[`${type}_order_progress`]['target_style_num'];
                    styleNum.progress = styleNum.real / styleNum.target;
                    styleNum.subject = 'KS';
                    orderNum.subject_name = sbjName2;
                    orderNum.real = data[`${type}_order_progress`]['actual_order_num'];
                    orderNum.target = data[`${type}_order_progress`]['target_order_num'];
                    orderNum.progress = orderNum.real / orderNum.target;
                    orderNum.subject = 'KS';
                    arr.push(styleNum,orderNum);
                    store.dispatch(`SavePlan${type.replace(type[0],type[0].toUpperCase())}Data`, arr);
                }
                //当前下单进度
                formatPie("now","下单款数","下单件数",this.planData,this.$store);
                //首单下单进度
                formatPie("first","首单款数","首单件数",this.planData,this.$store);
                //返单下单进度
                formatPie("return","返单款数","返单件数",this.planData,this.$store);

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
                        supplier:'供应商A',
                        month1:res.data["capacity"]["s5"][0],
                        month2:res.data["capacity"]["s5"][1],
                        month3:res.data["capacity"]["s5"][2]
                    },
                    {
                        supplier:'供应商B',
                        month1:res.data["capacity"]["s4"][0],
                        month2:res.data["capacity"]["s4"][1],
                        month3:res.data["capacity"]["s4"][2]
                    },
                    {
                        supplier:'供应商C',
                        month1:res.data["capacity"]["s3"][0],
                        month2:res.data["capacity"]["s3"][1],
                        month3:res.data["capacity"]["s3"][2]
                    },
                    {
                        supplier:'供应商D',
                        month1:res.data["capacity"]["s2"][0],
                        month2:res.data["capacity"]["s2"][1],
                        month3:res.data["capacity"]["s2"][2]
                    },
                    {
                        supplier:'供应商E',
                        month1:res.data["capacity"]["s1"][0],
                        month2:res.data["capacity"]["s1"][1],
                        month3:res.data["capacity"]["s1"][2]
                    }
                ];
                this.planData["capacity"] = capacity;
            }).finally(() => {
                this.loading = false;
            });
        },
        //下拉筛选
        handleChange(form) {
            this.getPlanData(form);
        },
    }
};
</script>

<style lang="scss">
    @import './style/overview.scss';
</style>
<style lang="scss" scoped>
    .container .container_wrap .right > div[data-v-fae5bece]:first-child{
        min-height:2000px;
        overflow:hidden;
    }
</style>
