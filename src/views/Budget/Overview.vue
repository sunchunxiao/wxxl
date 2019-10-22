<template>
  <div class="budget">
    <el-row class="time_header">
      <!-- <PlanBudgetSelectFilter
        ref="child"
        :seasons="seasons"
        :properties="properties"
        :progresses="progresses"
        @change="handleChange" /> -->
      <PlanBudgetSelectFilter
        ref="child"
        :form-data="form"
        @change="handleChange" />
    </el-row>
    <el-row
      class="mgb10 wrap"
      v-loading="loading">
      <div>当前{{ progress }}进度</div>
      <template v-for="(budgetNow, index) in budgetprogress.now_order_progress">
        <el-col
          v-if="budgetprogress.now_order_progress.length"
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
                <td width="12%"><div class="cell" /></td>
                <td><div class="cell">{{ keys[0] }}月</div></td>
                <td><div class="cell">{{ keys[1] }}月</div></td>
                <td><div class="cell">{{ keys[2] }}月</div></td>
              </tr>
              <tr
                class="el-table__row"
                v-for="(b,idx) in budgetCapacity"
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
      <template v-for="(budgetFirst, index) in budgetprogress.first_order_progress">
        <el-col
          v-if="budgetprogress.first_order_progress.length"
          :span="6"
          class="mgt30"
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
      <template v-for="(budgetReturn, index) in budgetprogress.return_order_progress">
        <el-col
          v-if="budgetprogress.return_order_progress.length"
          :span="6"
          class="mgt30"
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
      <div>各业务部门{{ progress }}进度</div>
      <el-col
        :span="24">
        <div class="info">
          <span class="colorSpan graySpan" /><span class="avg">： 目标</span>
          <span class="colorSpan greenSpan" /><span class="avg">： 实际(超过基准线)</span>
          <span class="colorSpan redSpan" /><span class="avg">： 实际(达不到基准线)</span>
        </div>
        <PlanBudgetBar
          v-if="budgetDepartment.planData && budgetDepartment.planData.length"
          :id="`budgetDepartment`"
          :data="budgetDepartment" />
      </el-col>
    </el-row>
    <el-row
      class="wrap"
      v-loading="loading">
      <div>各工厂{{ progress }}进度</div>
      <el-col
        :span="24">
        <div class="info">
          <span class="colorSpan graySpan" /><span class="avg">： 目标</span>
          <span class="colorSpan greenSpan" /><span class="avg">： 实际(超过基准线)</span>
          <span class="colorSpan redSpan" /><span class="avg">： 实际(达不到基准线)</span>
        </div>
        <PlanBudgetBar
          v-if="budgetFactory.planData && budgetFactory.planData.length "
          :id="`budgetSupplier`"
          :data="budgetFactory" />
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
            form:{
                seasons: [],//货品季节类型
                properties: [],//货品属性类型
                progresses: [],//货品进度类型
            },
            //货品预算数据
            budgetData:{
                now_order_progress:{},//当前下单进度
                first_order_progress:{},//首单下单进度
                return_order_progress:{},//返单下单进度
                department_order_progress:{},//各业务部门下单进度
                supplier_order_progress:{},//各工厂下单进度
                capacity:[]//本季度产能使用
            },
            loading: false,
            seasonMonth:[],
            progress:'',
            keys:[]
        };
    },
    computed: {
        ...mapGetters([ 'budgetprogress','budgetDepartment','budgetFactory','budgetCapacity']),
    },
    created() {
        this.fliter();
    },
    mounted() {

    },
    watch: {},
    methods: {
        fliter() {
            API.GetBudgetFilter().then(res => {
                this.form.seasons = Object.values(res.data.season);
                this.form.properties = Object.values(res.data.attribute);
                this.form.progresses = Object.values(res.data.progress);
            });
        },
        //获取货品进度
        getBudgetOrders(form) {
            this.loading = true;
            const params = {
                season: form.season,
                attribute : form.property,
                progress:form.progress,
            };
            API.GetBudgetOrders(params).then(res => {
                this.$store.dispatch('SaveBudgetProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //各业务部门下单进度
        getBudgetDepartment(form) {
            this.loading = true;
            const params = {
                season: form.season,
                attribute : form.property,
                progress:form.progress,
            };
            API.GetBudgetDepartment(params).then(res => {
                this.$store.dispatch('SaveBudgetDepartmentData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //各业务部门下单进度
        getBudgetFactory(form) {
            this.loading = true;
            const params = {
                season: form.season,
                attribute : form.property,
                progress:form.progress,
            };
            API.GetBudgetFactory(params).then(res => {
                this.$store.dispatch('SaveBudgetFactoryData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //本季度产能使用
        getBudgetCapacity() {
            this.loading = true;
            API.GetBudgetCapacity().then(res => {
                this.keys = [];
                for (let key of Object.keys(res.data.production_rate)) {
                    this.keys.push(key);
                }
                let CapacityTableData = this.formatCapacityTableData(res.data);
                this.$store.dispatch('SaveBudgetCapacityData', CapacityTableData);
            }).finally(() => {
                this.loading = false;
            });
        },
        //本季度产能使用表结构转换
        formatCapacityTableData(data) {
            let capacity = [];
            let production_rate = data.production_rate;
            let keys = [];
            for (let key of Object.keys(production_rate)) {
                keys.push(key);
            }
            for (let i = 0; i < data.factory.length; i++) {
                let row = {};
                row.supplier = data.factory[i];
                row.month1 = production_rate[9][i];
                row.month2 = production_rate[10][i];
                row.month3 = production_rate[11][i];
                // row.month3 = data[keys[i]][2];
                capacity.push(row);
            }
            //全部置顶
            // capacity.unshift(capacity.splice(capacity.length-1 , 1)[0]);
            return capacity;
        },

        //下拉筛选
        handleChange(form) {
            this.progress = form.progress;
            // this.getBudgetData(form);
            this.getBudgetOrders(form);
            this.getBudgetDepartment(form);
            this.getBudgetFactory(form);
            this.getBudgetCapacity(form);
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
