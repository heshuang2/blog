<template>
    <div class="comment-wrap">
        <div v-if="$store.state.isLogin" class="err-tip fs-sm" :class="{ tipOver: isTip }">你还没有{{ this.article ? '评论' : '留言' }}</div>
        <div v-else class="err-tip fs-sm" :class="{ tipOver: isTip }">请先登录</div>
        <div class="comment-input">
            <div v-if="!this.$store.state.isLogin" class="mask">
                <div>请先<dialog-btn />(・ω・)</div>
            </div>
            <div class="vpanel">
                <div class="avatar" v-if="!this.$store.state.mobile">
                    <img v-if="this.$store.state.currentUser" :src="this.userMessage.user.avatar" alt="" />
                    <img v-else src="../../assets/img/avatar.jpeg" alt="" />
                </div>
                <div class="vheader">
                    <textarea
                        ref="inputVal"
                        class="vheader-input"
                        :class="[{errBorder: errMsg}, $store.state.theme ? 'bg-white text-black' : 'bg-content text-white' ]"
                        :placeholder="userMessage.userInfo.name"
                        cols="30"
                        rows="3"
                        v-model="userMessage.message"
                    ></textarea>
                </div>
                <div class="conment-submint">
                    <button class="ripple" @click="toComment(itemMsg)">发表{{ this.article ? '评论' : '留言' }}</button>
                </div>
            </div>
            <div class="OwO-main">
                <div class="OwO-logo">
                    <el-button size="mini" round class="OwO-btn"  :class="$store.state.theme ? 'bg-light text-black' : 'bg-dark text-white'" @click.stop="showEmotion">
                        <svg-icon icon-class="emoji"></svg-icon>
                        <span>表情</span>
                    </el-button>
                </div>
                <div class="OwO-body" :class="{ 'body-show': isEmotion }">
                    <el-tabs type="border-card" tab-position="bottom">
                        <el-tab-pane>
                            <span slot="label" class="icon"><svg-icon icon-class="QQicon"></svg-icon></span>
                            <div class="OwO-wrap">
                                <a
                                    class="emo"
                                    v-for="(item, index) in emotionArr"
                                    :key="'emojo' + index"
                                    @click.stop="emoClick(item)"
                                    v-html="item.url"
                                ></a>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!--  <div class="str" v-html="$options.filters.Emoji(userMessage.message)">{{ userMessage.message }}</div> -->
            </div>
        </div>
    </div>
</template>

<script>
import DialogBtn from '../dialogCard/DialogBtn.vue';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import emotions from '../../utils/emotion';

export default {
    name: 'MessageBoard',
    components: { SvgIcon, DialogBtn },
    props: {
        article: {
            type: Object,
            // required: true,
            default: null
        },
        messageLists: {
            type: Array,
            default: () => []
        },
        itemMsg: {
            type: Number,
            default: null
        },
        show: {
            type: Boolean,
            default: null
        },
        item: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            // isMessage: false,
            emotionArr: [],
            isEmotion: true,
            isDialog: false,
            errMsg: false,
            isTip: true,
            userMessage: {
                user: this.$store.state.currentUser,
                message: '',
                userInfo: {
                    name: '',
                    id: ''
                },
                infoId: '',
                article: {}
            },
            timer: null
        };
    },
    mounted() {
        this.loadEmotion();
        document.addEventListener('click', () => {
            if (this.isEmotion === false) {
                this.isEmotion = true;
            }
        });
    },

    methods: {
        showEmotion() {
            this.isEmotion = !this.isEmotion;
            this.$nextTick(function () {
                //DOM 更新了
                this.$refs.inputVal.focus();
            });
        },
        emoClick(arg) {
            this.userMessage.message += '[' + arg.name + ']';
        },
        loadEmotion() {
            const list = emotions.emotionList;
            let emotionArr = [];
            list.map((item, index) => {
                emotionArr.push({
                    name: `#${item}`,
                    url: `<img title="${item}" src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif">`
                });
            });
            this.emotionArr = emotionArr;
        },
        async toComment(index) {
            if (this.userMessage.message !== '') {
                this.userMessage.datetime = new Date();
                console.log( this.userMessage);
                this.userMessage.isDrop = this.userMessage.isDrop !== undefined ? this.userMessage.isDrop : true;
                if (this.article) {
                    this.userMessage.article._id = this.article._id;
                    this.userMessage.article.title = this.article.title;
                    const { data: res } = await this.$http2.post(`/rest/comments`, this.userMessage);;
                    this.$bus.$emit('getArticleComment', 1, this.messageLists.length);
                } else {
                    const { data: res } = await this.$http2.post('/rest/messages', this.userMessage);
                    console.log(res);
                    this.$bus.$emit('getMessageList', 1, this.messageLists.length);
                }
                this.userMessage.message = '';
                this.errMsg = false;
                if (this.show) {
                    this.$emit('success', false);
                }
            } else {
                this.errMsg = true;
                this.isTip = false;
                if (this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.isTip = true;
                }, 1500);
            }
            // 移动端
        }
    }
};
</script>

