<template>
  <div :class="{header: true, header_collapse: isCollapse}">
    <div class="greet">
      欢迎您, <span class="blue">{{ username }}</span> ! 请开始处理您的业务, 祝您工作愉快!
      <el-dropdown class="logoutMenu">
        <span class="el-dropdown-link">
          菜单<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><el-button 
            @click="logout" 
            type="text">退出登录</el-button></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { getUsername, removeToken } from 'utils/auth';

export default {
    props: {
        isCollapse: Boolean
    },
    data() {
        return {
            username: getUsername()
        };
    },
    methods: {
    logout() {
      removeToken();
      this.$router.replace('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
    width: calc(100% - 200px);
    min-width: 1000px;
    height: 60px;
    line-height: 60px;
    padding-right: 50px;
    position: fixed;
    z-index: 999;
    color: #858585;
    background: #fff;
    .greet {
        float: right;
        margin-right: 50px;
        .blue {
            color: #2d90b0;
            font-weight: bold;
        }
        .logoutMenu {
            margin-left: 20px;
        }
    }
}
.header_collapse {
    width: calc(100% - 64px);
}
</style>
