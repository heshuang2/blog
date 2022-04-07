<template>
    <div id="post">
        <div class="post-main">
            <div class="page v-touch" :class="$store.state.theme ? 'bg-light text-black' : 'bg-dark text-white'">
                <div class="page-cover animate__animated" >
                    <img :src="article.icon" alt=""/>
                </div>
                <div class="page-title">
                    <div class="title animate__animated">{{ article.title }}</div>
                    <div class="page-info text-grey animate__animated">
                        <span class="page-date"
                        ><svg-icon iconClass="pag" class="date-icon"></svg-icon> 发表于{{
                                article.datetime | playTimeFormat(10)
                            }}</span
                        >
                        <span class="page-right animate__animated" v-if="!this.$store.state.mobile">
                            <span><svg-icon iconClass="reading" class="f-icon"></svg-icon> {{ article.views }}</span>
                            <span><svg-icon iconClass="comment" class="f-icon"></svg-icon>{{ comments.length }}</span>
                        </span>
                    </div>
                    <div class="page-tag animate__animated">
                        <svg-icon iconClass="tag" class="tag-icon"></svg-icon>
                        <span class="tag-wrap" v-for="(item, index) in article.categories" :key="index">
                            <span class="tag">{{ item.name }}</span>
                        </span>
                    </div>
                    <div class="page-brief animate__animated">
                        <svg-icon iconClass="brief" class="brief-icon"></svg-icon>
                        <span>{{ article.brief }}</span>
                    </div>
                </div>
                <div class="markdown-body" :class="$store.state.theme ? 'text-black' : 'text-white'"
                     v-html="article.content" v-highlight></div>
                <div class="page-update text-grey fs-xs">文章最后更新于 {{ article.update | playTimeFormat }}</div>
                <div class="comment-title">
                    <span>评论</span>
                </div>
                <div class="comment-main" v-if="!this.$store.state.mobile">
                    <message-board :article="article" :messageLists="comments"></message-board>
                    <message-list
                        ref="messageList"
                        :messageLists="comments"
                        :article="article"
                        :count="count"
                    ></message-list>
                </div>
                <div v-else>
                    <message-list-h5
                        ref="messageList"
                        :messageLists="comments"
                        :count="count"
                        :article="article"
                    ></message-list-h5>
                    <bottom-bar-h5 :article="article" :count="count"></bottom-bar-h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MessageBoard from '../components/messageCom/MessageBoard.vue';
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';
import MessageList from '../components/messageCom/MessageList.vue';
import MessageListH5 from '../components/h5_components/messageList_h5/MessageList_h5.vue';
import BottomBarH5 from '../components/h5_components/botomBar_h5/BottomBar_h5.vue';

export default {
    components: { SvgIcon, MessageBoard, MessageList, MessageListH5, BottomBarH5 },
    data() {
        return {
            article: {},
            comments: [],
            user: this.$store.state.currentUser,
            count: 0,
            blocks: [],
            imageList: [],
            offsetTop: 0
        };
    },
    created() {
        this.utils.initializeFlag();
        this.$bus.$on('getArticleComment', this.getArticleComment);
    },
    mounted() {
        this.getArticleDetail();
        this.getArticleComment(1, 5);
        document.documentElement.scrollTop = 0;
    },
    activated() {
        window.addEventListener('scroll', this.scrollHander, true);
        document.querySelector('.page-cover').classList.add('animate__zoomIn');
        document.querySelector('.page-title').childNodes.forEach(block => {
            block.classList.add('animate__fadeInUp')
        })
        this.comments.forEach((item, key) => {
            this.$bus.$emit('slideLeave', key, item);
        });
    },
    deactivated() {
        // console.log(this.blocks);
        window.removeEventListener('scroll', this.scrollHander, true);
        this.$store.commit('RemoveSlideList');
    },
    beforeRouteLeave(to, from, next) {
        document.documentElement.scrollTop = this.offsetTop;
        console.log(document.documentElement.scrollTop);
        next();
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当守卫执行前，组件实例还没被创建
    },
    watch: {
        $route(to, from) {
            if (this.$route.params.id !== this.article._id && this.$route.params.id && to.name !== 'home') {
                this.article = {};
                this.comments = [];
                this.$store.state.key = 0;
                this.utils.initializeFlag();
                this.getArticleDetail();
                this.getArticleComment(1, 5);
                document.documentElement.scrollTop = 0;
            } else if (this.$route.params.id === this.article._id && this.$route.params.id){
                // console.log(2,this.offsetTop);
               this.$nextTick(() => {
                   document.documentElement.scrollTop = this.offsetTop;
               })
            }
        }
    },
    methods: {
        // 移动端图片预览
        getImg(index) {
            console.log(index);
            if (this.$store.state.mobile) {
                this.$ImagePreview({
                    images: this.imageList,
                    startPosition: index
                });
            }
        },
        // 监听页面滚动条滑动
        scrollHander() {
            this.offsetTop = document.documentElement &&  document.documentElement.scrollTop;
            this.blocks.forEach((block, index) => {
                if (this.utils.isElemVisible(block)) {
                    // console.log(block);
                    block.classList.add('fade');
                    this.blocks.splice(index, 1);
                }
            });
        },
        getArticleDetail() {
            this.$http2.get(`rest/articles/${this.$route.params.id}`).then((res) => {
                this.$store.state.key = 0;
                this.article = res.data;
                this.$store.commit('handleTitle', this.article.title);
                this.$nextTick(() => {

                    this.blocks = [...document.querySelector('.markdown-body').children];
                    // 移动端图片添加图片预览事件
                    let imgs = document.querySelectorAll('.page-cover img');
                    console.log(Array.from(imgs));
                    imgs = Array.from(imgs)
                    imgs = imgs.concat(Array.from(document.querySelectorAll('.markdown-body img')));
                    this.imageList = [];
                    imgs.forEach((img, index) => {
                        this.imageList.push(img.src);
                        img.addEventListener(
                            'touchend',
                            () => {
                                this.getImg(index);
                            },
                            false
                        );
                    });
                    // this.blocks = arr1.concat(arr2, arr3)
                    // console.log(this.blocks);
                });
            });
        },
        getArticleComment(num, limit) {
            this.$http2
                .get('rest/comments/', {
                    params: {
                        id: this.$route.params.id,
                        skip: num,
                        limit: limit
                    },
                    paramsSerializer: (params) => {
                        return this.$qs.stringify(params, { indices: false });
                    }
                })
                .then((res) => {
                    this.$store.state.key = 1;
                    this.utils.IsDel(res.data.data, this);
                    this.$refs.messageList.isLoad = true;
                    this.count = res.data.count;
                    this.comments = num !== 1 ? this.comments.concat(res.data.data) : res.data.data;
                    this.$nextTick(() => {
                        this.comments.forEach((item, key) => {
                            if (!item.isDrop) {
                                this.$bus.$emit('slideEnter', key, item);
                            } else {
                                this.$bus.$emit('clearLeave', key);
                            }
                        });
                    });
                });
        }
    }
};
</script>

