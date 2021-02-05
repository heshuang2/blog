<template>
    <div class="main">
        <div class="center">
            <div id="home">
                <div class="card-box">
                    <article class="article have-img d-flex" v-for="(item, index) in articles" :key="index">
                        <div class="blur-img">
                            <img :src="item.icon" alt="" />
                        </div>
                        <a class="article-img " :class="[index % 2 === 0 ? 'img-right' : 'img-left']">
                            <img class="lazy loaded" :src="item.icon" alt="" />
                        </a>
                        <div class="article-ctx">
                            <header class="article-info">
                                <div class="article-time">
                                    <svg-icon icon-class="date" class="article-icon" />
                                    {{ item.datetime | playTimeFormat }}
                                </div>
                                <div class="article-vs">
                                    <svg-icon icon-class="iview" class="article-icon" />
                                    {{ item.views }}阅读
                                </div>
                            </header>
                            <a class="article-title a-none" href="">{{ item.title }}</a>
                            <a class="article-description a-none" href="">{{item.brief | beautySub(47)}}</a>
                        </div>
                    </article>
                </div>
            </div>
        </div>
        <left />
    </div>
</template>

<script>
import left from '../components/left';
export default {
    name: 'Home',
    data() {
        return {
            count: 20,
            articles: []
        };
    },
    components: {
        left
    },
    created() {
        this.getArticleList();
    },
    methods: {
        async getArticleList() {
            const { data: res } = await this.$http2.get('/rest/articles');
            this.articles = res;
        }
    }
};
</script>
<style lang="scss" scoped>
.card-box {
    width: 100%;
    height: 100%;
    // background-color: #fff;
    border-radius: 5px;
}
.article:not(.card-style) {
    position: relative;
    height: 14.5rem;
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
        width: 50%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 2rem 2rem;
        z-index: 2;
        text-align: center;

        .article-info {
            font-size: 13px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
         
            .article-icon {
                font-size: 20px;
                padding-right: 0.1875rem;
            }
            .article-time {
                display: inline-flex;
                align-items: center;
            }
            .article-vs {
                display: inline-flex;
                align-items: center;
            }
        }
        .article-title,
        .article-description {
            letter-spacing: 0.06rem;
            text-shadow: 0 0.1875rem 0.3125rem rgba(0, 0, 0, 1);
        }
        .article-title {
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            font-weight: 1000;
            font-size: 27px;
            transition: 1s ease-out;
        }
        .article-description {
            // width: 100%;
            height: 3rem;
            overflow: hidden;
            transition: 0.8s;
            opacity: 0;
            z-index: 0;
        }
        .a-none {
            color: inherit;
            text-decoration: none;
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
        .article-title {
           
        }
        .article-info,
        .article-description {
            opacity: 1;
            visibility: visible;
            z-index: 1;
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
