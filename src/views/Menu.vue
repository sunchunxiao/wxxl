<template>
  <el-menu
    id="menu"
    :default-active="activePath"
    router>
    <!-- <el-menu-item
      class="home"
      index="/home"
      @click="home">
      <img
        class="menu_icon"
        src="../assets/3.png">
      <span slot="title">首页</span>
    </el-menu-item> -->
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
        <!-- <template v-for="itm in item.children">
          <el-menu-item
            :index="`${item.path}${itm.path}`"
            :key="`${item.path}${itm.path}`">
            <span class="sub-text">
              <span class="dot" /> {{ itm.title }}
            </span>
          </el-menu-item>
        </template> -->
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
const MENUDATA = [
    {
        title: "首页",
        path: "/home",
        icon: "3.png",
        children: [
            {
                title: "外部评估",
                path: "/external",
                // icon: "3.png",
                children:[
                    {
                        title: "基本竞争力",
                        path: "/sales"
                    },
                    {
                        title: "持续竞争力",
                        path: "/profit"
                    },
                    {
                        title: "核心竞争力",
                        path: "/core"
                    },
                    {
                        title: "品牌价值",
                        path: "/equity"
                    },
                ]
            },
            {
                title: "内部评估",
                path: "/insideExternal",
                // icon: "4.png",
                children:[
                    {
                        title: "盈利空间",
                        path: "/profitSpace"
                    },
                    {
                        title: "盈利能力",
                        path: "/profitability"
                    },
                    {
                        title: "支付能力",
                        path: "/pay"
                    }
                ]
            },
        ]
    },
    {
        title: "六项基础引擎",
        path: "/sixBasicsEngine",
        icon: "5.png",
        children:[
            {
                title: "产品效率",
                path: "/product",
                icon: "4.png",
                children: [
                    {
                        title: "全景分析",
                        path: "/overview"
                    },
                    {
                        title: "产品对比",
                        path: "/contrast"
                    },
                    {
                        title: "策略优化",
                        path: "/optimization"
                    },
                    {
                        title: "策略跟踪",
                        path: "/track"
                    }
                ]
            },
            {
                title: "组织效率",
                path: "/organization",
                icon: "5.png",
                children: [
                    {
                        title: "全景分析",
                        path: "/overview"
                    },
                    {
                        title: "组织对比",
                        path: "/contrast"
                    },
                    {
                        title: "策略优化",
                        path: "/optimization"
                    },
                    {
                        title: "策略跟踪",
                        path: "/track"
                    }
                ]
            },
            {
                title: "资金效率",
                path: "/fund",
                icon: "7.png",
                children: [
                    {
                        title: "全景分析",
                        path: "/overview"
                    },
                    {
                        title: "资金对比",
                        path: "/contrast"
                    },
                    {
                        title: "策略优化",
                        path: "/optimization"
                    },
                    {
                        title: "策略跟踪",
                        path: "/track"
                    }
                ]
            },
            {
                title: "渠道效率",
                path: "/channel",
                icon: "8.png",
                children: [
                    {
                        title: "全景分析",
                        path: "/overview"
                    },
                    {
                        title: "渠道对比",
                        path: "/contrast"
                    },
                    {
                        title: "策略优化",
                        path: "/optimization"
                    },
                    {
                        title: "策略跟踪",
                        path: "/track"
                    }
                ]
            },
            {
                title: "客户效率",
                path: "/customer",
                icon: "6.png",
                children: [
                    {
                        title: "全景分析",
                        path: "/overview"
                    },
                    {
                        title: "客户对比",
                        path: "/contrast"
                    },
                    {
                        title: "策略优化",
                        path: "/optimization"
                    },
                    {
                        title: "策略跟踪",
                        path: "/track"
                    }
                ]
            },
            {
                title: "供应链效率",
                path: "/supplyChain",
                icon: "7.png",
                children: [
                    {
                        title: "全景分析",
                        path: "/overview"
                    },
                    {
                        title: "对比分析",
                        path: "/contrast"
                    },
                    {
                        title: "策略优化",
                        path: "/optimization"
                    },
                    {
                        title: "策略跟踪",
                        path: "/track"
                    }
                ]
            },
        ]
    },
    {
        title: "三大应用场景",
        path: "/applyScene",
        icon: "6.png",
        children:[
            {
                title: "绩效管理",
                path: "/manage",
                icon: "4.png",
                children: [
                    {
                        title: "公司内部绩效管理",
                        path: "/companyInsideManage/overview"
                    },
                    {
                        title: "外部合作绩效管理",
                        path: "/companyOutsideManage/overview"
                    }
                ]
            },
            {
                title: "计划",
                path: "/plan",
                icon: "5.png",
                children: [
                    {
                        title: "货品计划",
                        path: "/overview"
                    }
                ]
            },
            {
                title: "预算",
                path: "/budget",
                icon: "7.png",
                children: [
                    {
                        title: "货品预算",
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
        // home() {
        //     this.$router.push('/home');
        // },
        getActivePath(fullPath) {
            let activePath;
            activePath = "/home";
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
$subtitle-font-size: 14px;
$scale: 1.5;
#menu {
    width: 100%;
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
        margin: 0 12px 0 -5px;
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
        .el-submenu__title {
            border-left: 5px solid $bgcolor;
            i {
                margin-right: 5px;
            }
        }
    }
    >.el-submenu.is-active {
        >.el-submenu__title {
            border-left: 5px solid $border-color-active;
            background: $bg-color-active;
        }
    }
    >.el-menu-item {
        border-left: 5px solid $bgcolor;
        color: $white;
        &.is-active {
            border-left: 5px solid $border-color-active;
        }
    }
    .el-submenu .el-menu-item {
        height: $menu-item-height;
        line-height: $menu-item-height;
        background-color: $bgcolor;
        color: $white;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        padding: 0 0 0 35px !important;
        &.is-active {
            background-color: $bg-color-active;
            border-color: #7F7F7F;
        }
        .sub-text {
            font-size: $subtitle-font-size;
            padding: 2px 30px;
            border-radius: 10px;
            .dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: relative;
                left: -8px;
                top: -1px;
                background-color: #fff;
            }
        }
    }
}
// arrow
.el-menu i.el-submenu__icon-arrow {
    color: $white;
    font-size: 18px;
    font-weight: bold;
}
</style>

