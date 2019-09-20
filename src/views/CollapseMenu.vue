<template>
  <el-menu
    id="collapse-menu"
    :default-active="activePath"
    router>
    <template v-for="item in menuData">
      <el-submenu
        :index="item.path"
        :key="item.path">
        <template slot="title">
          <img
            v-if="item.icon"
            class="menu_icon"
            :src="require(`../assets/${item.icon}`)"
            :alt="item.icon">
          <span slot="title">{{ item.title }}</span>
        </template>
        <template v-for="ite in item.children">
          <el-submenu
            class="aaa"
            :index="ite.path"
            :key="ite.path">
            <template slot="title">
              <img
                v-if="ite.icon"
                class="menu_icon"
                :src="require(`../assets/${ite.icon}`)"
                :alt="ite.icon">
              <span slot="title">{{ ite.title }}</span>
            </template>
            <template
              v-for="itm in ite.children">
              <el-menu-item
                :index="`${item.path}${ite.path}${itm.path}`"
                :key="`${item.path}${ite.path}${itm.path}`">
                <span class="sub-text">
                  <span class="dot" /> {{ itm.title }}
                </span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
const MENUDATA = [
    {
        title: "首页",
        path: "/home",
        // icon: "3.png",
        children: [
            {
                title: "外",
                path: "/external",
                icon: "4.png",
                children:[
                    {
                        title: "基",
                        path: "/sales"
                    },
                    {
                        title: "持",
                        path: "/profit"
                    },
                    {
                        title: "核",
                        path: "/core"
                    },
                    {
                        title: "牌",
                        path: "/equity"
                    },
                ]
            },
            {
                title: "内",
                path: "/insideExternal",
                icon: "5.png",
                children:[
                    {
                        title: "盈",
                        path: "/profitSpace"
                    },
                    {
                        title: "利",
                        path: "/profitability"
                    },
                    {
                        title: "支",
                        path: "/pay"
                    }
                ]
            },
        ]
    },
    {
        title: "六项",
        // icon: "2.png",
        path: "/sixBasicsEngine",
        children:[
            {
                title: "产",
                path: "/product",
                icon: "4.png",
                children: [
                    {
                        title: "全",
                        path: "/overview"
                    },
                    {
                        title: "对",
                        path: "/contrast"
                    },
                    {
                        title: "策",
                        path: "/optimization"
                    },
                    {
                        title: "略",
                        path: "/track"
                    }
                ]
            },
            {
                title: "组",
                path: "/organization",
                icon: "5.png",
                children: [
                    {
                        title: "全",
                        path: "/overview"
                    },
                    {
                        title: "组",
                        path: "/contrast"
                    },
                    {
                        title: "策",
                        path: "/optimization"
                    },
                    {
                        title: "略",
                        path: "/track"
                    }
                ]
            },
            {
                title: "资",
                path: "/fund",
                icon: "7.png",
                children: [
                    {
                        title: "全",
                        path: "/overview"
                    },
                    {
                        title: "资",
                        path: "/contrast"
                    },
                    {
                        title: "策",
                        path: "/optimization"
                    },
                    {
                        title: "策",
                        path: "/track"
                    }
                ]
            },
            {
                title: "渠",
                path: "/channel",
                icon: "8.png",
                children: [
                    {
                        title: "全",
                        path: "/overview"
                    },
                    {
                        title: "渠",
                        path: "/contrast"
                    },
                    {
                        title: "策",
                        path: "/optimization"
                    },
                    {
                        title: "策",
                        path: "/track"
                    }
                ]
            },
            {
                title: "客",
                path: "/customer",
                icon: "6.png",
                children: [
                    {
                        title: "全",
                        path: "/overview"
                    },
                    {
                        title: "客",
                        path: "/contrast"
                    },
                    {
                        title: "策",
                        path: "/optimization"
                    },
                    {
                        title: "略",
                        path: "/track"
                    }
                ]
            },
            {
                title: "供",
                path: "/supplyChain",
                icon: "4.png",
                children: [
                    {
                        title: "全",
                        path: "/overview"
                    },
                    {
                        title: "对",
                        path: "/contrast"
                    },
                    {
                        title: "策",
                        path: "/optimization"
                    },
                    {
                        title: "略",
                        path: "/track"
                    }
                ]
            },
        ]
    },
    {
        title: "场景",
        path: "/applyScene",
        // icon: "4.png",
        children:[
            {
                title: "绩",
                path: "/manage",
                icon: "4.png",
                children: [
                    {
                        title: "内",
                        path: "/companyInsideManage/overview"
                    },
                    {
                        title: "外",
                        path: "/companyOutsideManage/overview"
                    }
                ]
            },
            {
                title: "计",
                path: "/plan",
                icon: "5.png",
                children: [
                    {
                        title: "货品",
                        path: "/overview"
                    }
                ]
            },
            {
                title: "预",
                path: "/budget",
                icon: "7.png",
                children: [
                    {
                        title: "货品",
                        path: "/overview"
                    }
                ]
            },
        ]
    },
];

