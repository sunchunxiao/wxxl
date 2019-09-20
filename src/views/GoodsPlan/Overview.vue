<template>
  <div class="plan">
    <el-row class="time_header">
      <SelectFilter
        ref="child"
        @change="handleChange" />
    </el-row>
    <el-row class="mgb10">
      <el-col :span="24">
        <Card
          v-loading="loading"
          style="min-height:300px;">
          <span>当前下单进度</span>
          <ProgressBar
            :id="`overviewNow`"
            :y-axis="yAxisNow"
            :data="planData['now_order_progress']" />
        </Card>
      </el-col>
    </el-row>
    <el-row
      class="mgb10"
      :gutter="10">
      <el-col :span="12">
        <Card
          v-loading="loading"
          style="min-height:300px;">
          <span>首单下单进度</span>
          <ProgressBar
            :id="`overviewFirst`"
            :y-axis="yAxisFirst"
            :data="planData['first_order_progress']" />
        </Card>
      </el-col>
      <el-col :span="12">
        <Card
          v-loading="loading"
          style="min-height:300px;">
          <span>返单下单进度</span>
          <ProgressBar
            :id="`overviewReturn`"
            :y-axis="yAxisReturn"
            :data="planData['return_order_progress']" />
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
            :data="planData['department_order_progress']" />
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
            :y-axis = "yAxisSupplier"
            :data="planData['supplier_order_progress']" />
        </Card>
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
import Card from 'components/Card';
import SelectFilter from './SelectFilter';
import ProgressBar from './ProgressBar';

export default {
    components: {
        Card,
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
    computed: {},
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
        min-height:1990px;
        overflow:hidden;
    }
</style>
