<template>
    <div class="comment-list" v-if="messageLists">
        <div class="list-item" v-for="(item, index) in messageLists" :key="index">
            <div class="user-face">
                <router-link :to="`/user/${item.user.account}`">
                    <div class="user-avatar">
                        <img :src="item.user.avatar" alt="" />
                    </div>
                </router-link>
            </div>
            <div class="user-content">
                <div class="user-name">
                    <a href="">{{ item.user.name }}</a>
                </div>
                <div class="user-text">
                    <span class="con" v-html="utils.Emoji(item.message)"></span>
                    <span class="like">
                        <!-- <svg-icon></svg-icon> -->
                    </span>
                </div>
                <div class="user-info">
                    <span>
                        <span class="time">{{ item.datetime | playTimeFormat }}</span>
                        <span class="reply" @click="replyBtn(index, item._id, item.user, 1)">回复</span>
                    </span>
                    <span v-if="item.isDel" class="reply" @click="delReply(item)">删除</span>
                </div>
                <div class="reply-content" v-if="item.children.length != 0" v-show="item.isDrop == true">
                    <span class="reply content-btn" @click="item.isDrop = false"
                        ><svg-icon iconClass="drop-down" class="reply-icon"></svg-icon>展开{{
                            item.children.length
                        }}条回复</span
                    >
                </div>
                <div class="reply-content reply-down" v-if="item.children.length != 0" v-show="item.isDrop == false">
                    <div class="reply-box" v-if="item.children" v-for="(itemChild, i) in item.children" :key="i">
                        <div class="reply-item">
                            <router-link :to="`/user/${itemChild.user.account}`" class="reply-face">
                                <img :src="itemChild.user.avatar" alt="" />
                            </router-link>
                            <div class="reply-con">
                                <div class="reply-user">
                                    <a class="reply-name">{{ itemChild.user.name }}</a>
                                    <span class="reply-userInfo" v-if="itemChild.isReply == 1"
                                        >回复<a href="">@{{ itemChild.userInfo.name }}</a></span
                                    >
                                    <span class="reply-text" v-html="utils.Emoji(itemChild.message)"></span>
                                </div>
                                <div class="user-info">
                                    <span>
                                        <span class="time">{{ itemChild.datetime | playTimeFormat }}</span>
                                        <span class="reply" @click="replyBtn(index, item._id, itemChild.user)"
                                            >回复</span
                                        >
                                    </span>
                                    <span
                                        v-if="itemChild.isDel"
                                        class="reply more"
                                        @click="delReply(itemChild, item.article, index)"
                                        >删除</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="reply content-btn" @click="item.isDrop = true"
                        ><svg-icon iconClass="pack-up" class="reply-icon"></svg-icon>收起</span
                    >
                </div>
                <div v-show="isReply == index">
                    <div class="close">
                        <svg-icon iconClass="close" class="close-reply" @click="closeReply(index)"></svg-icon>
                    </div>
                    <message-board
                        ref="replyBoard"
                        :article="article"
                        :messageLists="messageLists"
                        :itemMsg="index"
                    ></message-board>
                </div>
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
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import MessageBoard from './MessageBoard.vue';
export default {
    name: 'MessageList',
    components: { SvgIcon, MessageBoard },
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
            isDrop: true
        };
    },
    methods: {
        replyBtn(index, id, data, key) {
            this.isReply = index;
            this.$refs.replyBoard[index].userMessage.userInfo.name = '@' + data.name;
            this.$refs.replyBoard[index].userMessage.userInfo.id = data._id;
            this.$refs.replyBoard[index].userMessage.infoId = id;
            this.$refs.replyBoard[index].userMessage.isReply = key ? 0 : 1;
        },
        closeReply(index) {
            this.isReply = -1;
            this.$refs.replyBoard[index].errMsg = false;
        },
        delReply(item, parent, index) {
            this.$MessageBox
                .confirm(
                    item.children ? '删除评论后，评论下所有回复都会被删除是否继续' : '删除评论后将不可恢复是否继续？',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                .then(async () => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    if (item.article || parent) {
                        const { data: res } = await this.$http2.delete(`rest/comments/${item._id}/${item.infoId}`);
                        this.$bus.$emit('getArticleComment', 1, this.messageLists.length, 2, index);
                    } else {
                        console.log(1);
                        const { data: res } = await this.$http2.delete(`rest/messages/${item._id}/${item.infoId}`);
                        this.$bus.$emit('getMessageList', 1, this.messageLists.length, 2, index);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
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
.comment-list {
    padding-top: 20px;
    position: relative;
    .list-item {
        animation: moveup 1s;
        .user-face {
            float: left;
            margin: 24px 0 0 5px;
            // position: relative;
            .user-avatar {
                width: 48px;
                height: 48px;
                img {
                    width: 48px;
                    height: 48px;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }
        }
        .user-content {
            position: relative;
            margin-left: 85px;
            padding: 22px 0 14px 0;
            border-top: 1px solid #e5e9ef;
            .user-name {
                font-size: 12px;
                font-weight: bold;
                line-height: 18px;
                padding-bottom: 4px;
                display: block;
                word-wrap: break-word;
                position: relative;
                a {
                    color: #fb7299 !important;
                    outline: none;
                    text-decoration: none;
                    cursor: pointer;
                }
            }
            .user-text {
                line-height: 20px;
                padding: 2px 0;
                font-size: 14px;
                text-shadow: none;
                overflow: hidden;
                word-wrap: break-word;
                word-break: break-word;
                white-space: pre-wrap;
                display: flex;
                justify-content: space-between;
            }
            .user-info {
                color: #99a2aa;
                line-height: 26px;
                font-size: 12px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px dashed #e5e9ef;
                .more {
                    display: none;
                }
            }
            .reply {
                padding: 0 5px;
                border-radius: 4px;
                margin-left: 15px;
                cursor: pointer;
                display: inline-block;
            }
            .reply:hover {
                color: #00a1d6;
                background: #e5e9ef;
            }
            .reply-down {
                animation: slide-down 0.5s;
                transform-origin: 50% 0;
            }
            .reply-content {
                padding: 10px 0;
                position: relative;
                opacity: 1;
                translate: all 0.3s;
                .content-btn {
                    font-size: 11px;
                    font-weight: 600;
                    color: #6d757a;
                    font-family: HelveticaNeue-Bold, HelveticaNeue;
                    letter-spacing: 1px;
                    margin-left: 0;
                    .reply-icon {
                        font-size: 20px;
                        padding-right: 10px;
                        vertical-align: middle;
                    }
                }
            }
            .reply-drop {
                position: absolute;
                translate: all 0.3s;
            }
            .reply-box {
                .reply-item {
                    padding: 10px 0;
                    .reply-face {
                        display: inline-block;
                        position: relative;
                        margin-right: 10px;
                        vertical-align: top;
                        img {
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            object-fit: cover;
                        }
                    }
                    .reply-con {
                        display: inline-block;
                        width: calc(100% - 42px);
                        .reply-user {
                            font-size: 12px;
                            font-weight: bold;
                            line-height: 18px;
                            padding-bottom: 4px;
                            display: block;
                            word-wrap: break-word;
                            position: relative;
                            .reply-userInfo {
                                a {
                                    outline: none;
                                    text-decoration: none;
                                    cursor: pointer;
                                    color: #3080b4;
                                    padding: 0 5px;
                                }
                            }
                            .reply-name {
                                position: relative;
                                color: #6d757a;
                                padding-right: 10px;
                            }
                            .reply-text {
                                font-weight: normal;
                                font-size: 14px;
                                line-height: 20px;
                                white-space: pre-wrap;
                                padding: 0 5px;
                            }
                        }
                    }
                }
            }
            .reply-box:hover {
                .more {
                    display: block;
                }
            }
            .close {
                display: flex;
                .close-reply {
                    cursor: pointer;
                    margin-left: auto;
                    z-index: 1;
                }
            }
        }
    }
    .list-loader {
        margin-top: 50px;
        height: 42px;
        font: 16px PingFangSC-Regular;
        text-align: center;
        line-height: 42px;
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
</style>