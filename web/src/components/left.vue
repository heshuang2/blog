<template>
    <div id="left">
        <div class="burl">
            <el-card class="Bulletin-board" shadow="hover">
                <div class="board-header">
                    <span>公告栏</span>
                </div>
                <div class="board-main">
                    <span class="">测试版本</span>
                </div>
            </el-card>
            <!-- <el-card shadow="hover">
                <el-menu default-active="1" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1" class="menu-span">
                        <i class="el-icon-menu"></i>
                        <span slot="title">文章列表</span>
                    </el-menu-item>
                    <el-menu-item index="2" class="menu-span">
                        <i class="el-icon-document"></i>
                        <span slot="title">我的项目</span>
                    </el-menu-item>
                    <el-menu-item index="3" class="menu-span">
                        <i class="el-icon-setting"></i>
                        <span slot="title">杂七杂八</span>
                    </el-menu-item>
                    <el-menu-item index="4" class="menu-span">
                        <i class="el-icon-setting"></i>
                        <span slot="title">联系我吧</span>
                    </el-menu-item>
                </el-menu>
            </el-card> -->
            <swiper-card></swiper-card>
            <new-message></new-message>
            <div ref="browsing">
                <browsing></browsing>
            </div>
        </div>
    </div>
</template>

<script>
import Browsing from './browsing/Browsing.vue';
import musicCard from './musicPlayerChildren/musicPlayer';
import NewMessage from './newMessage/newMessage.vue';
import SwiperCard from './swiperCard/SwiperCard.vue';

export default {
    components: {
        musicCard,
        SwiperCard,
        Browsing,
        NewMessage
    },
    mounted() {
        window.addEventListener('scroll', this.scrollHander, true);
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        // 监听页面滚动条滑动，实现吸顶效果
        scrollHander() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (this.$refs.browsing) {
                if (scrollTop >= 626) {
                    this.$refs.browsing.style.top = '50px';
                    this.$refs.browsing.style.position = 'fixed';
                } else {
                    // this.$refs.browsing.style.top = '';
                    this.$refs.browsing.style.position = '';
                }
            }
        }
    }
};
</script>

<style scoped>
.el-menu {
    background-color: transparent;
}
.el-menu:hover {
    background-color: transparent;
}
.el-menu--horizontal > .el-menu-item {
    height: 56px;
    width: 125px;
    line-height: 56px;
    font-weight: 600;
    /* color: #fff !important; */
    border-bottom: none;
}
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background-color: transparent;
}
.el-menu-item.is-active {
    border-bottom: none !important;
    font-size: 120%;
}

.el-menu.el-menu--horizontal {
    border-bottom: none;
}

.menu-span:hover {
    color: skyblue !important;
}
</style>
