<template>
  <div class="index_container">
    <el-carousel
      :interval="3000"
      arrow="always">
      <el-carousel-item
        v-for="item in 3"
        :key="item">
        <img
          :src="require(`../assets/${item}.jpg`)"
          alt="">
      </el-carousel-item>
    </el-carousel>
    <div class="header_container">
      <div class="header">
        <a href="http://www.gyxr.cn">
          <img
            class="logo"
            src="http://img2.58tu.com/sitepublic/images/wuxiangxiaolv/logo.png"
            alt="logo">
        </a>
        <ul class="nav">
          <li>
            <a href="javascript:void(0)">咨询业务介绍</a>
            <div class="sub_nav">
              <a href="http://www.gyxr.cn/ProStruct.html">
                <span class="sub_nav_title">业务结构与服务领域</span>
                <span class="small">Business & service</span>
              </a>
              <a href="http://www.gyxr.cn/ProContent.html">
                <span class="sub_nav_title">业务内容</span>
                <span class="small">Business content</span>
              </a>
              <a href="http://www.gyxr.cn/ProProcess.html">
                <span class="sub_nav_title">服务流程</span>
                <span class="small">Service process</span>
              </a>
            </div>
          </li>
          <li>
            <a href="http://www.gyxr.cn/Customes.html">客户展示</a>
          </li>
          <li>
            <a href="javascript:void(0)">企业信息</a>
            <div class="sub_nav">
              <a href="http://www.gyxr.cn/News.html">
                <span class="sub_nav_title">企业动态</span>
                <span class="small">Enterprise News</span>
              </a>
              <a href="http://www.gyxr.cn/Partner.html">
                <span class="sub_nav_title">合作伙伴</span>
                <span class="small">Our Partners</span>
              </a>
            </div>
          </li>
          <li>
            <a href="http://www.gyxr.cn/About_fzlc.html">关于我们</a>
            <div class="sub_nav">
              <a href="http://www.gyxr.cn/About_fzlc.html">
                <span class="sub_nav_title">发展历程</span>
                <span class="small">The development course</span>
              </a>
              <a href="http://www.gyxr.cn/About_fwln.html">
                <span class="sub_nav_title">服务理念</span>
                <span class="small">Service concept</span>
              </a>
              <a href="http://www.gyxr.cn/Team.html">
                <span class="sub_nav_title">团队介绍</span>
                <span class="small">Team Introduction</span>
              </a>
            </div>
          </li>
          <li>
            <a
              class="contact"
              href="http://www.gyxr.cn/ContactUs.html">联系我们</a>
          </li>
          <li>
            <a
              v-if="!token"
              href="/login">登录</a>
            <el-dropdown
              v-else
              size="medium">
              <a href="/home/external/sales">进入系统</a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    type="text"
                    @click="logout">退出登录</el-button></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, removeToken } from 'utils/auth';

export default {
    computed: {
        token() {
            return getToken();
        }
    },
    methods: {
        logout() {
            removeToken();
            this.$router.replace('/login');
        }
    }
};
</script>

<style lang="scss">
.index_container {
  height: 100%;
  position: relative;
  .el-carousel {
    height: 100%;
    .el-carousel__container {
      height: 100%;
      .el-carousel__item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .header_container {
    width: 100%;
    line-height: 40px;
    text-align: right;
    position: absolute;
    top: 0;
    z-index: 1000;
    a {
      text-decoration: none;
    }
  }
  .header_container .header {
    width: 96%;
    position: relative;
    margin: 20px auto 0 auto;
  }
  .header_container .header .logo {
    width: 200px;
    float: left;
    margin-top: 8px;
    margin-left: 65px;
  }
  .header_container .header .nav {
    height: 100%;
  }
  .header_container .header .nav li {
    display: inline-block;
    margin-right: 15px;
    padding: 0px 15px;
  }
  .header_container .header .nav li > a {
    font-size: 22px;
    color: #fff;
  }
  .header_container .header .nav li:hover > a {
    color: #158CB3;
  }
  .header_container .header .nav li:hover .sub_nav {
    display: block;
    background-color: #aaa;
  }
  .header_container .header .nav li .sub_nav {
    display: none;
    position: absolute;
    text-align: left;
    margin-left: -5px;
  }
  .header_container .header .nav li .sub_nav > a {
    color: black;
    display: block;
    padding: 2px 5px;
    border-left: 5px solid transparent;
    font-size: 16px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .header_container .header .nav li .sub_nav > a:hover {
    border-color: #158CB3;
    background: linear-gradient(to right, rgba(255,255,255,0.4) , rgba(255,255,255,0.05));
  }
  .header_container .header .nav li .sub_nav > a .sub_nav_title {
    display: block;
    height: 28px;
    line-height: 28px;
  }
  .header_container .header .nav li .sub_nav > a .small {
    display: block;
    height: 18px;
    line-height: 18px;
    font-size: 14px;
  }
  .el-dropdown {
    > a {
      font-size: 22px;
      color: #fff;
      &:hover {
        color: #158CB3;
      }
    }
  }
}

</style>
