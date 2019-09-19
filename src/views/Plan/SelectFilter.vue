<template>
  <el-form
    class="search_bar"
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
          <template v-for="s in seasons">
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
          <template v-for="p in properties">
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
          <template v-for="p in progresses">
            <el-option
              :label="p"
              :value="p"
              :key="p" />
          </template>
        </el-select>
      </el-form-item>
    </div>
    <div class="tip">
      <el-form-item
        label="实时更新(数据截止到 2019.9.20 18:00)"
        label-width="350px" />
    </div>
  </el-form>
</template>

<script>
export default {
    components: {},
    data () {
        return {
            seasons: ['春季', '夏季', '秋季', '冬季'],//货品季节类型
            properties: ['全部', '类目一', '类目二', '类目三'],//货品属性类型
            progresses:['样品', '下单', '到货'],//货品进度类型
            form: {
                season:'',
                property:'',
                progress:'',
            },
        };
    },
    props: {},
    created () {
        this.form.season = this.seasons[0];
        this.form.property = this.properties[0];
        this.form.progress = this.progresses[0];
        this.handleChange(this.form);
    },
    computed: {},
    watch: {},
    methods: {
        handleChange () {
            this.$emit('change',this.form);
        },
    }
};
</script>

<style lang="scss">
    .search_bar {
        display: flex;
    }
    .tip{
        position:absolute;
        right:0;
    }
    .el-form-item__label{
        color: #cecaca;
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 0;
    }
</style>
