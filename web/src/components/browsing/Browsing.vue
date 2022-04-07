<template>
    <div id="browsing">
        <el-card class="Bulletin-board" >
            <div class="board-header font-a">
                <span>全部分类</span>
            </div>
            <div class="board-main">
                <div class="tag-border">
                    <span
                        class="tag-wrap"
                        v-for="(item, index) in this.$store.state.type"
                        :key="index"
                        @click="toTypeList(item.name)"
                    >
                        <span class="tag"
                            >{{ item.name }}
                            <span class="tag-num">[{{ $store.state.articles[item.name].length }}]</span>
                        </span>
                    </span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            typeList: {}
        };
    },
    mounted() {
    },
    methods: {
        toTypeList(key) {
            this.$router
                .push({
                    name: `type`,
                    params: {
                        type: key
                    }
                })
                .catch((err) => {
                    err;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
#browsing {
    position: relative;
    border-radius: 1rem;
}
.tag-border {
    // float: left;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    padding-top: 10px;
    .tag-wrap {
        cursor: pointer;
        .tag {
            // background: #fff;
            // color: rgb(216, 195, 11);
        }
        .tag-num {
            font-family: iconfont !important;
            font-size: 16px;
            font-weight: 500;
        }
    }
    .tag-wrap:hover {
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.9));
    }
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
