<template>
  <el-form 
    class="search_bar"
    ref="form"
    :model="form"
    label-width="100px"
    size="mini">
    <el-col :span="5">
      <el-form-item label="时间单位选择">
        <el-select v-model="form.pt">
          <template v-for="item in units">
            <el-option 
              :label="item"
              :value="item"
              :key="item" />
          </template>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="9">
      <el-form-item 
        v-if="form.pt === '日'"
        label="时间段选择"
        prop="dayRange">
        <el-date-picker 
          v-model="form.dayRange"
          type="daterange"
          :picker-options="dayRangeOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :default-value="defaultValue"
          align="right" />
      </el-form-item>
      <template v-if="form.pt === '周'">
        <el-col :span="14">
          <el-form-item 
            label="时间段选择"
            prop="weekStart">
            <el-date-picker 
              v-model="form.weekStart"
              type="week"
              format="yyyy 第 WW 周"
              :picker-options="weekStartOptions"
              placeholder="请选择开始周" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item 
            class="endFormItem"
            prop="weekEnd">
            <el-date-picker 
              v-model="form.weekEnd"
              type="week"
              format="yyyy 第 WW 周"
              :picker-options="weekEndOptions"
              placeholder="请选择结束周" />
          </el-form-item>
        </el-col>
      </template>
      <template v-if="form.pt === '月'">
        <el-col :span="14">
          <el-form-item 
            label="时间段选择"
            prop="monthStart">
            <el-date-picker 
              v-model="form.monthStart"
              type="month"
              format="yyyy MM 月"
              :picker-options="monthStartOptions"
              placeholder="请选择开始月" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item 
            class="endFormItem"
            prop="monthEnd">
            <el-date-picker 
              v-model="form.monthEnd"
              type="month"
              format="yyyy MM 月"
              :picker-options="monthEndOptions"
              placeholder="请选择结束月" />
          </el-form-item>
        </el-col>
      </template>
      <template v-if="form.pt === '季'">
        <el-col :span="14">
          <el-form-item 
            label="时间段选择"
            prop="seasonStart">
            <SeasonPicker 
              v-model="form.seasonStart"
              placeholder="请选择开始季度"
              :picker-options="seasonStartOptions" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item 
            class="endFormItem"
            prop="seasonEnd">
            <SeasonPicker 
              v-model="form.seasonEnd"
              placeholder="请选择结束季度"
              :picker-options="seasonEndOptions" />
          </el-form-item>
        </el-col>
      </template>
      <template v-if="form.pt === '年'">
        <el-col :span="14">
          <el-form-item 
            label="时间段选择"
            prop="yearStart">
            <el-date-picker 
              v-model="form.yearStart"
              type="year"
              :picker-options="yearStartOptions"
              placeholder="请选择开始年" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item 
            class="endFormItem"
            prop="yearEnd">
            <el-date-picker 
              v-model="form.yearEnd"
              type="year"
              :picker-options="yearEndOptions"
              placeholder="请选择结束年" />
          </el-form-item>
        </el-col>
      </template>
    </el-col>
    <el-col :span="6">
      <el-form-item label="精确搜索">
        <el-autocomplete 
          v-model="kw"
          :fetch-suggestions="searchKw"
          @select="handleKwSelect"
          :debounce="500"
          :trigger-on-focus="false"
          value-key="name"
          :placeholder="cptPlaceholder">
          <i 
            slot="prefix"
            class="el-input__icon el-icon-search" />
        </el-autocomplete>
      </el-form-item>
    </el-col>
    <el-col 
      class="time_submit"
      :span="4">
      <el-form-item>
        <el-button 
          @click="handleClick"
          type="primary">确认</el-button>
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
import { FetchGet } from 'utils/fetch';
import SeasonPicker from './SeasonPicker';
import { mapGetters } from 'vuex';

