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
              :key="item"
            />
          </template>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col 
      class="special_month"
      :span="9">
      <el-form-item
        v-if="form.pt === '日'"
        label="时间段选择"
        prop="dayRange"
        :rules="{
          required: true, message: '请选择时间段', trigger: 'blur'
      }">
        <el-date-picker 
          v-model="form.dayRange" 
          type="datetimerange" 
          :default-value="timeDefaultShow" 
          :picker-options="pickerBaseOptions"
          range-separator="-" 
          start-placeholder="开始日期"
          end-placeholder="结束日期" 
          format="yyyy-MM-dd" 
          value-format="yyyy-MM-dd" 
          align="right"/>
      </el-form-item>
      <el-col >
        <template 
          v-if="form.pt === '周'">
          <!-- <el-col :span="14"> -->
          <el-form-item 
            label="时间段选择" 
            prop="weekStart" 
            :rules="{
              required: true, message: '请选择开始周', trigger: 'blur'
          }">
            <el-date-picker
              v-model="form.weekStart"
              type="week"
              format="yyyy 第 WW 周"
              :picker-options="weekStartOptions"
              placeholder="请选择开始周"/>
          </el-form-item>
          <!-- </el-col> -->
          <el-col 
            :span="9" 
            class="align_center">
            <el-form-item
              prop="weekEnd" 
              :rules="{
                required: true, message: '请选择结束周', trigger: 'blur'
            }">
              <el-date-picker
                v-model="form.weekEnd"
                type="week"
                format="yyyy 第 WW 周"
                :picker-options="weekEndOptions"
                placeholder="请选择结束周"/>
            </el-form-item>
          </el-col>
        </template>
      </el-col>
      <template v-if="form.pt === '月'">
        <!-- <el-col :span="12"> -->
        <el-form-item 
          label="时间段选择"
          prop="monthStart" 
          :rules="{
            required: true, message: '请选择开始月', trigger: 'blur'
        }">
          <el-date-picker
            v-model="form.monthStart"
            type="month"
            format="yyyy MM 月"
            :picker-options="monthStartOptions"
            placeholder="请选择开始月"/>
        </el-form-item>
        <!-- </el-col> -->
        <el-col 
          :span="9" 
          class="align_center">
          <el-form-item 
            prop="monthEnd" 
            :rules="{
              required: true, message: '请选择结束月', trigger: 'blur'
          }">
            <el-date-picker
              v-model="form.monthEnd"
              type="month"
              format="yyyy MM 月"
              :picker-options="monthEndOptions"
              placeholder="请选择结束月"/>
          </el-form-item>
        </el-col>
      </template>
      <template v-if="form.pt === '年'">
        <!-- <el-col :span="12"> -->
        <el-form-item 
          label="时间段选择"
          prop="yearStart" 
          :rules="{
            required: true, message: '请选择开始年', trigger: 'blur'
        }">
          <el-date-picker
            v-model="form.yearStart"
            type="year"
            :picker-options="yearStartOptions"
            placeholder="请选择开始年"/>
        </el-form-item>
        <!-- </el-col> -->
        <el-col 
          :span="9" 
          class="align_center">
          <el-form-item 
            prop="yearEnd" 
            :rules="{
              required: true, message: '请选择结束年', trigger: 'blur'
          }">
            <el-date-picker
              v-model="form.yearEnd"
              type="year"
              :picker-options="yearEndOptions"
              placeholder="请选择结束年"/>
          </el-form-item>
        </el-col>
      </template>
    </el-col>
    <el-col :span="6">
      <el-form-item label="精确搜索">
        <el-autocomplete 
          v-model="form.kw" 
          :fetch-suggestions="searchKw"
          @select="handleKwSelect"
          :debounce="500"
          :trigger-on-focus="false"
          value-key="name"
          :placeholder="t()">
          <i 
            slot="prefix" 
            class="el-input__icon el-icon-search"/>
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