export default {
    data () {
        return {
            menuData: MENUDATA
        };
    },
    computed: {
        activePath() {
            return this.getActivePath(this.$route.fullPath);
        }
    },
    methods:{
        home() {
            this.$router.push('/home');
        },
        getActivePath(fullPath) {
            let activePath;
            if (fullPath.includes("/overview")) {
                activePath = fullPath.split("/overview")[0] + "/overview";
            } else if (fullPath.includes("/core")) {
                activePath = fullPath.split("/core")[0] + "/core";
            } else {
                activePath = fullPath;
            }
            return activePath;
        }
    }
};
</script>

<style lang="scss">
$bgcolor:#333;
$white: #fff;
$bg-color-active: #1a1a1a;
$border-color-active: #F2C811;

$subtitle-height: 50px;
$menu-item-height: 38px;
$title-font-size: 18px;
$subtitle-font-size: 16px;
$scale: 1.8;
#collapse-menu {
    width: 70px;
    overflow: hidden;
    background-color: $bgcolor;
    border-right: none;
    .home {
        font-size: 18px
    }
    .el-menu-item:focus,
    .el-menu-item {
        background-color: #333;
    }
    .el-menu-item:focus,
    .el-menu-item:hover {
        background-color: rgba(38, 53, 76, 0.2);
        color: $white;
    }
    .el-menu-item:focus,
    .el-menu-item.is-active {
        color: $white;
        background-color: $bg-color-active;
    }
    .menu_icon {
        margin: 0 10px 0 -5px;
    }
    .el-menu-item, .el-submenu__title {
        height: $subtitle-height;
        line-height: $subtitle-height;
    }
    >.el-menu-item {
        border-left: 5px solid $bgcolor;
        color: $white;
        &.is-active {
            border-left: 5px solid $border-color-active;
        }
    }
    .el-submenu__title {
        height: $subtitle-height;
        line-height: $subtitle-height;
        font-size: $title-font-size;
        background-color: $bgcolor;
        span {
            color: $white;
        }
    }
    .el-submenu {
        >.el-submenu__title {
            border-left: 5px solid $bgcolor;
            padding-left: 10px!important;

            i {
                margin-right: 15px;
            }
        }
    }
    >.el-submenu.is-active {
        >.el-submenu__title {
            border-left: 5px solid $border-color-active;
            background: $bg-color-active;
        }
    }
    // .el-submenu__title{
    //     padding-left: 10px;
    // }
    .el-submenu .el-menu-item {
        height: $menu-item-height;
        line-height: $menu-item-height;
        background-color: $bgcolor;
        color: $white;
        font-size: $subtitle-font-size;
        padding: 0 0 0 0 !important;
        .sub-text {
            display: block;
            padding-left: 20px;
        }
    }
    .el-menu-item.is-active {
        color: $white;
        .sub-text {
            background-color: $bg-color-active;
        }
    }
    // arrow
    .el-submenu__icon-arrow {
        display: none;
    }
}
</style>
