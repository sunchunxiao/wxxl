<template>
  <el-form
    class="filter"
    ref="form"
    :model="form"
    inline
    label-width="100px"
    size="mini">
    <div>
      <el-form-item label="货品季节类型">
        <el-select
          v-model="form.season"
          @change="handleChange"
          style="width:100px;">
          <template v-for="s in formData.seasons">
            <el-option
              :label="s"
              :value="s"
              :key="s" />
          </template>
        </el-select>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="货品属性类型">
        <el-select
          v-model="form.property"
          @change="handleChange"
          style="width:100px;">
          <template v-for="p in formData.properties">
            <el-option
              :label="p"
              :value="p"
              :key="p" />
          </template>
        </el-select>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="货品进度类型">
        <el-select
          v-model="form.progress"
          @change="handleChange"
          style="width:100px;">
          <template v-for="p in formData.progresses">
            <el-option
              :label="p"
              :value="p"
              :key="p" />
          </template>
        </el-select>
      </el-form-item>
    </div>
    <div class="tips">
      <el-form-item
        label="实时更新(数据截止到 2019.10.14 18:00)"
        label-width="350px" />
    </div>
  </el-form>
</template>

<script>
export default {
    components: {},
    data () {
        return {
            form: {
                season:'',
                property:'',
                progress:'',
            },
        };
    },
    props: {
        formData:Object,
        // seasons:Array,
        // properties:Array,
        // progresses:Array,
    },
    mounted () {
        // console.log(222,this.form.season);
    },
    computed: {},
    watch: {
        formData:{
            handler: function() {
                this.form.season = this.formData.seasons[0];
                this.form.property = this.formData.properties[0];
                this.form.progress = this.formData.progresses[0];
                this.handleChange(this.form);
                // this.handleChange(val);
            },
            deep: true
        },
    },
    methods: {
        handleChange () {
            this.$emit('change',this.form);
        },
    }
};
</script>

<style lang="scss">
    .filter {
        display: flex;
    }
    .tips {
        position:absolute;
        right:0;
    }
    .el-form-item__label {
        color: #cecaca;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
        margin-bottom: 0;
    }
</style>
