<template>
  <div class="container">
    <Header :isCollapse="isCollapse" />
    <div class="container_wrap">
      <div :class="['left', {'left_collapse': isCollapse} ]">
        <div
          class="collapse_btn"
          @click="handleClick">
          <img
            v-if="isCollapse"
            src="../assets/collapse1.png"
            alt="">
          <img
            v-else
            src="../assets/collapse.png"
            alt="">
        </div>
        <!-- 右侧菜单栏 -->
        <div class="menu_container">
          <Menu :isCollapse="isCollapse" />
        </div>
      </div>
      <div :class="['right', {'right_collapse': isCollapse} ]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from './Menu';
import Header from './Header';

export default {
    name: 'Home',
    components: {
        Menu,
        Header
    },
    data () {
        return {
            isCollapse: false,
        };
    },
    methods: {
        home () {
            this.$router.push('/home');
        },
        handleClick () {
            this.isCollapse = !this.isCollapse;
        }
    }
};
</script>

<style lang="scss" scoped>
// $bgcolor: #224e6b;
$bgcolor:#333;
$width: 200px;
$width_collapse: 55px;

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .container_wrap{
        display: flex;
        flex: 1;
        .left {
            flex-shrink: 0;
            width: $width;
            height: 100%;
            z-index: 2;
            overflow: hidden;
            background-color: $bgcolor;
            transition: width 0.3s;
            .collapse_btn {
                background-color: rgb(80, 75, 75);
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: left;
                padding-left: 16px;
                cursor: pointer;
                img {
                    transition: all 0.3s;
                }
                // .rotate {
                //     transform: rotateY(180deg);
                // }
            }
            .menu_container {
                width: 217px;
                height: calc(100vh - 95px);
                overflow-y: scroll;
                overflow-x: hidden;
            }
            .logo1 {
                padding: 30px 0 15px 25px;
            }
            .logo1_collapse {
                padding: 30px 0 15px 12px;
            }
            .logo2 {
                text-align: center;
            }
        }
        .right {
            height: 100%;
            flex: 1;
            display: flex;
            background: #fff;
            overflow: auto;
            >div:first-child {
                flex: 1;
                overflow-x: auto;
                overflow-y: hidden;
                min-width: 1200px;
            }
        }
        .left_collapse {
            width: $width_collapse;
        }
    }
}
</style>
