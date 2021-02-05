<template>
    <div id="top">
        <div class="mini-header">
            <div class="mini-header-conten">
                <div class="nav-link">
                    <ul>
                        <li
                            class="nav-link-li"
                            v-for="(item, index) in linknames"
                            :key="index"
                            @click="current = index"
                        >
                            <span :class="{ isactive: index === current }"></span>
                            <router-link :to="item.path">
                                <span>{{ item.name }}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="nav-icon">
                    <ul>
                        <el-popover placement="bottom" trigger="hover" width="300">
                            <div class="nav-search">
                                <searchs></searchs>
                            </div>
                            <li v-for="(item, index) in navIcon" :key="index" slot="reference">
                                <svg-icon
                                    :icon-class="item.icon"
                                    class="icon-item"
                                    @mouseover="selectStyle(item)"
                                    @mouseleave="outStyle"
                                />
                            </li>
                        </el-popover>
                    </ul>
                    <div class="login" v-if="!this.$store.state.isLogin">
                        <dialog-btn></dialog-btn>
                    </div>
                    <el-dropdown v-else placement="bottom" trigger="click" @command="handleCommand">
                        <div class="login-avatar">
                            <img :src="this.$store.state.currentUser.avatar" alt="" />
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">我的账号</el-dropdown-item>
                            <el-dropdown-item command="2">设置</el-dropdown-item>
                            <el-dropdown-item command="3">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <audio-player ref="aplayer" :isMini="mini"></audio-player>
    </div>
</template>

<script>
import DialogBtn from './dialogCard/DialogBtn.vue';
import DialogCard from './dialogCard/DialogCard.vue';
import AudioPlayer from './musicPlayerChildren/AudioPlayer.vue';
import searchs from './musicPlayerChildren/searchs.vue';

export default {
    components: { searchs },
    name: 'top',
    data() {
        return {
            linknames: [
                { id: 1, name: '主站', path: '/home' },
                { id: 2, name: '琐碎', path: '/Diarys' },
                { id: 3, name: '留言', path: '/Messages' },
                { id: 4, name: '照片', path: '/photos' }
            ],
            navIcon: [
                {
                    msg: '搜索',
                    icon: 'icon-search'
                },
                {
                    msg: '音乐',
                    icon: 'yinle'
                }
            ],
            current: 0,
            isSearch: false,
            mini: true,
            isDialog: false
        };
    },
    components: {
        searchs,
        AudioPlayer,
        DialogCard, DialogBtn
    },

    methods: {
        selectStyle(item) {
            if (item.msg === '音乐') {
                this.$refs.aplayer.ismini = false;
            }
        },
        outStyle() {
            this.$refs.aplayer.ismini = true;
        },
        // 登出
        handleCommand(command) {
            switch (command) {
                case '1':
                    this.$router.push(`/user/${this.$store.state.currentUser.account}`);
                    break;
                case '3':
                    // 
                    this.$http2.post('/logout', {account: this.$store.state.currentUser.account}).then(
                        res => {
                            console.log(res);
                            this.$store.dispatch('setUser', null);
                            window.location.reload();
                        }
                    );
                    break;
            }
        }
        /* debounce(func, wait, immediate) {
            let timer;
            return function () {
                let context = this,
                    args = arguments;

                if (timer) clearTimeout(timer);
                if (immediate) {
                    let callNow = !timer;
                    timer = setTimeout(() => {
                        timer = null;
                    }, wait);
                    if (callNow) func.apply(context, args);
                } else {
                    timer = setTimeout(() => {
                        func.apply;
                    }, wait);
                }
            };
        } */
    }
};
</script>

<style lang="scss">
.mini-header {
    min-height: 100%;
    width: 100%;
    z-index: 1;
    position: absolute;
}
.mini-header-conten {
    min-height: 100%;
    box-sizing: border-box;
    position: relative;
    padding: 10px 200px;
    line-height: 30px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}
.nav-link {
    height: 100%;
    display: flex;
}
.nav-link-li {
    display: block;
    float: left;
    margin: 0px 5px;
    position: relative;
    color: #565;
    cursor: pointer;
}
.isactive {
    background-color: rgb(223, 196, 46);
    display: block;
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    bottom: 0;
    content: '';
    transition: all 0.6s;
    z-index: -1;
}
.nav-link-li a {
    text-decoration: none;
    list-style: none;
    display: block;
    line-height: 32px;
    padding: 4px 28px;
    color: #212220;
    font-weight: 1000;
    font-size: 18px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}
.nav-link-li .router-link-exact-active {
    text-decoration: none;
    color: rgb(223, 196, 46);
}
.nav-link-li :hover {
    color: skyblue;
}
.nav-icon {
    // width: 15%;
    height: 100%;
    display: inline-block;
    // float: left;
    .login {
        float: left;
        padding: 0 10px;
    
    }
    .login-avatar {
        float: left;
        padding: 0 10px;
        height: 36px;
        img {
            height: 36px;
            width: 36px;
            object-fit: cover;
            border-radius: 50%;
            cursor: pointer;
        }
    }
    ul {
        float: left;
        // display: inline-block;
        li {
            // text-decoration: none;
            display: block;
            line-height: 32px;
            padding: 4px 15px;
            float: left;
            cursor: pointer;
            .icon-item {
                font-size: 150%;
            }
        }
    }
    .nav-search {
        width: 100%;
        position: relative;
        float: right;
        z-index: 9;
        .search-none {
            display: none;
        }
        .search-active {
            display: block;
        }
    }
}
</style>
