<template>
    <div id="left">
        <div class="flex-middle-between">
            <span class="title"></span>
        </div>
        <div class="burl">
            <div
                :class="this.$store.state.theme  ? 'bg-light card-border-white ' : 'bg-black text-white card-border-black'">
                <el-card class="Bulletin-board" shadow="hover">
                    <div class="board-header">
                        <span>公告栏</span>
                    </div>
                    <div class="board-main">
                        <span class="">测试版本</span>
                    </div>
                </el-card>
            </div>
            <div
                :class="this.$store.state.theme  ? 'bg-light card-border-white ' : 'bg-black text-white card-border-black'">
                <new-message></new-message>
            </div>
            <div ref="browsing"
                 :class="[ {is_fixed: isFixed},this.$store.state.theme  ? 'bg-light card-border-white' : 'bg-black text-white card-border-black']">
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
    data() {
        return {
            isFixed: false,
            offsetTop: 0,
            flag: false
        };
    },
    components: {
        musicCard,
        SwiperCard,
        Browsing,
        NewMessage
    },
    mounted() {
        window.addEventListener('scroll', this.scrollHander, true);
        this.$nextTick(() => {
            this.offsetTop = this.utils.getTop(this.$refs.browsing);
            console.log(this.offsetTop);
        });
    },
    activated() {
    },
    deactivated() {
        // window.removeEventListener('scroll', this.scrollHander, true);
    },
    methods: {
        // 监听页面滚动条滑动，实现吸顶效果
        scrollHander() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this.isFixed = scrollTop > this.offsetTop && this.$store.state.device ? true : false;
            // console.log(this.isFixed);
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