<style lang="scss">
@import '../assets/markdown.css';

#post {
    min-height: 90%;

    .post-main {
        max-width: 1080px;
        margin: auto;
        position: relative;
        padding: 60px 0;
        font-family: 'Open Sans', sans-serif;

        .page-cover {
            //animation: zoomIn 2s;

            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
                border-radius: 5px;
            }
        }

        .page-title {

            .title {
                display: flex;
                justify-content: center;
                font-size: 30px;
                font-weight: 1000;
                padding: 20px 8px;
                letter-spacing: 1px;
                line-height: 36px;
            }

            .page-info {
                display: flex;
                justify-content: space-between;

                span {
                    padding: 10px 20px;
                    font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif !important;
                }

                .page-right {
                    span {
                        display: flex;
                        align-items: center;
                        // font-weight: 800;
                        color: #000;
                        font-size: 20px;
                    }

                    .f-icon {
                        font-size: 25px;
                        padding-right: 5px;
                    }
                }

                .page-date {
                    display: flex;
                    align-items: center;

                    .date-icon {
                        font-size: 24px;
                        padding-right: 2px;
                    }
                }
            }

            .page-tag {
                padding: 8px 0;
                display: flex;
                align-items: center;

                .tag-icon {
                    font-size: 32px;
                }
            }
        }

        .page-brief {
            padding: 40px 8px;
            font-weight: 700;
            display: flex;

            .brief-icon {
                font-size: 25px;
            }
        }

        .page-update {
            font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif !important;
            padding: 30px 8px;
        }

        .comment-title {
            padding: 20px 0;
            border-top: 1px solid #ccc;

            span {
                font-size: 20px;
                font-weight: 600;
            }
        }

        .comment-main {
            padding: 0 50px;
        }

        pre {
            position: relative;

            .btn {
                display: flex;
                position: absolute;
                right: 6px;
                top: 5px;
                background-color: #fff;
                border: 1px solid #000;
                cursor: pointer;
                border-radius: 3px;
                -webkit-transition: opacity 0.3s ease-in-out;
                -o-transition: opacity 0.3s ease-in-out;
                transition: opacity 0.3s ease-in-out;
                opacity: 0;

                .copy-icon {
                    font-size: 23px;
                    color: #000;
                }
            }
        }

        pre:hover {
            .btn {
                opacity: 1;
            }
        }

        .hljs {
            padding: 3px;
        }

        pre code ul {
            max-height: 500px;
            overflow: auto;
        }

        pre code ul::-webkit-scrollbar {
            width: 3px;
            height: 3px;
        }

        pre code ul::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: transparent;
            border: 5px solid #fff;
        }

        code {
            font-family: 'Sans Mono', 'Consolas', 'Courier', monospace;
        }

        .hljs ul {
            list-style: none;
            // margin: 0 0 0 40px !important;
            padding: 0;
            counter-reset: sectioncounter;
            position: relative;
            margin: 0;
            display: inline-block;
            width: 100%;
        }

        .hljs ul li:before {
            content: counter(sectioncounter);
            padding: 0 5px !important;
            border-right: 1px solid #fff !important;
            counter-increment: sectioncounter;
            font-weight: bold;
            color: #999;
            position: absolute;
            width: 20px !important;
            left: -10px;
            text-align: right;
            font-family: HelveticaNeue-Bold, HelveticaNeue;
            font-size: 13px;
        }

        .hljs li {
            margin: 0;
            padding-left: 30px;
            line-height: 23px;
            width: 100%;
            height: 23px;
            box-sizing: border-box;
        }

        .hljs li:nth-of-type(even) {
            background-color: rgba(255, 255, 255, 0.015);
            color: inherit;
        }
    }
}
</style>