// TODO: 季
const UNITS = ['日', '周', '月','年'];
export default {
    data() {
        return {
            units: UNITS,
            timeDefaultShow:'',
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

                kw: '',
                cid: '',
            }
        };
    },
    props: {
      url: {
        type: String,
        required: true
      },
    },
    computed: {
        weekStartOptions() {
            const { weekEnd } = this.form;
            return {
                disabledDate(time) {
                    if (weekEnd) {
                        return time.getTime() > _.toNumber(moment(weekEnd).add(5, 'd').format('x'));
                    }
                },
                ...this.pickerBaseOptions
            };
        },
        weekEndOptions() {
            const { weekStart } = this.form;
            return {
                disabledDate(time) {
                    if (weekStart) {
                        return time.getTime() < _.toNumber(moment(weekStart).subtract(1, 'd').format('x'));
                    }
                },
                ...this.pickerBaseOptions
            };
        },
        monthStartOptions() {
            const { monthEnd } = this.form;
            return {
                disabledDate(time) {
                    if (monthEnd) {
                        return time.getTime() > _.toNumber(moment(monthEnd).format('x'));
                    }
                }
            };
        },
        monthEndOptions() {
            const { monthStart } = this.form;
            return {
                disabledDate(time) {
                    if (monthStart) {
                        return time.getTime() < _.toNumber(moment(monthStart).format('x'));
                    }
                }
            };
        },
        yearStartOptions() {
            const { yearEnd } = this.form;
            return {
                disabledDate(time) {
                    if (yearEnd) {
                        return time.getTime() > _.toNumber(moment(yearEnd).format('x'));
                    }
                }
            };
        },
        yearEndOptions() {
            const { yearStart } = this.form;
            return {
                disabledDate(time) {
                    if (yearStart) {
                        return time.getTime() < _.toNumber(moment(yearStart).format('x'));
                    }
                }
            };
        }
    },
    mounted() {
      // todo: 设置初始值
    //   console.log(this.url);
         this.timeDefaultShow = new Date();
         this.timeDefaultShow.setMonth(new Date().getMonth() - 1);
    },
    methods: {
        t(){
            if(this.url=='/product/search'){
                return "产品编号/产品名称";
            }else if(this.url=='/cus/search'){
                return "客户编号/客户名称";
            }
        },
        parentMsg: function (msg) {
            //在点击左侧节点的时候 搜素框值为空
            if(msg){
                if(this.form.kw!=""){
                 this.form.kw='';
              }
            }
            
        },
        handleClick() {
          // todo: 暂时去掉表单验证 觉得交互不太好
            // this.$refs['form'].validate(valid => {
            //     if (valid) {
                    
                    const { pt, dayRange, weekStart, weekEnd, monthStart, monthEnd, yearStart, yearEnd, cid } = this.form;
                    let obj = { pt, sDate: '', eDate: '', cid };
                    if (pt === '日') {
                        obj.sDate = dayRange[0];
                        obj.eDate = dayRange[1];
                    } else if (pt === '周') {
                        obj.sDate = moment(weekStart).startOf('week').format('YYYY-MM-DD');
                        obj.eDate = moment(weekEnd).endOf('week').format('YYYY-MM-DD');
                    } else if (pt === '月') {
                        obj.sDate = moment(monthStart).format('YYYY-MM-DD');
                        obj.eDate = moment(monthEnd).endOf('month').format('YYYY-MM-DD');
                    } else if (pt === '年') {
                        obj.sDate = moment(yearStart).format('YYYY-MM-DD');
                        obj.eDate = moment(yearEnd).endOf('year').format('YYYY-MM-DD');
                    }
                    if (obj.sDate === 'Invalid date' || obj.eDate === 'Invalid date' || !obj.sDate || !obj.eDate) {
                        // console.log(cid);
                        this.$message({
                            type:'error',
                            message:'请选择日期',
                            duration:2000
                        });
                        // return;
                    } 
                    else{
                        this.$emit('search', obj);
                    }
        },
        searchKw(kw, cb) {
            // console.log(kw,cb);
            // this.url = '/product/search';
            // console.log(this.url);
          if (this.url) {
              let params = {
                kw:kw
              };
            FetchGet(this.url, params).then(res => {
              cb(res.suggestions || []);
            });
          } else {
            cb([]);
          }
        },
        handleKwSelect(obj) {
          this.form.cid = obj.id;
        }
    }
};
</script>

<style lang="scss">
.search_bar {
    .align_center {
        .el-form-item__label {
            text-align: center;
        }
    }
}
.special_month {
    .el-form-item{
        float: left;
    }
    .align_center{
        float: left;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 160px;
    }
}
.special_month .el-form-item__content{
    margin-left: 28px!important;
    overflow: hidden;
}

.time_submit .el-form-item__content{
        margin-left: 40px!important;
        button{
            width: 140px;
            background-color: #3090c0;
            box-shadow:  0 3px 5px 0 rgba(204, 204, 204, 0.8)
        }
}

</style>

