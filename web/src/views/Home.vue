<template>
    <div class="main" :class="this.$store.state.mobile ? 'bg-light' : ''">
        <swiper-card ref="swiper"></swiper-card>
        <div class="container main-body">
            <div class="center">
                <div v-if="!this.$store.state.device && !this.$store.state.mobile" class="type-card">
                    <browsing></browsing>
                </div>
                <div id="home">
                    <div class="flex-middle-between">
                        <span class="title">全部文章</span>
                    </div>
                    <div class="card-box">
                        <article-card v-if="!this.$store.state.mobile" :articles="articles"></article-card>
                        <article-card-h5 v-else :articles="articles"></article-card-h5>
                        <infinite-loading
                            infinite-scroll-disabled="busy"
                            @infinite="infiniteHandler"
                            ref="infiniteLoading"
                        >
                            <span slot="no-more"> 我们是有底线的 </span>
                        </infinite-loading>
                    </div>
                </div>
            </div>
            <left v-if="this.$store.state.device"></left>
        </div>
    </div>
</template>

<script>
import left from '../components/left';
import SwiperCard from '../components/swiperCard/SwiperCard.vue';
import InfiniteLoading from 'vue-infinite-loading';
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';
import ArticleCard from '../components/articleCard/ArticleCard.vue';
import Browsing from '../components/browsing/Browsing.vue';
import ArticleCardH5 from '../components/h5_components/articleCard_h5/articleCard_h5.vue';
export default {
    name: 'Home',
    data() {
        return {
            count: 0,
            articles: [],
            pageNum: 0,
            loading: true,
            busy: true,
            data: []
        };
    },
    components: {
        left,
        SwiperCard,
        InfiniteLoading,
        SvgIcon,
        ArticleCard,
        Browsing,
        ArticleCardH5
    },
    created() {
        this.getArticleList();
        this.utils.initializeFlag();
    },
    mounted() {},
    methods: {
        // 监听页面滚动条滑动
        async infiniteHandler($state) {
            if (this.busy) {
                const { data: res } = await this.$http2.get('/rest/comments');
                this.data = res;
            }
            this.busy = false;
            if (this.articles.length < this.data.length) {
                let articlesComments = this.data.slice(this.pageNum, this.pageNum + 2);
                setTimeout(() => {
                    this.articles = this.articles.concat(articlesComments);
                    $state.loaded();
                    this.pageNum += 2;
                }, 200);
            } else {
                $state.complete();
            }
        },
        async getArticleList() {
            const { data: res1 } = await this.$http2.get('/rest/categorys');
            const { data: res2 } = await this.$http2.get('/rest/articles');
            let type = res1.data.find((key) => key.name === '文章标签').children;
            let typeList = [];
            type.forEach((key) => {
                typeList[key.name] = [];
            });
            res2.data.forEach((element) => {
                element.categories.forEach((item) => {
                    Object.keys(typeList).forEach((key) => {
                        if (item.name === key) {
                            typeList[key].push(element);
                        }
                    });
                });
            });
            this.$store.commit('handleType', type);
            this.$store.commit('handleArticle', typeList);
        }
    }
};
</script>
<style lang="scss" >
.type-card {
    padding-top: 30px;
    .el-card {
        border: none;
        background: #fff;
        .board-header {
            font-size: 21px;
        }
    }
    .is-always-shadow {
        box-shadow: none !important;
    }
}
.main-body {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
}
.card-box {
    width: 100%;
    height: 100%;
    // background-color: #fff;
    border-radius: 5px;
}
.article:not(.card-style) {
    position: relative;
    min-height: 14.5rem;
    border-radius: 1em;
    overflow: hidden;
    // border: 0.5px solid #000;
    // background-color: var(--bs-dark);
    margin-bottom: 2rem;
    // border: 1px solid #e9ecef;
    a {
        text-decoration: underline;
    }
    .blur-img {
        img {
            position: absolute;
            top: 0;
            height: 14.5rem;
            object-fit: cover;
            background-position-x: center;
            background-position-y: center;
            background-size: cover;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            filter: blur(1.875rem) brightness(1);
            transform: scale(1);
        }
    }
    .article-img {
        width: 40%;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-position-x: center;
            background-position-y: center;
            background-size: cover;
            -webkit-transition: 0.3s ease-out;
            transition: 0.5s ease-out;
        }
    }
    .img-left {
        clip-path: polygon(0 0, 75% 0%, 100% 100%, 0% 100%);
        margin: 0;
        .lazy.loaded {
            opacity: 1;
        }
    }
    .img-right {
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 25% 100%);
        margin: 0;
        position: absolute;
        right: 0;
        height: 100%;
        .lazy.loaded {
            opacity: 1;
        }
    }
    .article-ctx {
        color: #fff;
        width: 60%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        z-index: 2;
        .post-info {
            font-size: 15px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            width: 100%;
            position: absolute;
            top: 0;
            padding: 20px;
            box-sizing: border-box;
            text-shadow: 0 0.1875rem 0.3125rem rgba(0, 0, 0, 1);
            .article-icon {
                font-size: 20px;
                padding-right: 0.1875rem;
            }
            .article-time,
            .article-vs {
                display: flex;
                align-items: center;
            }
        }
        .post-meta {
            position: relative;
            margin-top: 0px;
            height: 100%;
            width: 100%;
            padding-top: 100px !important;
            padding-bottom: 0 !important;
            // background-color: rgba(0, 0, 0, 0.3) !important;
            color: #fff !important;
            transition: all 0.3s;
            border-radius: 5px;
            .post-title {
                text-align: center;
                width: 100%;
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
                font-weight: 1000;
                font-size: 25px;
                transition: all 0.1s;
                line-height: 30px;
                transition: 1s;
                letter-spacing: 0.06rem;
                text-shadow: 0 0.1875rem 0.3125rem rgba(0, 0, 0, 1);
                box-sizing: border-box;
                position: absolute;
                bottom: 50px;
            }
            .post-description {
                position: absolute;
                bottom: 0;
                padding: 10px;
                opacity: 0;
                transition: 1s;
                box-sizing: border-box;
            }
        }
        .article-info {
            font-size: 13px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
        }
        .article-text {
            padding: 0 10px;
            letter-spacing: 0.06rem;
            text-shadow: 0 0.1875rem 0.3125rem rgba(0, 0, 0, 1);
        }
        .article-title {
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            font-weight: 1000;
            font-size: 27px;
            transition: 1s ease-out;
            line-height: 30px;
            transition: 1s;
            position: relative;
            width: 100%;
        }
        .article-description {
            // width: 100%;
            height: 3rem;
            overflow: hidden;
            transition: 2s;
            opacity: 0;
            z-index: -1;
            position: fixed;
        }
        .a-none {
            color: inherit;
            text-decoration: none;
            width: 100%;
        }
    }
}
.d-flex {
    display: flex !important;
}
.article:hover {
    cursor: pointer;
    img {
        filter: blur(1.2px);
        transform: scale(1.2);
    }
    .article-ctx {
        .post-title {
            transform: translateY(-50px) scale(1);
            opacity: 1;
        }
        .post-description {
            opacity: 1 !important;
            transform: translateY(-10px);
        }
    }
}
.contend-box {
    border: 0;
    box-sizing: border-box;
    width: 100%;
    border-radius: 5px;
    margin-bottom: 15px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2) !important;
    // overflow: hidden
    z-index: 999;
}
.contend-box:hover .img-left {
    background-size: 120%;
    filter: blur(5px);
    cursor: pointer;
}
.contend-box:hover .post-meta {
    background-color: rgba(0, 0, 0, 0.3) !important;
}
.contend-box:hover .index-post-title {
    transform: translateY(-30px) scale(1.2);
    opacity: 1;
    padding: 0 60px;
}
.contend-box .item-thumb {
    transition: all 0.3s;
    min-height: 250px;
    width: 35%;
    height: 200px;
    border-radius: 5px;
    background-size: 100%;
    background-position: 50% 50%;
    display: block;
    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
}
.contend-box .item-panel {
    height: 200px;
    min-height: 250px;
    position: relative;
    display: block;
    background-position: 50% 50%;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background-size: 100%;
    transition: all 0.3s linear;
    // z-index: 1;
}
@media screen and (min-width: 1200px) {
    .contend-box .post-meta {
        padding: 20px;
        position: relative;
        margin-top: -261px;
        height: 128px;
        padding-top: 133px !important;
        padding-bottom: 0 !important;
        background-color: rgba(0, 0, 0, 0.1) !important;
        color: #fff !important;
        transition: all 0.3s linear;
        border-radius: 5px;
    }
}
.contend-box .index-post-title {
    text-align: center;
    text-shadow: 0 0 3px #fff;
    color: #fff !important;
    margin-top: 0 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 22px;
    transition: all 0.3s linear;
}
.contend-box .index-post-title a {
    color: #fff !important;
    text-decoration: none;
}
.contend-box .text-muted {
    display: block;
    bottom: 60px;
    padding: 3px;
    opacity: 0;
    transition: all 0.3s;
}
</style>
