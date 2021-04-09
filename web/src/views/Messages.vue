<template>
    <div id="message">
        <div class="container message-main">
            <div v-if="!this.$store.state.mobile" class="page bg-white">
                <hr v-if="!this.$store.state.mobile" />
                <div class="post-comment">
                    <div class="comment-head">
                        <div class="comment-headline">
                            <svg-icon icon-class="iview" class="article-icon" />
                            <span>留下足迹吧</span>
                        </div>
                    </div>
                    <div class="message-board">
                        <message-board :messageLists="messageLists"></message-board>
                        <message-list ref="messageList" :messageLists="messageLists" :count="count"></message-list>
                    </div>
                </div>
            </div>
            <div v-else class="container page bg-light">
                <div>欢迎留言</div>
                <message-list-h5 ref="messageList" :messageLists="messageLists" :count="count"></message-list-h5>
                <bottom-bar-h5></bottom-bar-h5>
            </div>
        </div>
    </div>
</template>

<script>
import MessageBoard from '../components/messageCom/MessageBoard.vue';
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';
import MessageList from '../components/messageCom/MessageList.vue';
import BottomBarH5 from '../components/h5_components/botomBar_h5/BottomBar_h5.vue';
import MessageListH5 from '../components/h5_components/messageList_h5/MessageList_h5.vue';
export default {
    components: { MessageList, MessageBoard, SvgIcon, BottomBarH5, MessageListH5 },
    data() {
        return {
            isReply: -1,
            messageLists: [],
            user: this.$store.state.currentUser,
            count: 0
        };
    },
    created() {
        this.utils.initializeFlag();
        this.getMessageList(1, 110);
    },
    mounted() {
        this.$bus.$on('getMessageList', this.getMessageList);
    },
    methods: {
        async getMessageList(num, limit, key, index, item) {
            const { data: res } = await this.$http2.get('rest/messages/', {
                params: {
                    skip: num,
                    limit: limit
                },
                paramsSerializer: (params) => {
                    return this.$qs.stringify(params, { indices: false });
                }
            });
            this.utils.IsDel(res.data, this);
            this.count = res.count;
            switch (key) {
                case 1:
                    this.$refs.messageList.isLoad = true;
                    this.messageLists = this.messageLists.concat(res.data);
                    break;
                case 2:
                    let flag1,
                        flag2 = false;
                    // 新增删除留言评论处理展开回复状态
                    switch (res.data.length - this.messageLists.length) {
                        case 1:
                            item = null;
                            flag1 = true;
                            break;
                        case -1:
                            item = null;
                            flag2 = true;
                            break;
                        default:
                            break;
                    }
                    this.messageLists = res.data;
                    if (flag1) {
                        this.$nextTick(() => {
                            console.log(this.$store.state.slideList);
                            this.$store.state.slideList.forEach((key, index) => {
                                this.$store.state.slideList[index] = key + 1;
                                this.messageLists[key + 1].isDrop = false;
                                this.$bus.$emit('clearLeave', key);
                                this.$bus.$emit('slideEnter', key + 1);
                            });
                            console.log(this.$store.state.slideList);
                            flag1 = false;
                        });
                    }
                    if (flag2) {
                        this.$nextTick(() => {
                            console.log(index);
                            this.$bus.$emit('slideLeave', index);
                            console.log(this.$store.state.slideList);
                            this.$store.state.slideList.forEach((key, i) => {
                                // console.log(this.$store.state.slideList);
                                if (key > index) {
                                    this.$store.state.slideList[i] = key - 1;
                                    this.messageLists[key - 1].isDrop = false;
                                    this.$bus.$emit('clearLeave', key);
                                    this.$bus.$emit('slideEnter', key - 1);
                                } else {
                                    console.log(key);
                                    this.messageLists[key].isDrop = false;
                                    this.$bus.$emit('slideEnter', key);
                                }
                            });
                            console.log(this.$store.state.slideList);
                            index = null;
                            flag2 = false;
                        });
                    }
                    break;
                default:
                    this.messageLists = this.messageLists.concat(res.data);
            }
            if (index != null) {
                this.messageLists[index].isDrop = false;
            }
            if (this.$store.state.mobile && item) {
                this.$nextTick(() => {
                    this.$store.state.slideList.forEach((key) => {
                        this.messageLists[key].isDrop = false;
                    });
                    this.$bus.$emit('slideEnter', index, item);
                });
            }
        }
    }
};
</script>
<style lang="scss">
#message {
    min-height: 90%;
    /*  .str {
        display: flex;
        padding: 2px;
        align-items: center;
    } */
    .message-main {
        margin: auto;
        position: relative;
        box-sizing: border-box;
        display: block !important;
        padding-top: 60px;
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
                            margin-left: 15px;
                            cursor: pointer;
                            display: inline-block;
                        }
                        .reply:hover {
                            color: #00a1d6;
                            background: #e5e9ef;
                        }
                        .more {
                            display: none;
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
        }
    }
}
</style>
