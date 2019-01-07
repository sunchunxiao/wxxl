<template>
  <div :class="{header: true, header_collapse: isCollapse}">
    <div class="greet">
      <img
        class="greet_img"
        src="../assets/logo2.png"
        alt="五">
      <img
        src="../assets/logo1.png"
        alt="五项效率">
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
    mounted() {
        // console.log(this.$route.path);
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
        height: 55px;
        .greet_img {
            width: 55px;
            }
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
    width:100%;
}
</style>
