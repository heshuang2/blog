<template>
    <div class="search">
        <el-input
            placeholder="请输入要搜索的歌曲"
            v-model="input"
            class="input-with-select"
            clearable
            @change="searchMusic"
            @clear="clearInput"
        >
            <el-button slot="append" icon="el-icon-search" @click="searchMusic"></el-button>
        </el-input>
        <el-card class="aplayer-card">
            <ol ref="aplayer" class="aplayer-card-item" v-if="isSearch">
                <li
                    class="aplayer-list-light"
                    v-for="(item, index) in newMusicList"
                    :key="index"
                    @click="getMusic(item.id)"
                >
                    <span class="aplayer-list-cur"></span>
                    <span class="aplayer-list-index">{{ index + 1 }}</span>
                    <span class="aplayer-list-title">{{ item.name | beautySub(10)}}</span>
                    <span class="aplayer-list-author">{{ item.song.artists[0].name }}</span>
                </li>
            </ol>
            <ol
                ref="aplayer"
                class="aplayer-card-item"
                v-else
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled"
            >
                <li
                    class="aplayer-list-light"
                    v-for="(item, index) in goodssongs"
                    :key="index"
                    @click="getMusic(item.id)"
                >
                    <span class="aplayer-list-cur"></span>
                    <span class="aplayer-list-index">{{ index + 1 }}</span>
                    <span class="aplayer-list-title">{{ item.name | beautySub(10)}}</span>
                    <span class="aplayer-list-author">{{ item.artists[0].name }}</span>
                </li>
                <li v-if="loading" class="aplayer-list-light loading-box">
                    <span class="loading el-icon-loading"></span>
                </li>
            </ol>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'search',
    data() {
        return {
            input: '',
            newMusicList: [],
            isSearch: true,
            pageNum: 1,
            goodssongs: [],
            loading: false,
            // 监听input是否改变
            isInput: true,
            count: 0
        };
    },
    created() {
        this.getsongsList();
    },
    mounted() {
    },
    computed: {
        noMore() {
            if (this.count != 0 && this.goodssongs != 0) {
                return this.goodssongs.length >= this.count;
            }
        },
        disabled() {
            return this.loading || this.noMore;
        }
    },
    watch: {},
    methods: {
        async getsongsList() {
            const { data: res } = await this.$http1.get('personalized/newsong');
            this.newMusicList = res.result;
        },
        // 向父组件传参
        getMusic(id) {
            console.log(id);
            this.$bus.$emit('musicId', id);
        },
        // 搜索音乐
        searchMusic() {
            if (this.input === '') {
                this.$message.warning('请输入要搜索的内容');
            } else {
                this.pageNum = 1;
                this.isSearch = false;
                this.isInput = true;
                this.$refs.aplayer.scrollTop = 0;
                this.getMusicList();
            }
        },
        // 获取音乐
        async getMusicList() {
            const { data: res } = await this.$http1.get('search', {
                params: {
                    keywords: this.input,
                    type: 1,
                    limit: 20,
                    offset: (this.pageNum - 1) * 20
                }
            });
            //  console.log(res);
            if (this.isInput) {
                this.count = res.result.songCount;
                this.goodssongs = res.result.songs;
            } else {
                this.goodssongs.push(...res.result.songs);
                // console.log(this.goodssongs);
            }
        },
        load() {
            this.isInput = false;
            this.loading = true;
            setTimeout(() => {
                this.pageNum += 1;
                this.getMusicList();
                this.loading = false;
            }, 500);
        },
        // 清空输入框
        clearInput() {
            this.isSearch = true;
            this.$refs.aplayer.scrollTop = 0;
        }
    }
};
</script>

<style lang="scss">
.search {
    margin-top: 5px;
    
}

.search .el-input__inner {
    background-color: transparent;
    color: #000;
    border: 2px solid rgb(216, 195, 11);
     height: 36px !important;
}
.el-input-group__append {
    background-color: transparent !important;
    color: rgb(216, 195, 11) !important;
    border: 2px solid rgb(216, 195, 11) !important;
}
.aplayer-card {
    background-color: transparent !important;
    color: #000 !important;
    font-weight: 500;
    border: 1px solid rgb(216, 195, 11) !important;
    border-radius: 0 0 1em 1em !important;
    border-top: none !important;
    margin-top: 0 !important;
}
.aplayer-list ol li.aplayer-list-light .aplayer-list-cur {
    display: inline-block;
}
.aplayer-card-item {
    padding: 0;
    max-height: 250px;
    overflow-y: auto;
    .aplayer-list-light {
        box-sizing: border-box;
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        font-size: 13px;
        border-top: 1px solid #000;
        cursor: pointer;
        transition: all 0.2s ease;
        overflow: hidden;
        margin: 0;
        width: 100%;
    }
    .aplayer-list-light:hover {
        background-color: #000;
        * {
            color: rgb(216, 195, 11);
        }
    }
    .aplayer-list-cur {
        /* display: none; */
        width: 3px;
        height: 22px;
        position: absolute;
        left: 0;
        top: 5px;
        cursor: pointer;
    }
    .aplayer-list-index {
        color: #000;
        margin-right: 12px;
        cursor: pointer;
    }
    .aplayer-list-title {
        box-sizing: border-box;
        position: absolute;
        cursor: pointer;
        text-align: left;
        width: 70%;
    }
    .aplayer-list-author {
        color: #000;
        float: right;
        cursor: pointer;
    }
    .loading-box {
        text-align: center;
        font-size: 20px;
    }
}
.aplayer-card-item::-webkit-scrollbar {
    width: 5px;
}
.aplayer-card-item::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: transparent;
    border: 3px solid #ccc;
}
</style>
