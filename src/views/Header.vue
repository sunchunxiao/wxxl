<template>
  <div :class="{header: true, header_collapse: isCollapse}">
    <div class="tip">
      欢迎您, <span class="blue">Stephen</span> ! 请开始处理您的业务, 祝您工作愉快.
      <img src="../assets/header.png" >
    </div>
  </div>
</template>

<script>
export default {
    props: {
        isCollapse: Boolean
    }
};
</script>

<style lang="scss" scoped>
.header {
    width: calc(100% - 200px);
    height: 60px;
    line-height: 60px;
    padding-right: 50px;
    position: fixed;
    z-index: 999;
    color: #858585;
    background: #fff;
    .tip {
        float: right;
        margin-right: 50px;
        .blue {
            color: #2d90b0;
            font-weight: bold;
        }
        img {
            position: relative;
            top: 10px;
            left: 10px;
        }
    }
}
.header_collapse {
    width: calc(100% - 64px);
}
</style>
