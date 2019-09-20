<template>
  <div :class="{header: true, header_collapse: isCollapse}">
    <div class="greet">
      <!-- <img
        class="greet_img"
        src="../assets/logo2.png"
        alt=""> -->
      <!-- <img
        src="../assets/logo1.png"
        alt="六项效率"> -->
      <span class="greet_six">6</span>
      <span class="greet_title">六项效率</span>
      <template v-for="(item, index) in path">
        <span
          style="color: #fff"
          :key="item">{{ item }}</span>
        <span
          :key="'icon'+item"
          class="el-icon-arrow-right greet_icon"
          v-if="index!=path.length-1" />
      </template>
      <div class="logoutMenu">
        <el-dropdown class="">
          <span class="el-dropdown-link">
            <img
              style="padding-right:10px"
              src="../assets/13.png">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-button
              @click="logout"
              type="text">退出登录</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsername, removeToken } from 'utils/auth';

export default {
    props: {
        isCollapse: Boolean
    },
    computed:{
        path() {
            if (this.$route.meta.path.constructor == Object) {
                let name = this.$route.params.name;
                return this.$route.meta.path[name];
            } else if (Array.isArray(this.$route.meta.path)) {
                return this.$route.meta.path;
            }
            return [];
        }
    },
    data() {
        return {
            username: getUsername()
        };
    },
    mounted() {
        // console.log(this.$route.meta.path[this.$route.params.name], this.$route.params);
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
	width: 100%;
    height: 55px;
    line-height: 55px;
    z-index: 100;
    color: #858585;
    background: #2d2929;
    .greet {
        display: flex;
        align-items: center;
        height: 55px;
        .greet_six {
            width: 55px;
            height: 55px;
            text-align: center;
            display: inline-block;
            color: #fff;
            font-size:50px;
            font-weight:bolder;
            background-color: rgb(240,192,19);
        }
        .greet_title {
            color:rgb(240,192,19);
            font-weight:bolder;
            font-size:34px;
            margin-left: 10px;
            margin-right: 20px;
        }
        .greet_icon{
            margin: -3px 5px 0 5px;
            color: #fff;
            font-weight: bold;
        }
        .greet_img {
            width: 55px;
        }
        .blue {
            color: #2d90b0;
            font-weight: bold;
        }
        .logoutMenu {
            // margin-left: 20px;
            flex: 1;
            text-align: right;
            .el-dropdown{
                height: 40px;
                margin-top: 20px;
            }
        }
    }
}
.header_collapse {
    width:100%;
}
</style>
