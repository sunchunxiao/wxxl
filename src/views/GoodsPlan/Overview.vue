<template>
  <div class="plan">
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
      <template v-for="(planNow, index) in planProgressData.now_order_progress">
        <el-col
          v-if="planProgressData.now_order_progress.length"
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
      <template v-for="(planFirst, index) in planProgressData.first_order_progress">
        <el-col
          v-if="planProgressData.first_order_progress.length"
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
      <template v-for="(planReturn, index) in planProgressData.return_order_progress">
        <el-col
          v-if="planProgressData.return_order_progress.length"
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
          <span class="colorSpan graySpan" /><span class="avg">： 目标</span>
          <span class="colorSpan greenSpan" /><span class="avg">： 实际(超过基准线)</span>
          <span class="colorSpan redSpan" /><span class="avg">： 实际(达不到基准线)</span>
        </div>
        <PlanBudgetBar
          :id="`planDepartment`"
          v-if="planDepartment.planData && planDepartment.planData.length"
          :data="planDepartment" />
      </el-col>
    </el-row>
    <el-row
      class="mgb10 wrap"
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
          v-if="planFactory.planData && planFactory.planData.length "
          :id="`planSupplier`"
          :data="planFactory" />
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
                <td><div class="cell">{{ keys[0] }}月</div></td>
                <td><div class="cell">{{ keys[1] }}月</div></td>
                <td><div class="cell">{{ keys[2] }}月</div></td>
              </tr>
              <tr
                class="el-table__row"
                v-for="(c,idx) in planCapacity"
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
            form:{
                seasons: [],//货品季节类型
                properties: [],//货品属性类型
                progresses: [],//货品进度类型
            },
            loading: false,
            seasonMonth:[],
            progress:'',
            keys:[],
            //货品进度
            planProgressData:{}
        };
    },
    computed: {
        ...mapGetters(['planDepartment','planFactory','planCapacity']),
    },
    mounted() {
        this.fliter();
    },
    watch: {},
    methods: {
        fliter() {
            API.GetPlanFilter().then(res => {
                this.form.seasons = Object.values(res.data.season);
                this.form.properties = Object.values(res.data.attribute);
                this.form.progresses = Object.values(res.data.progress);
            });
        },
        //获取货品进度
        getPlanOrders(form) {
            this.loading = true;
            const params = {
                season: form.season,
                attribute : form.property,
                progress:form.progress,
            };
            API.GetPlanOrders(params).then(res => {
                this.planProgressData = res.data;
                // this.$store.dispatch('SavePlanProgressData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //各业务部门下单进度
        getPlanDepartment(form) {
            this.loading = true;
            const params = {
                season: form.season,
                attribute : form.property,
                progress:form.progress,
            };
            API.GetPlanDepartment(params).then(res => {
                this.$store.dispatch('SavePlanDepartmentData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //各业务部门下单进度
        getPlanFactory(form) {
            this.loading = true;
            const params = {
                season: form.season,
                attribute : form.property,
                progress:form.progress,
            };
            API.GetPlanFactory(params).then(res => {
                this.$store.dispatch('SavePlanFactoryData', res.data);
            }).finally(() => {
                this.loading = false;
            });
        },
        //本季度产能使用
        getPlanCapacity() {
            this.loading = true;
            API.GetPlanCapacity().then(res => {
                this.keys = [];
                for (let key of Object.keys(res.data.production_rate)) {
                    this.keys.push(key);
                }
                let CapacityTableData = this.formatCapacityTableData(res.data);
                this.$store.dispatch('SavePlanCapacityData', CapacityTableData);
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
            // this.getPlanData(form);
            this.getPlanOrders(form);
            this.getPlanDepartment(form);
            this.getPlanFactory(form);
            this.getPlanCapacity(form);
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
