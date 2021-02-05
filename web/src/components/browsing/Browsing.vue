<template>
    <div id="browsing">
        <el-card class="Bulletin-board">
            <div class="board-header">
                <span>随便看看</span>
            </div>
            <div class="board-main">
                <div class="sidebar-item" v-for="(item, index) in items">
                    <img class="sidebar-img" :src="item.icon" alt="" />
                    <div class="sidebar-rand-info">
                        <div class="sidebar-rand-date">
                            <i>{{item.datetime | playTimeFormat}}</i>
                        </div>
                        <a class="sidebar-rand-title" href="">{{item.title}}</a>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: []
        };
    },
    created() {
        this.getArticleList();
    },
    methods: {
        async getArticleList() {
            const { data: res } = await this.$http2.get('/rest/articles');
            // 洗牌随机获取3篇文章
            this.items = this.utils.randSolt(res, 3);
        }
    },
};
</script>

<style lang="scss">
#browsing {
    width: 300px;
}
.sidebar-item {
    height: 7rem;
    position: relative;
    margin-top: 0.625rem;

    .sidebar-img {
        object-fit: cover;
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: 1em;
    }
    .sidebar-rand-info {
        z-index: 1;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        width: 100%;
        height: 4rem;
        padding: 0.5rem;
        border-radius: 1em;
        .sidebar-rand-date {
            color: #fff;
        }
        .sidebar-rand-title {
            color: #fff;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            text-decoration: none;
        }
    }
}

</style>
