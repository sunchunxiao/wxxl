<template>
  <div class="season_picker">
    <div
      class="el-select"
      @click.stop="toggleMenu">
      <div
        class="el-input el-input--suffix"
        :style="{height: '28px' }">
        <input
          type="text"
          readonly="readonly"
          autocomplete="off"
          :class="{'el-input__inner': true, 'is-focus': visible}"
          ref="input"
          v-model="text"
          @blur="handleBlur"
          :placeholder="placeholder"
          :style="{height: '28px', 'font-size': '12px' }">
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i :class="{'el-select__caret': true, 'el-input__icon': true, 'el-icon-arrow-up': true, 'is-reverse': visible}" />
          </span>
        </span>
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <div
        v-if="visible"
        class="el-select-dropdown el-popper"
        x-placement="bottom"
        :style="{width: '100%', position: 'absolute'}">
        <div class="el-select-dropdown__wrap">
          <ul class="el-select-dropdown__list">
            <div class="year_select">
              <i
                class="el-select__caret el-input__icon el-icon-arrow-left cursor_pointer"
                @click.stop="prevYear" />
              <span class="year_text">{{ year }} 年</span>
              <i
                class="el-select__caret el-input__icon el-icon-arrow-right cursor_pointer"
                @click.stop="nextYear" />
            </div>
            <template v-for="(item, index) in seasons">
              <li
                :key="index"
                :class="{'selected': isSelect(index + 1), 'hover': isSelect(index + 1), 'el-select-dropdown__item': true, 'is-disabled': isDisabled(index + 1)}"
                @click.stop="!isDisabled(index + 1) ? selectSeason(index + 1) : null">{{ item }}</li>
            </template>
          </ul>
        </div>
        <div
          class="popper__arrow"
          :style="{left: '35px'}" />
      </div>
    </transition>
  </div>
</template>

<script>
const SEASONS = ['第一季度', '第二季度', '第三季度', '第四季度'];

export default {
    created () {
        if (_.isDate(this.value)) {
            const year = moment(this.value).year();
            const season = moment(this.value).quarter();
            this.year = year;
            this.select = {
                year,
                season
            };
            this.text = `${year} 年${SEASONS[season - 1]}`;
        }
    },
    data () {
        return {
            visible: false, // 是否显示下拉菜单
            text: '',
            year: moment().year(),
            seasons: SEASONS,
            select: {
                year: moment().year(),
                season: 0
            }
        };
    },
    props: {
        placeholder: String,
        pickerOptions: Object,
        value: [Date, String]
    },
    computed: {
        isDisabled () {
            return (season) => {
                if (!_.includes([1, 2, 3, 4], season)) {
                    return false;
                }
                if (_.isObject(this.pickerOptions)) {
                    const disabledDate = _.get(this.pickerOptions, 'disabledDate');
                    if (_.isFunction(disabledDate)) {
                        const date = new Date(`${this.year}-${season * 3}`);
                        const lastDay = moment(date).endOf('month').format('YYYY-MM-DD');
                        const time = new Date(lastDay);
                        return disabledDate(time);
                    }
                }
            };
        }
    },
    methods: {
        toggleMenu () {
            // 显示当前选中的年
            this.visible = !this.visible;
            if (this.visible) {
                this.year = this.select.year;
                this.$refs.input.focus();
            }
        },
        handleBlur () {
            // 暂时先去掉 后期优化
            // _.delay(() => {
            //   this.visible = false;
            // }, 300);
        },
        prevYear () {
            this.year = this.year - 1;
        },
        nextYear () {
            this.year = this.year + 1;
        },
        selectSeason (index) {
            this.select = {
                year: this.year,
                season: index
            };
            const { year, season } = this.select;
            this.text = `${year} 年${SEASONS[season - 1]}`;
            this.visible = false;
            const date = new Date(`${year}-${season * 3 - 2}`); // Fri Jun 01 2018 00:00:00 GMT+0800 (中国标准时间)
            this.$emit('input', date);
        },
        isSelect (index) {
            const { year, season } = this.select;
            return (year === this.year && season === index);
        }
    }
};
</script>

<style lang="scss">
.season_picker {
  width: 155px;
  position: relative;
  .year_select {
    height: 28px;
    line-height: 28px;
    text-align: center;
    margin-bottom: 5px;
    .year_text {
      margin: 0 5px;
    }
    .cursor_pointer {
      cursor: pointer;
      vertical-align: bottom;
      line-height: 28px;
    }
  }
  .el-icon-arrow-up:before {
    position: relative;
    top: -6px;
  }
  input.el-input__inner {
      line-height: 28px;
  }
}
</style>

