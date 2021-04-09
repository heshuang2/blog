<template>
    <div>
        <article
            ref="article"
            class="article have-img d-flex"
            v-for="(item, index) in articles"
            :key="index"
            @click="ariticleDetails(item._id)"
        >
            <div class="blur-img">
                <img :src="item.icon" alt="" />
            </div>
            <a class="article-img" :class="[index % 2 === 0 ? 'img-right' : 'img-left']">
                <img class="lazy loaded" :src="item.icon" alt="" />
            </a>
            <div class="article-ctx">
                <div class="post-meta">
                    <div class="post-info">
                        <div class="article-time">
                            <svg-icon icon-class="date" class="article-icon" />
                            {{ item.datetime | playTimeFormat(10) }}
                        </div>
                        <div class="article-vs">
                            <svg-icon icon-class="iview" class="article-icon" />
                            {{ item.views }}阅读
                        </div>
                    </div>
                    <div class="post-title article-text">{{ item.title }}</div>
                    <div class="post-description article-text">
                        {{ item.brief | beautySub(35) }}
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    props: {
        articles: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        ariticleDetails(id) {
            this.$router.push(`/post/${id}`);
        }
    }
};
</script>

<style lang="scss">
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
</style>