<style lang="scss">
.comment-wrap {
    height: 100%;
    position: relative;
    .comment-input {
        position: relative;
        height: 160px;
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
    }
    .mask {
        background-color: #e5e5e5;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 9;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        button {
            height: 24px;
            padding: .5rem 1rem;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            margin: 2px;
        }
    }
    .err-tip {
        position: absolute;
        z-index: 1;
        right: -8px;
        top: -20px;
        background-color: #ef3e3e;
        color: #fff;
        box-sizing: border-box;
        padding: 5px 10px;
        border-radius: 5px;
        opacity: 1;
        transition: all 1s;
    }
    .tipOver {
        opacity: 0;
        z-index: 0;
    }
    .vpanel {
        margin: 5px 85px;
        position: relative;
        .avatar {
            // display: flex;
            position: absolute;
            float: left;
            height: 100%;
            padding: 10px;
            left: -80px;
            z-index: 2;
            img {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
            }
        }
        .conment-submint {
            position: absolute;
            right: -95px;
            top: 0;
            padding: 10px;
            button {
                width: 70px;
                height: 64px;
                padding: 4px 15px;
                font-size: 14px;
                color: #fff;
                border-radius: 4px;
                text-align: center;
                min-width: 60px;
                vertical-align: top;
                cursor: pointer;
                background-color: #00a1d6;
                border: 1px solid #00a1d6;
                transition: 0.1s;
                user-select: none;
                outline: none;
            }
        }

        .vheader {
            // box-sizing: border-box;
            // float: left;
            line-height: 1.75;
            position: relative;

            .vheader-input {
                box-sizing: border-box;
                width: 100%;
                padding: 10px;
                resize: none;
                border-radius: 5px;
                // background-color: #fafafa;
                font-size: 15px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
                    'Open Sans', 'Helvetica Neue', sans-serif;
            }
            .errBorder {
                border: 1px solid #e40c0c;
            }
            .vheader-input::-webkit-scrollbar {
                width: 5px;
            }
            .vheader-input::-webkit-scrollbar-thumb {
                border-radius: 5%;
                background-color: transparent;
                border: 3px solid #ccc;
            }
            .vheader-input:focus {
                outline: 0;
                border: 1px solid #87aec7;
                // background-color: #fff;
            }
        }
    }
    .OwO-main {
        margin-left: 85px;
        .OwO-logo {
            .OwO-btn {
                cursor: pointer;
                text-align: center;
                padding: 7px 10px;
            }
        }
        .OwO-body:before {
            content: '';
            display: block;
            position: absolute;
            top: -5px;
            left: 18px;
            width: 8px;
            height: 5px;
            background: url(../../assets/img/data_image_png;base….png) 0 -49px no-repeat;
        }
        .OwO-body {
            // display: block;
            z-index: 1000;
            font-size: 12px;
            font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
            color: #222;
            overflow: visible;
            background: #fff;
            border: 1px solid #e5e9ef;
            box-shadow: 0 11px 12px 0 rgb(106 115 133 / 30%);
            border-radius: 8px;
            margin-top: 7px;
            margin-bottom: 10px;
            width: 360px;
            position: absolute;
            opacity: 1;
            transition: all 0.5s;
            .el-tabs--border-card {
                border: none;
                border-radius: 8px;
                .el-tabs__content {
                    padding: 0;
                }
                .el-tabs__header {
                    border-radius: 0 0 8px 8px;
                    margin-top: 0;
                    #tab-0 {
                        border-radius: 0 0 0 8px;
                    }
                }
            }
            .icon {
                font-size: 25px;
            }
            .OwO-wrap {
                margin: 6px 5px 0 10px;
                height: 196px;
                font-size: 0;
                overflow: auto;
                word-break: break-word;
                .emo {
                    display: inline-block;
                    cursor: pointer;
                    outline: 0;
                    text-decoration: none;
                    img {
                        margin: 4px;
                        vertical-align: middle;
                    }
                }
            }
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background-color: #fff;
            }
            ::-webkit-scrollbar-thumb {
                background: #fce518;
                border-radius: 25px;
                border: 0.1px solid #fff;
            }
        }

        .body-show {
            opacity: 0;
            z-index: 0;
        }
    }
}
</style>