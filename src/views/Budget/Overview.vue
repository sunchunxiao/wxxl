<template>
  <div class="budget">
    <el-row class="time_header">
      <PlanBudgetSelectFilter
        ref="child"
        :seasons="seasons"
        :properties="properties"
        :progresses="progresses"
        @change="handleChange" />
    </el-row>
    <el-row
      class="mgb10 wrap"
      v-loading="loading">
      <div>当前下单进度</div>
      <template v-for="(budgetNow, index) in budgetNowDataArr">
        <el-col
            v-if="budgetNowDataArr.length"
            :span="12"
            :key="index">
            <ProTargetAchievement
                :id="`budgetNow${index}`"
                :data="budgetNow" />
        </el-col>
      </template>
    </el-row>
    <div class="mgb10 capacity">
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
                v-for="(b,idx) in budgetData['capacity']"
                :key="idx">
                <td><div class="cell">{{ b.supplier }}</div></td>
                <td>
                  <div class="cell">
                    <div
                      class="progress"
                      :style="{width:b.month1+'%'}">
                      {{ b.month1 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div
                      class="progress"
                      :style="{width:b.month2+'%'}">
                      {{ b.month2 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div
                      class="progress"
                      :style="{width:b.month3+'%'}">
                      {{ b.month3 }}%
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
      class="mgb10 wrap"
      v-loading="loading">
      <div
        class="title"
        style="left:20px;">
        首单预算使用
      </div>
      <template v-for="(budgetFirst, index) in budgetFirstDataArr">
        <el-col
            v-if="budgetFirstDataArr.length"
            :span="6"
            :key="`budgetFirst${index}`">
            <ProTargetAchievement
                :id="`budgetFirst${index}`"
                :data="budgetFirst" />
        </el-col>
      </template>
      <div
        class="title"
        style="left:50%;">
        返单预算进度
      </div>
      <template v-for="(budgetReturn, index) in budgetReturnDataArr">
        <el-col
            v-if="budgetReturnDataArr.length"
            :span="6"
            :key="`budgetReturn${index}`">
            <ProTargetAchievement
                :id="`budgetReturn${index}`"
                :data="budgetReturn" />
        </el-col>
      </template>
    </el-row>
    <el-row
      class="mgb10 wrap"
      v-loading="loading">
      <div>各业务部门下单进度</div>
      <el-col
        :span="24">
        <PlanBudgetBar
          :id="`budgetDepartment`"
          :y-axis="yAxisDepartment"
          :data="budgetData['department_order_progress']" />
      </el-col>
    </el-row>
    <el-row
      class="wrap"
      v-loading="loading">
      <div>各工厂下单进度</div>
      <el-col
        :span="24">
        <PlanBudgetBar
          :id="`budgetSupplier`"
          :y-axis = "yAxisSupplier"
          :data="budgetData['supplier_order_progress']" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from './api';
import PlanBudgetSelectFilter from 'components/PlanBudgetSelectFilter';
import ProTargetAchievement from 'components/ProTargetAchievement';
import PlanBudgetBar from 'components/PlanBudgetBar';
import { mapGetters } from 'vuex';

export default {
    components: {
        PlanBudgetSelectFilter,
        ProTargetAchievement,
        PlanBudgetBar,
    },
    data() {
        return {
            seasons: ['春季', '夏季', '秋季', '冬季'],//货品季节类型
            properties: ['全部', '类目一', '类目二', '类目三'],//货品属性类型
            progresses:['下单', '到货'],//货品进度类型
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
        ...mapGetters([ 'budgetNowDataArr','budgetFirstDataArr','budgetReturnDataArr']),
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
                this.formatPie("now","下单款数","预算使用",this.budgetData,this.$store);//当前下单进度
                this.formatPie("first","首单款数","首单预算",this.budgetData,this.$store);//首单预算使用
                this.formatPie("return","返单款数","返单预算",this.budgetData,this.$store);//返单预算进度
                this.budgetData["capacity"] = this.formatCapacityTableData(res.data["capacity"]);

                switch (form.season) {
                    case "春季":
                        this.seasonMonth.splice(0,3,"3月","4月","5月");
                        break;
                    case "夏季":
                        this.seasonMonth.splice(0,3,"6月","7月","8月");
                        break;
                    case "秋季":
                        this.seasonMonth.splice(0,3,"9月","10月","11月");
                        break;
                    case "冬季":
                        this.seasonMonth.splice(0,3,"12月","1月","2月");
                        break;
                }
            }).finally(() => {
                this.loading = false;
            });
        },

        //当前下单进度,首单,返单预算进度环形图转换
        //subject_name 标题 real 实际 target 目标 progress 进度条 subject 展示对象
        formatPie(type,sbjName1,sbjName2,data,store){
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
            store.dispatch(`SaveBudget${type.replace(type[0],type[0].toUpperCase())}Data`, arr);
        },

        //本季度预算使用表结构转换
        formatCapacityTableData(data){
            let capacity = [];
            let keys = [];
            for (let key of Object.keys(data)) {
                keys.push(key);
            }
            for(let i = 0; i < keys.length; i++){
                let row = {};
                row.supplier = this.formatSupplierName(keys[i]);
                row.month1 = data[keys[i]][0];
                row.month2 = data[keys[i]][1];
                row.month3 = data[keys[i]][2];
                capacity.push(row);
            }
            //全部置顶
            capacity.unshift(capacity.splice(capacity.length-1 , 1)[0]);
            return capacity;
        },

        //工厂名称转换
        formatSupplierName(name){
            let cnName = "";
            switch (name) {
                case "s1":
                    cnName = "工厂A";
                    break;
                case "s2":
                    cnName = "工厂B";
                    break;
                case "s3":
                    cnName = "工厂C";
                    break;
                case "s4":
                    cnName = "工厂D";
                    break;
                case "s5":
                    cnName = "工厂E";
                    break;
                case "total":
                    cnName = "全部";
                    break;
            }
            return cnName;
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
        min-height:2000px;
        overflow:hidden;
    }
</style>