const UNITS = ['日', '周', '月', '季', '年'];
/* 
eg:
    <search-bar 
        @search="handleSearch" // 点击确认回调
        url="/product/search" // 搜索 cid 的接口
        v-model="searchBarValue: {
                    pt: '', // 暂不支持传入修改
                    sDate: '', // 暂不支持传入修改
                    eDate: '' // 暂不支持传入修改
                }"
        :pt-options="['日', '月']" // 时间单位选择 支持 ['日', '周', '月', '年'] 和其子集
    />
*/
export default {
  components: {
    SeasonPicker
  },
  data () {
    return {
      units: this.ptOptions || UNITS,
      pickerBaseOptions: { firstDayOfWeek: 1 },
      form: {
        pt: '日',

        dayRange: [],

        weekStart: '',
        weekEnd: '',

        monthStart: '',
        monthEnd: '',

        yearStart: '',
        yearEnd: '',

        seasonStart: '',
        seasonEnd: '',
      },
      kw: '',
      cid: '',
    };
  },
  props: {
    value: Object,
    url: {
      type: String,
      required: true
    },
    placeholder: String,
    ptOptions: Array,
  },
  mounted () {
    const endTimeSet = process.env.VUE_APP_END_TIME_SET;
    if (endTimeSet && _.isDate(new Date(endTimeSet))) {
      this.form.dayRange = [
        moment(endTimeSet).subtract(1, 'M').format('YYYY-MM-DD'),
        endTimeSet
      ];
    } else {
      // 前一个月 - 昨天
      this.form.dayRange = [
        moment().subtract(1, 'd').subtract(1, 'M').format('YYYY-MM-DD'),
        moment().subtract(1, 'd').format('YYYY-MM-DD')
      ];
    }
    this.handleFormChange(this.form);
  },
  computed: {
    ...mapGetters(['productDateArr']),
    cptPlaceholder () {
      return this.placeholder;
    },
    defaultValue () {
      const endTimeSet = process.env.VUE_APP_END_TIME_SET;
      if (endTimeSet && _.isDate(new Date(endTimeSet))) {
        return moment(endTimeSet).valueOf();
      }
      return moment().valueOf();
    },
    dayRangeOptions () {
      return {
        disabledDate (time) {
          const endTimeSet = process.env.VUE_APP_END_TIME_SET;
          if (endTimeSet && _.isDate(new Date(endTimeSet))) {
            return time.getTime() > moment(endTimeSet).valueOf();
          }
          return time.getTime() > Date.now();
        },
        ...this.pickerBaseOptions
      };
    },
    weekStartOptions () {
      const { weekEnd } = this.form;
      return {
        disabledDate (time) {
          if (weekEnd) {
            return time.getTime() > moment(weekEnd).add(5, 'd').valueOf() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        },
        ...this.pickerBaseOptions
      };
    },
    weekEndOptions () {
      const { weekStart } = this.form;
      return {
        disabledDate (time) {
          if (weekStart) {
            return time.getTime() < moment(weekStart).subtract(1, 'd').valueOf() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        },
        ...this.pickerBaseOptions
      };
    },
    monthStartOptions () {
      const { monthEnd } = this.form;
      return {
        disabledDate (time) {
          if (monthEnd) {
            return time.getTime() > moment(monthEnd).valueOf() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        }
      };
    },
    monthEndOptions () {
      const { monthStart } = this.form;
      return {
        disabledDate (time) {
          if (monthStart) {
            return time.getTime() < moment(monthStart).valueOf() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        }
      };
    },
    seasonStartOptions () {
      const { seasonEnd } = this.form;
      return {
        disabledDate (time) {
          if (seasonEnd) {
            return time.getTime() > seasonEnd.getTime() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        }
      };
    },
    seasonEndOptions () {
      const { seasonStart } = this.form;
      return {
        disabledDate (time) {
          if (seasonStart) {
            return time.getTime() < seasonStart.getTime() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        }
      };
    },
    yearStartOptions () {
      const { yearEnd } = this.form;
      return {
        disabledDate (time) {
          if (yearEnd) {
            return time.getTime() > moment(yearEnd).valueOf() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        }
      };
    },
    yearEndOptions () {
      const { yearStart } = this.form;
      return {
        disabledDate (time) {
          if (yearStart) {
            return time.getTime() < moment(yearStart).valueOf() || time.getTime() > Date.now();
          }
          return time.getTime() > Date.now();
        }
      };
    }
  },
  watch: {
    form: {
      handler: function (val) {
        this.handleFormChange(val);
      },
      deep: true
    },
    kw: function (val) {
      // 搜索框内容修改时 清空 cid
      if (val == '') {
        this.cid = '';
      }
    }
  },
  methods: {
    handleFormChange (val) {
      const obj = this.calculateDate(val);
      if (!obj.sDate || obj.sDate === 'Invalid date') {
        obj.sDate = '';
      }
      if (!obj.eDate || obj.eDate === 'Invalid date') {
        obj.eDate = '';
      }
      // this.$store.dispatch('SaveProductDate', obj);
      this.$emit('input', obj);
    },
    clearKw () {
      //在点击左侧节点的时候 清空搜索框
      if (this.kw) {
        this.kw = '';
      }
    },
    calculateDate (form) {
      const { pt, dayRange, weekStart, weekEnd, monthStart, monthEnd, seasonStart, seasonEnd, yearStart, yearEnd } = form;
      let obj = { pt, sDate: '', eDate: '' };
      if (pt === '日') {
        obj.sDate = dayRange ? dayRange[0] : '';
        obj.eDate = dayRange ? dayRange[1] : '';
      } else if (pt === '周') {
        obj.sDate = moment(weekStart).startOf('week').format('YYYY-MM-DD');
        obj.eDate = moment(weekEnd).endOf('week').format('YYYY-MM-DD');
      } else if (pt === '月') {
        obj.sDate = moment(monthStart).format('YYYY-MM-DD');
        obj.eDate = moment(monthEnd).endOf('month').format('YYYY-MM-DD');
      } else if (pt === '季') {
        obj.sDate = moment(seasonStart).format('YYYY-MM-DD');
        obj.eDate = moment(seasonEnd).endOf('quarter').format('YYYY-MM-DD');
      } else if (pt === '年') {
        obj.sDate = moment(yearStart).format('YYYY-MM-DD');
        obj.eDate = moment(yearEnd).endOf('year').format('YYYY-MM-DD');
      }
      return obj;
    },
    handleClick () {
      let obj = this.calculateDate(this.form);
      if (obj.sDate === 'Invalid date' || obj.eDate === 'Invalid date' || !obj.sDate || !obj.eDate) {
        this.$message({
          type: 'error',
          message: '请选择日期',
          duration: 2000
        });
        return;
      } else {
        obj.cid = this.cid;
        this.$emit('search', obj);
      }
    },
    searchKw (kw, cb) {
      if (this.url) {
        FetchGet(this.url, { kw }).then(res => {
          cb(res.suggestions || []);
        });
      } else {
        cb([]);
      }
    },
    handleKwSelect (obj) {
      this.cid = obj.id;
    }
  }
};
</script>

<style lang="scss">
.search_bar {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 140px;
  }
  .endFormItem {
    .el-form-item__content {
      margin-left: 20px !important;
    }
  }
}

.time_submit .el-form-item__content {
  margin-left: 40px !important;
  button {
    width: 140px;
    background-color: #3090c0;
    box-shadow: 0 3px 5px 0 rgba(204, 204, 204, 0.8);
  }
}
</style>

