<template>
  <div class="container">
    <div :class="['left', {'left_collapse': isCollapse} ]">
      <div :class="{logo1: !isCollapse,logo1_collapse: isCollapse}">
        <img 
          v-if="!isCollapse" 
          src="../assets/logo1.png" 
          alt="五项效率">
        <img 
          v-else 
          src="../assets/logo2.png" 
          alt="五">
      </div>
      <div class="logo2">
        <img 
          v-if="!isCollapse" 
          src="../assets/logo3.png" 
          alt="gyxr">
        <img 
          v-else 
          src="../assets/logo4.png" 
          alt="g">
      </div>
      <div 
        class="collapse_btn" 
        @click="handleClick">
        <img 
          :class="{'rotate': isCollapse}" 
          src="../assets/collapse.png" 
          alt="">
      </div>
      <div class="menu_container">
        <Menu :isCollapse="isCollapse" />
      </div>
    </div>
    <div :class="['right', {'right_collapse': isCollapse} ]">
      <Header :isCollapse="isCollapse" />
      <div class="content">
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
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    handleClick() {
      this.isCollapse = !this.isCollapse;
    }
  }

};
</script>

<style lang="scss" scoped>
$bgcolor: #224e6b;
$width: 200px;
$width_collapse: 64px;
.container {
  height: 100%;
  .left {
    width: $width;
    height: 100%;
    position: fixed;
    z-index: 2;
    overflow: hidden;
    background-color: $bgcolor;
    transition: width 0.3s;
    .collapse_btn {
      margin-top: 10px;
      padding: 5px 0;
      text-align: center;
      img {
        transition: all 0.3s;
      }
      .rotate {
        transform:rotateY(180deg);
      }
    }
    .menu_container {
      width: 215px;
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
    padding: 76px 16px 16px;
    height: calc(100% - 92px);
  }
}
</style>
