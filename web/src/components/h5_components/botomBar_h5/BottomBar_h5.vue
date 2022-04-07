<template>
    <div
        class="bottom-bar"
        :class="$store.state.theme ? 'bg-light text-black' : 'bg-dark text-white'"
        :style="{ position: show ? 'relative' : 'fixed' }"
    >
        <div class="bottom-input" :class="$store.state.theme ? 'bg-white' : 'bg-black'" @click="messageShow">
            <span class="bar-tip text-grey">输入{{ this.article ? '评论' : '留言' }}...</span>
        </div>
        <v-touch class="s-badge" @tap="toMessage" v-if="this.$route.name === 'post'">
            <svg-icon :icon-class="this.$store.state.theme ? 'message1' : 'message-dark'" class="menu-icon"></svg-icon>{{ this.count }}
        </v-touch>
        <van-popup class="popup-card"  :class="$store.state.theme ? 'bg-light' : 'bg-dark'" v-model="show" round closeable position="bottom">
            <div class="popup-title">请输入{{ this.article ? '评论' : '留言' }}</div>
            <div class="popup-body">
                <message-board
                    ref="replyBoard"
                    :show="show"
                    @success="success"
                    :itemMsg="index"
                    :item="item"
                    :article="this.article"
                ></message-board>
            </div>
        </van-popup>
    </div>
</template>

<script>
import MessageBoard from '../../messageCom/MessageBoard.vue';

export default {
    components: { MessageBoard },
    props: {
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
            show: false,
            index: null,
            item: {}
        };
    },
    mounted() {
        this.$bus.$on('bottomMessage', this.isShow);
    },
    watch: {},
    methods: {
        toMessage() {
            document.documentElement.scrollTop = document.querySelector('.comment-title').offsetTop;
        },
        messageShow() {
            this.show = true;
            this.index = null;
            this.$nextTick(() => {
                if (this.$refs.replyBoard) {
                    this.$refs.replyBoard.userMessage.userInfo.name = '';
                    this.$refs.replyBoard.userMessage.userInfo.id = '';
                    this.$refs.replyBoard.userMessage.infoId = '';
                    delete this.$refs.replyBoard.userMessage.isReply;
                }
            });
        },
        isShow(show, data, item, key, index) {
            this.show = show;
            this.index = index;
            this.item = item;
            this.$nextTick(() => {
                if (this.$refs.replyBoard) {
                    this.$refs.replyBoard.userMessage.userInfo.name = '@' + data.name;
                    this.$refs.replyBoard.userMessage.userInfo.id = data._id;
                    this.$refs.replyBoard.userMessage.infoId = item._id;
                    this.$refs.replyBoard.userMessage.isReply = key ? 0 : 1;
                    // console.log(this.$refs.replyBoard.userMessage);
                }
            });
        },
        success(val) {
            this.show = val;
        }
    }
};
</script>

<style lang="scss">
.bottom-bar {
    bottom: 0;
    left: 0;
    height: 3rem;
    width: 100%;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 9;
    .bottom-input {
        width: 50%;
        height: 2rem;
        border-radius: 5rem;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        .bar-tip {
            font-weight: 500;
        }
    }
    .s-badge {
        margin-right: 1.5rem;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .menu-icon {
            padding: 0 0.5rem;
        }
    }
}
.popup-card {
    width: 100%;
    left: 0;
    .popup-title {
        display: flex;
        justify-content: center;
        padding: 1rem 0;
        font-family: 'Open Sans', sans-serif;
        text-align: center;
        font-weight: 550;
    }
}
</style>