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
        <div class="menu_container">
          <Menu :isCollapse="isCollapse" />
        </div>
      </div>
      <div :class="['right', {'right_collapse': isCollapse} ]">
        <div class="content">
          <router-view />
        </div>
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
    .container_wrap{
        padding-top: 55px;
        height: calc(100% - 56px);
        .left {
            width: $width;
            height: 100%;
            position: fixed;
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
                height: calc(100vh - 245px);
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
            margin-left: $width;
            background: #eee;
        }
        .left_collapse {
            width: $width_collapse;
        }
        .right_collapse {
            margin-left: $width_collapse;
        }
        .content {
            padding: 0px 0px 16px;
            height: calc(100% - 100px);
            background-color: #eee;
        }
    }
}
</style>
