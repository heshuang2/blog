<template>
    <div id="newMessage">
        <el-card class="Bulletin-board">
            <div class="board-header">
                <span>最新留言</span>
            </div>
            <div class="board-main">
                <div class="message-card-item" v-for="(item, index) in newMessage" :key="index">
                    <span class="message-card-avatar">
                        <img :src="item.user.avatar" alt="" />
                    </span>
                    <div class="message-card-body">
                        <span class="message-card-title">
                            <router-link :to="`/user/${item.user.account}`" class="text-dark fs-sm">
                                {{ item.user.name }}
                            </router-link>
                            <ul class="text-grey fs-xs">
                                {{
                                    item.datetime | playTimeFormat
                                }}
                            </ul>
                        </span>
                        <span class="message-card-content">
                            <ul class="fs-sm" v-html="utils.Emoji(item.message)"></ul>
                        </span>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newMessage: []
        };
    },
    created() {
        this.getNewMessage();
    },
    methods: {
        async getNewMessage() {
            const { data: res } = await this.$http2.get('rest/messages/', {
                params: {
                    skip: 1,
                    limit: 3
                },
                paramsSerializer: (params) => {
                    return this.$qs.stringify(params, { indices: false });
                }
            });
            this.newMessage = res.data;
        }
    }
};
</script>

<style lang="scss">
#newMessage {
    width: 100%;
    .message-card-item {
        width: 100%;
        height: 5rem;
        box-sizing: border-box;
        padding: 5px;
        .message-card-avatar {
            height: 100%;
            width: 20%;
            display: flex;
            align-items: center;
            float: left;
            margin-right: 0.3125rem;
            img {
                height: 45px;
                width: 45px;
                object-fit: cover;
                border-radius: 50%;
            }
        }
        .message-card-body {
            display: table-cell;
            width: 50%;
            height: 4.375rem;
            vertical-align: middle;
            .message-card-title {
                display: flex;
                justify-content: space-between;
                font-size: 15px;
                border-bottom: 1px solid #000;
                width: 100%;
                height: 1.5625rem;
                overflow: hidden;
                a {
                    color: #fb7299 !important;
                    outline: none;
                    text-decoration: none;
                    cursor: pointer;
                }
            }
            .message-card-content {
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
