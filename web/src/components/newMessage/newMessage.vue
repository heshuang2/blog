<template>
    <div id="newMessage">
        <el-card class="Bulletin-board">
            <div class="board-header">
                <span>最新留言</span>
            </div>
            <div class="board-main">
                <div class="message-card-item" v-for="(item, index) in newMessage" :key="index">
                    <span class="message-card-avatar">
                        <img src="../../assets/img/007.jpg" alt="" />
                    </span>
                    <div class="message-card-body">
                        <span class="message-card-title">
                            <ul class="text-dark fs-sm">
                                {{item.name}}
                            </ul>
                            <ul class="text-grey fs-xs">
                                {{item.datetime | playTimeFormat}}
                            </ul>
                        </span>
                        <span class="message-card-content">
                            <ul class="fs-sm">
                               {{item.content}}
                            </ul>
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
            const { data: res } = await this.$http2.get('/rest/Message');
            this.newMessage = res;
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
            // width: 27%;
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
            width: 73%;
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
            }
            .message-card-content {
                display: flex;
            }
        }
    }
}
</style>
