<template>
  <div class="plan">
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
      <div>当前{{ progress }}进度</div>
      <template v-for="(planNow, index) in planNowDataArr">
        <el-col
          v-if="planNowDataArr.length"
          :span="12"
          :key="index">
          <ProTargetAchievement
            :id="`planNow${index}`"
            :data="planNow" />
        </el-col>
      </template>
    </el-row>
    <el-row
      class="mgb10 wrap"
      v-loading="loading">
      <div
        class="title"
        style="left:20px;">
        首单{{ progress }}进度
      </div>
      <template v-for="(planFirst, index) in planFirstDataArr">
        <el-col
          v-if="planFirstDataArr.length"
          :span="6"
          class="mgt30"
          :key="`planFirst${index}`">
          <ProTargetAchievement
            :id="`planFirst${index}`"
            :data="planFirst" />
        </el-col>
      </template>
      <div
        class="title"
        style="left:50%;">
        返单{{ progress }}进度
      </div>
      <template v-for="(planReturn, index) in planReturnDataArr">
        <el-col
          v-if="planReturnDataArr.length"
          :span="6"
          class="mgt30"
          :key="`planReturn${index}`">
          <ProTargetAchievement
            :id="`planReturn${index}`"
            :data="planReturn" />
        </el-col>
      </template>
    </el-row>
    <el-row
      class="mgb10 wrap"
      v-loading="loading">
      <div>各业务部门{{ progress }}进度</div>
      <el-col
        :span="24">
        <div class="info">
          <span class="colorSpan greenSpan" /><span class="avg">： 实际</span>
          <span class="colorSpan graySpan" /><span class="avg">： 目标</span>
          <span class="colorSpan yellowSpan" /><span class="avg">：介于1/2基准线和基准线之间</span>
          <span class="colorSpan redSpan" /><span class="avg">：达不到1/2基准线</span>
        </div>
        <PlanBudgetBar
          :id="`planDepartment`"
          :y-axis="yAxisDepartment"
          :data="planData['department_order_progress']" />
      </el-col>
    </el-row>
    <el-row
      class="mgb10 wrap"
      v-loading="loading">
      <div>各工厂{{ progress }}进度</div>
      <el-col
        :span="24">
        <div class="info">
          <span class="colorSpan greenSpan" /><span class="avg">： 实际</span>
          <span class="colorSpan graySpan" /><span class="avg">： 目标</span>
          <span class="colorSpan yellowSpan" /><span class="avg">：介于1/2基准线和基准线之间</span>
          <span class="colorSpan redSpan" /><span class="avg">：达不到1/2基准线</span>
        </div>
        <PlanBudgetBar
          :id="`planSupplier`"
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
                <td width="12%"><div class="cell" /></td>
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
                    <div
                      class="progress"
                      :style="{width:c.month1+'%'}">
                      {{ c.month1 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div
                      class="progress"
                      :style="{width:c.month2+'%'}">
                      {{ c.month2 }}%
                    </div>
                  </div>
                </td>
                <td>
                  <div class="cell">
                    <div
                      class="progress"
                      :style="{width:c.month3+'%'}">
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
            yAxisSupplier:["战略供应商工厂D","战略供应商工厂C","战略供应商工厂B","战略供应商工厂A","总"],
            loading: false,
            seasonMonth:[],
            progress:'',
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
                this.formatPie("now",this.progress + "款数",this.progress + "件数",this.planData,this.$store);//当前下单进度
                this.formatPie("first","首单款数","首单件数",this.planData,this.$store);//首单下单进度
                this.formatPie("return","返单款数","返单件数",this.planData,this.$store);//返单下单进度
                this.planData["capacity"] = this.formatCapacityTableData(res.data["capacity"]).slice(0,5);
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

        //当前,首单,返单下单进度环形图转换
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
            store.dispatch(`SavePlan${type.replace(type[0],type[0].toUpperCase())}Data`, arr);
        },

        //本季度产能使用表结构转换
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

        //供应商名称转换
        formatSupplierName(name){
            let cnName = "";
            switch (name) {
                case "s1":
                    cnName = "战略供应商工厂A";
                    break;
                case "s2":
                    cnName = "战略供应商工厂B";
                    break;
                case "s3":
                    cnName = "战略供应商工厂C";
                    break;
                case "s4":
                    cnName = "战略供应商工厂D";
                    break;
                case "total":
                    cnName = "全部";
                    break;
            }
            return cnName;
        },

        //下拉筛选
        handleChange(form) {
            this.progress = form.progress;
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
        min-height:2020px;
        overflow:hidden;
    }
</style>
