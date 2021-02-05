<template>
    <div id="message">
        <div class="message-main">
            <div class="page bg-white">
                <hr />
                <div class="post-comment">
                    <div class="comment-head">
                        <div class="comment-headline">
                            <svg-icon icon-class="iview" class="article-icon" />
                            <span>留下足迹吧</span>
                        </div>
                    </div>
                    <div class="message-board">
                        <message-board></message-board>
                        <div class="comment-list">
                            <div class="list-item" v-for="(item, index) in messageList" :key="index">
                                <div class="user-face">
                                    <a href="">
                                        <div class="user-avatar">
                                            <img :src="item.user.avatar" alt="" />
                                        </div>
                                    </a>
                                </div>
                                <div class="user-content">
                                    <div class="user-name">
                                        <a href="">{{ item.user.name }}</a>
                                    </div>
                                    <div class="user-text">
                                        <span class="con" v-html="$options.filters.Emoji(item.message)"></span>
                                        <span class="like">
                                            <!-- <svg-icon></svg-icon> -->
                                        </span>
                                    </div>
                                    <div class="user-info">
                                        <span class="time">{{ item.user.datetime | playTimeFormat }}</span>
                                        <span class="reply" @click="replyBtnF(index, item._id, item.user)">回复</span>
                                    </div>
                                    <div
                                        class="reply-box"
                                        v-if="item.children"
                                        v-for="(itemChild, i) in item.children"
                                        :key="i"
                                    >
                                        <div class="reply-item">
                                            <a href="" class="reply-face">
                                                <img :src="itemChild.user.avatar" alt="" />
                                            </a>
                                            <div class="reply-con">
                                                <div class="reply-user">
                                                    <a class="reply-name">{{ itemChild.user.name }}</a>
                                                    <span class="reply-userInfo" v-if="itemChild.isReply == 1"
                                                        >回复<a href="">@{{ itemChild.userInfo.name }}</a></span
                                                    >
                                                    <span
                                                        class="reply-text"
                                                        v-html="$options.filters.Emoji(itemChild.message)"
                                                    ></span>
                                                </div>
                                                <div class="user-info">
                                                    <span class="time">{{ itemChild.datetime | playTimeFormat }}</span>
                                                    <span
                                                        class="reply"
                                                        @click="replyBtnC(index, item._id, itemChild.user)"
                                                        >回复</span
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <message-board v-show="isReply == index" ref="replyBoard"></message-board>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MessageBoard from '../components/messageBoard/MessageBoard.vue';
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';
import emotions from '../utils/emotion';
export default {
    components: { MessageBoard, SvgIcon },
    data() {
        return {
            isReply: -1,
            messageList: []
        };
    },
    created() {
        this.getMessageList();
    },
    filters: {
        Emoji: function (str) {
            return str.replace(/\[#[\u4E00-\u9FA5]{1,5}]/g, (words) => {
                let word = words.replace(/#|\[|\]/g, '');
                let index = emotions.emotionList.indexOf(word);
                if (index !== -1) {
                    return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="center">`;
                } else {
                    return words;
                }
            });
        }
    },
    methods: {
        async getMessageList() {
            const { data: res } = await this.$http2.get('/rest/messages');
            console.log(res);

            this.messageList = res;
        },
        replyBtnF(index, id, data) {
            this.isReply = index;
            this.$refs.replyBoard[index].userMessage.userInfo.name = '@' + data.name;
            this.$refs.replyBoard[index].userMessage.userInfo.id = data._id;
            this.$refs.replyBoard[index].userMessage.infoId = id;
            this.$refs.replyBoard[index].userMessage.isReply = 0;
        },
        replyBtnC(index, id, data) {
            this.isReply = index;
            this.$refs.replyBoard[index].userMessage.userInfo.name = '@' + data.name;
            this.$refs.replyBoard[index].userMessage.userInfo.id = data._id;
            this.$refs.replyBoard[index].userMessage.infoId = id;
            this.$refs.replyBoard[index].userMessage.isReply = 1;
        }
    }
};
</script>
<style lang="scss">
#message {
    min-height: 90%;
    .str {
        display: flex;
        padding: 2px;
        align-items: center;
    }
    .message-main {
        position: relative;
        padding: 60px 0;
    }
    hr {
        width: calc(100% - 4px);
        border: 2px dashed;
        margin: 2rem auto;
    }
    .post-comment {
        .comment-head {
            margin-bottom: 1rem;
            .comment-headline {
                display: inline-block;
                vertical-align: middle;
                font-weight: 700;
                font-size: 1.43em;
            }
        }
        .message-board {
            border: 1px solid #f0f0f0;
            border-radius: 5px;
            padding: 20px 10px;
        }
        .comment-list {
            padding-top: 20px;
            position: relative;
            .list-item {
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
                        .reply {
                            padding: 0 5px;
                            border-radius: 4px;
                            margin-right: 15px;
                            cursor: pointer;
                            display: inline-block;
                        }
                        .reply:hover {
                            color: #00a1d6;
                            background: #e5e9ef;
                        }
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
                }
            }
        }
    }
}
</style>
