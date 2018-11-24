<template>
    <el-menu @select="select"
             :default-active="activePath"
             router
             :collapse="isCollapse">
        <!-- <el-menu-item
      :class="{homeBac:home_bac}"
      index="/home">
      <img 
        class="menu_icon" 
        :src="require(`../assets/3.png`)" 
      >
      <span 
        class="home"
        style="color:#fff" 
        slot="title">首页</span>
    </el-menu-item> -->
        <!-- <template >
      <div 
        :class="{homeBac:home_bac}"
        class="home"
        @click="home">首页</div>
    </template> -->
        <template v-for="item in menuData">
            <el-submenu :index="item.path"
                        :key="item.path">
                <template slot="title">
                    <img class="menu_icon"
                         :src="require(`../assets/${item.icon}`)"
                         :alt="item.icon">
                    <span slot="title">{{ item.title }}</span>
                </template>
                <template v-for="itm in item.children">
                    <el-menu-item :index="`${item.path}${itm.path}`"
                                  :key="`${item.path}${itm.path}`">
                        <span class="sub-text">
                            <span class="dot" /> {{ itm.title }}
                        </span>
                    </el-menu-item>
                </template>
            </el-submenu>
        </template>

    </el-menu>
</template>

<script>
// TODO: icon
const MENUDATA = [{
    title: '产品效率',
    path: '/product',
    icon: '4.png',
    children: [{
        title: '全景分析',
        path: '/overview'
    }, {
        title: '产品对比',
        path: '/contrast'
    }, {
        title: '策略优化',
        path: '/optimization'
    }, {
        title: '策略跟踪',
        path: '/track'
    }]
}, {
    title: '组织效率',
    path: '/organization',
    icon: '5.png',
    children: [{
        title: '全景分析',
        path: '/overview'
    }, {
        title: '组织对比',
        path: '/contrast'
    }, {
        title: '策略优化',
        path: '/optimization'
    }, {
        title: '策略跟踪',
        path: '/track'
    }]
}, {
    title: '客户效率',
    path: '/customer',
    icon: '6.png',
    children: [{
        title: '全景分析',
        path: '/overview'
    }, {
        title: '客户对比',
        path: '/contrast'
    }, {
        title: '策略优化',
        path: '/optimization'
    }, {
        title: '策略跟踪',
        path: '/track'
    }]
}, {
    title: '资金效率',
    path: '/fund',
    icon: '7.png',
    children: [{
        title: '全景分析',
        path: '/overview'
    }, {
        title: '资金对比',
        path: '/contrast'
    }, {
        title: '策略优化',
        path: '/optimization'
    }, {
        title: '策略跟踪',
        path: '/track'
    }]
}, {
    title: '渠道效率',
    path: '/channel',
    icon: '8.png',
    children: [{
        title: '全景分析',
        path: '/overview'
    }, {
        title: '渠道对比',
        path: '/contrast'
    }, {
        title: '策略优化',
        path: '/optimization'
    }, {
        title: '策略跟踪',
        path: '/track'
    }]
}];
export default {
    props: {
        isCollapse: Boolean
    },
    data () {
        return {
            menuData: MENUDATA,
            activePath: '/home',
            path: '/home',
            home_bac: false,
            val: ''
        };
    },
    mounted () {
        this.activePath = this.$route.fullPath;
        // this.select();
    },

    methods: {
        select (val) {
            this.val = val;
            // return this.val;
        },

    },
};
</script>

<style lang="scss">
$bgcolor: #224e6b;
$white: #fff;
$bg-color-active: #26354c;
$border-color-active: #16abe3;

$subtitle-height: 60px;
$menu-item-height: 33px;
$title-font-size: 18px;
$subtitle-font-size: 16px;
$scale: 1.8;

// .index_link {
//     padding: 20px 25px;
//     font-size: $title-font-size;
//     color: #2d9dcb;
//     margin: 20px 15px;
//     border-top: 1px solid #618094;
//     border-bottom: 1px solid #618094;
//     img {
//         display: inline-block;
//         vertical-align: bottom;
//         margin-right: 10px;
//     }
// }
.el-menu-item:focus,
.el-menu-item {
    background-color: rgba(64, 158, 255, 0.2);
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
    margin: 0 10px 0 0;
}

.el-menu-item {
    border-left: 5px solid $bgcolor;
    color: $white;
}

ul.el-menu {
    background-color: $bgcolor;
    border-right: none;
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
                margin-right: 15px;
            }
        }
    }

    .el-submenu.is-active {
        .el-submenu__title {
            border-left: 5px solid $border-color-active;
            background: $bg-color-active;
        }
    }

    .el-submenu .el-menu-item {
        height: $menu-item-height;
        line-height: $menu-item-height;
        background-color: $bgcolor;
        color: $white;
        padding: 0 0 0 50px !important;
        border-left: 5px solid $bgcolor;
        .sub-text {
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
                background-color: $border-color-active;
            }
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
        color: $white;
        transform: scale($scale);
    }
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
        transform: rotateZ(180deg) scale($scale);
    }
}
</style>

