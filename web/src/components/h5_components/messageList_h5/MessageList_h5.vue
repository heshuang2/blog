<template>
    <div class="message-list-h">
        <div class="list-body-h">
            <div class="list-content-h bg-white" v-for="(item, index) in messageLists" :key="index">
                <div class="list-avatar-h">
                    <img :src="item.user.avatar" alt="" />
                </div>
                <div class="list-warp-h">
                    <div class="list-name-h">
                        <span>{{ item.user.name }}</span>
                    </div>
                    <div class="list-date-h">
                        <span>{{ item.datetime | playTimeFormat }}</span>
                    </div>
                    <div
                        class="list-msg-h"
                        v-html="utils.Emoji(item.message)"
                        @click="replyBtn(index, item.user, item, 1)"
                    ></div>
                    <div class="list-more-h" @click="showPopup(item, index)">
                        <svg-icon iconClass="more" class="more-icon"></svg-icon>
                    </div>
                    <van-button
                        v-show="item.children.length != 0"
                        class="reply-btn-h ripple"
                        :class="!item.isDrop ? 'btn-none' : 'btn-show'"
                        @click="slideEnter(index, item)"
                    >
                        <svg-icon iconClass="arrow-down"></svg-icon>
                        展开{{ item.children.length }}条回复
                    </van-button>
                    <div ref="reply" class="list-reply-h">
                        <div class="reply--warp-border bg-grey"></div>
                        <div class="list-content-h reply-content-h" v-for="(itemChild, i) in item.children" :key="i">
                            <div class="list-avatar-h reply-avatar-h">
                                <img :src="itemChild.user.avatar" alt="" />
                            </div>
                            <div class="list-warp-h reply-warp-h">
                                <div class="list-name-h reply-name-h">
                                    <span>{{ itemChild.user.name }}</span>
                                    <span v-if="itemChild.isReply" class="reply-userinfo-h">
                                        <span class="reply-h text-black">回复</span>
                                        <span>{{ itemChild.userInfo.name }}</span>
                                    </span>
                                </div>
                                <div class="list-date-h">
                                    <span>{{ itemChild.datetime | playTimeFormat }}</span>
                                </div>
                                <div
                                    class="list-msg-h reply-msg-h"
                                    v-html="utils.Emoji(itemChild.message)"
                                    @click="replyBtn(index, itemChild.user, item)"
                                ></div>
                                <div class="list-more-h" @click="showPopup(itemChild, index, item)">
                                    <svg-icon iconClass="more" class="more-icon"></svg-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <van-button
                        v-show="item.children.length != 0 && !item.isDrop"
                        class="reply-btn-h ripple"
                        @click="slideLeave(index, item)"
                    >
                        <svg-icon iconClass="arrow-up"></svg-icon>
                        收起
                    </van-button>
                </div>
            </div>
            <div v-if="messageLists.length < count" class="list-loader" ref="loader" @click="loaderComments">
                <span v-if="isLoad">加载更多...</span>
                <span v-else>
                    <i class="el-icon-loading"></i>
                    拼命加载中
                </span>
            </div>
            <div v-else class="list-null">
                <span>没有更多了 Orz</span>
            </div>
        </div>
        <van-popup class="popup-card" v-model="show" round position="bottom">
            <div class="handle">
                <svg-icon iconClass="cut" class="cut-icon"></svg-icon>
            </div>
            <div class="popup-title popup-reply">{{ reply | beautySub(100) }}</div>
            <div class="popup-body popup-content">
                <ul>
                    <li @click="replyMessage">回复</li>
                    <li v-if="listData.isDel" @click="delMessage">删除</li>
                </ul>
                <van-button type="default" class="closeBtn bg-light" @click="show = false">取消</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import SvgIcon from '../../SvgIcon/SvgIcon.vue';
export default {
    components: { SvgIcon },
    props: {
        messageLists: {
            type: Array,
            default: () => []
        },
        article: {
            type: Object,
            // required: true,
            default: null
        },
        count: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isReply: -1,
            user: this.$store.state.currentUser,
            isLoad: true,
            isDrop: true,
            show: false,
            reply: '',
            listData: {},
            index: null,
            // 留言主对象
            item: {}
        };
    },
    mounted() {
        this.$bus.$on('slideEnter', this.slideEnter);
        this.$bus.$on('slideLeave', this.slideLeave);
        this.$bus.$on('clearLeave', this.clearLeave);
    },
    methods: {
        slideEnter(index, item) {
            this.$store.commit('HandleSlideList', index);
            // console.log( this.$store.state.slideList);
            const el = this.$refs.reply[index];
            // console.log(el);
            if (item) {
                item.isDrop = false;
            }
            el.style.height = 'auto';
            let height = window.getComputedStyle(el, null)['height'];
            el.style.height = '0';
            //不设定延迟height不会有动画
            setTimeout(function () {
                el.style.height = height;
                el.style.opacity = 1;
            }, 20);
        },
        slideLeave(index, item) {
            this.$store.commit('RemoveSlideList', index);
            const el = this.$refs.reply[index];
            el.style.height = '0';
            if (item) {
                setTimeout(function () {
                    item.isDrop = true;
                }, 300);
            }
        },
        clearLeave(index) {
            const el = this.$refs.reply[index];
            el.style.height = '0';
        },
        replyBtn(index, data, item, key) {
            this.$bus.$emit('bottomMessage', true, data, item, key, index);
        },
        showPopup(item, index, parent) {
            this.show = true;
            this.index = index;
            this.listData = item;
            this.item = item.children ? item : parent;
            this.reply = item.user.name + ': ' + item.message;
        },
        // 回复
        replyMessage() {
            // console.log(this.index);
            let key = this.listData.children ? 1 : '';
            this.show = false;
            this.$bus.$emit('bottomMessage', true, this.listData.user, this.item, key, this.index);
        },
        // 删除
        delMessage() {
            this.$Dialog.confirm({
                title: '删除',
                message: this.listData.children
                    ? '删除评论后，评论下所有回复都会被删除是否继续'
                    : '删除评论后将不可恢复是否继续？',
                beforeClose: async (action, done) => {
                    if (action === 'confirm') {
                        if (this.article) {
                            const { data: res } = await this.$http2.delete(
                                `rest/comments/${this.listData._id}/${this.listData.infoId}`
                            );
                            this.$bus.$emit('getArticleComment', 1, this.messageLists.length, 2, this.index, this.item);
                        } else {
                            const { data: res } = await this.$http2.delete(
                                `rest/messages/${this.listData._id}/${this.listData.infoId}`
                            );
                            this.$bus.$emit('getMessageList', 1, this.messageLists.length, 2, this.index, this.item);
                        }
                        done();
                        /* if (!this.listData.children) {
                            console.log(this.$store.state.slideList);
                        } */
                        this.show = false;
                    } else {
                        done();
                    }
                }
            });
        },
        // 加载更多
        loaderComments() {
            this.isLoad = false;
            setTimeout(() => {
                this.$bus.$emit(
                    `${this.article ? 'getArticleComment' : 'getMessageList'}`,
                    (this.messageLists.length / 5 + 1).toFixed(),
                    5,
                    1
                );
                this.$bus.$on('isLoad', function () {
                    this.isLoad = true;
                    console.log(1);
                });
            }, 1000);
        }
    }
};
</script>

<style lang="scss">
.message-list-h {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    // border-bottom: 1px solid #ccc;
    .list-body-h {
        width: 100%;
        .list-content-h {
            width: 100%;
            box-sizing: border-box;
            // height: 3rem;
            border-radius: 0;
            padding: 0.5rem;
            margin-bottom: 0.1rem;
            // border-bottom: 1px solid #ccc;
            position: relative;
            .list-avatar-h {
                // flex: 0 0 10%;
                // display: flex;
                float: left;
                padding-right: 0.625rem;
                img {
                    height: 36px;
                    width: 36px;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }
            .list-warp-h {
                // flex: 1 0 80%;
                padding-left: 15%;
                position: relative;
                .list-name-h {
                    font-size: 15px;
                    line-height: 18px;
                    color: #03a0a0;
                }
                .list-date-h {
                    font-size: 12px;
                    line-height: 20px;
                    color: #999;
                }
                .list-msg-h {
                    padding: 0.5rem 0;
                    // display: flex;
                    // align-items: center;
                    word-wrap: break-word;
                    width: 100%;
                    overflow: hidden;
                }
                .list-more-h {
                    position: absolute;
                    right: 0;
                    top: 0.5rem;
                    .more-icon {
                        font-size: 1.5rem;
                    }
                }
                .reply-btn-h {
                    height: auto;
                    width: auto;
                    padding: 0.2rem 0.5rem;
                    border-radius: 1rem;
                }
                .van-button::before {
                    // background-color: #fff;
                }
                .btn-none {
                    // display: none;
                    position: absolute;
                    opacity: 0;
                    // transition: all .2s linear;
                }
                .btn-show {
                    // display: block;
                    opacity: 1;
                    transition: all 0.5s linear;
                }
                .list-reply-h {
                    width: 100%;
                    height: 0;
                    // border-radius: 0.5rem;
                    overflow: hidden;
                    transition: height 0.3s linear;
                    position: relative;
                      
                    .reply--warp-border {
                        position: absolute;
                        width: 1px;
                        height: 100%;
                        border-radius: 2rem;
                    }
                    .reply-content-h {
                        padding: 0.2rem 0;
                        border: none;
                        .reply-avatar-h {
                            position: relative;
                            padding: 0.2rem 0.5rem;
                            img {
                                width: 30px;
                                height: 30px;
                            }
                        }
                        .reply-name-h {
                            font-size: 0.75rem !important;
                            .reply-h {
                                padding: 0 0.25rem;
                            }
                        }
                        .reply-msg-h {
                            position: relative;
                            overflow: hidden;
                          
                        }
                    }
                }
            }
        }
        .list-loader {
            // margin-top: 50px;

            height: 36px;
            font: 16px PingFangSC-Regular;
            text-align: center;
            line-height: 36px;
            color: #626675;
            background: #f5f5f6;
            border-radius: 6px;
            cursor: pointer;
        }
        .list-null {
            text-align: center;
            border-top: 1px solid #ccc;
            padding: 20px;
            margin-top: 20px;
            font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif !important;
            font-size: 15px;
        }
    }
    .handle {
        width: 100%;
        display: flex;
        justify-content: center;
        .cut-icon {
            font-size: 25px;
        }
    }
    .popup-reply {
        font-weight: 500;
        padding: 1rem 1rem;
        font-size: 13px;
        color: #999;
    }
    .popup-content {
        font-size: 16px !important;
        ul {
            width: 100%;
            padding: 0.5rem 0;
            li {
                // transform: scaleY(0.1);
                width: 100%;
                padding: 0.5rem 0;
                // border-top: 1px solid #ccc;
                text-align: center;
            }
            li::after {
                content: '';
                display: block;
                height: 1px;
                transform: scaleY(0.3);
                position: relative;
                top: -33px;
                background: #ccc;
            }
        }
        .closeBtn {
            width: 96%;
            box-sizing: border-box;
            margin: 0 2%;
            margin-bottom: 2rem;
            border-radius: 2rem;
            font-size: 16px !important;
        }
    }
}
</style>