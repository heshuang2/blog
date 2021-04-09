<template>
    <div id="top" :class="this.$store.state.mobile ? 'bg-light' : ''">
        <div v-if="!this.$store.state.mobile" class="mini-header">
            <div class="mini-header-conten">
                <div class="nav-link">
                    <ul>
                        <li
                            class="nav-link-li"
                            v-for="(item, index) in linknames"
                            :key="index"
                            @click="current = index"
                        >
                            <router-link :to="item.path">
                                <span>{{ item.name }}</span>
                                <!-- <span :class="{ isactive: index === current }"></span> -->
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
        <div v-else class="mobile-header__content bg-light">
            <div class="mobile-header">
                <div class="mobile-header-left flex-middle">
                    <v-touch tag="span" v-show="!isBack" class="v-badge" @tap="isTypeShow = true">
                        <svg-icon iconClass="type" class="menu-icon"></svg-icon>
                    </v-touch>
                    <v-touch tag="span" v-show="isBack" class="v-badge" @tap="$router.go(-1)">
                        <svg-icon iconClass="back1" class="menu-icon"></svg-icon>
                    </v-touch>
                    <v-touch tag="span" v-show="!isPost" class="s-badge" @tap="$router.go(-1)">    
                        <span>{{this.$store.state.articleTitle | beautySub(12)}}</span>
                    </v-touch>
                </div>
                <div class="mobile-header-center flex-middle">
                    <router-link v-show="isPost" :to="'/home'">
                        <img class="logo" src="../assets/img/logo.png" alt="" />
                    </router-link>
                </div>
                <div class="mobile-header-right flex-middle" @click="onSelect">
                    
                    <span class="v-badge">
                        <svg-icon iconClass="menu" class="menu-icon"></svg-icon>
                    </span>
                </div>
            </div>
            <type-card v-if="!isBack" :class="isTypeShow ? 'type-content-show' : 'type-content-close'"></type-card>
            <aside-card
                v-show="isLoad == 1"
                :class="isAsideShow ? 'aside-content-show' : 'aside-content-close'"
                :linknames="linknames"
            ></aside-card>
            <van-overlay :show="isAsideShow" @click="onSelect"> </van-overlay>
        </div>
        <audio-player v-if="!this.$store.state.mobile" ref="aplayer" :isMini="mini"></audio-player>
    </div>
</template>

<script>
import DialogBtn from './dialogCard/DialogBtn.vue';
import DialogCard from './dialogCard/DialogCard.vue';
import AsideCard from './h5_components/asideCard_h5/asideCard_h5.vue';
import TypeCard from './h5_components/typeCard_h5/typeCard_h5.vue';
import AudioPlayer from './musicPlayerChildren/AudioPlayer.vue';
import searchs from './musicPlayerChildren/searchs.vue';
import SvgIcon from './SvgIcon/SvgIcon.vue';

export default {
    components: { searchs },
    name: 'top',
    data() {
        return {
            linknames: [
                { id: 1, name: '主站', path: '/home', icon: 'home' },
                { id: 2, name: '琐碎', path: '/Diarys', icon: 'diarys' },
                { id: 3, name: '留言', path: '/Messages', icon: 'messages' },
                { id: 4, name: '友链', path: '/photos', icon: 'links' }
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
            isDialog: false,
            isTypeShow: false,
            isAsideShow: false,
            isLoad: 0,
            isBack: false,
            isPost: false
        };
    },
    components: {
        searchs,
        AudioPlayer,
        DialogCard,
        DialogBtn,
        SvgIcon,
        TypeCard,
        AsideCard
    },
    watch: {
        isAsideShow() {
            document.body.style.overflow = this.isAsideShow ? 'hidden' : 'inherit';
        },
        $route(to, from) {
            this.isBack = to.name == 'home' || to.name == 'type' ? false : true;
            this.isPost = to.name == 'post' ? false : true;
        }
    },
    mounted() {
        this.isBack = this.$route.name == 'home' || this.$route.name == 'type' ? false : true;
        this.isPost = this.$route.name == 'post' ? false : true;
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
                    this.$http2.post('/logout', { account: this.$store.state.currentUser.account }).then((res) => {
                        console.log(res);
                        this.$store.dispatch('setUser', null);
                        window.location.reload();
                    });
                    break;
            }
        },
        // H5页面弹出遮罩层禁止页面滚动
        onSelect() {
            this.isAsideShow = !this.isAsideShow;
            this.isLoad = 1;
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
    // box-sizing: border-box;
    position: relative;
    padding: 10px 0;
    max-width: 1185px;
    // line-height: 30px;
    margin: auto;
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
.nav-link-li .router-link-active {
    border-bottom: 4px solid rgb(223, 196, 46);
}
.nav-link-li :hover {
    color: rgb(223, 196, 46);
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
// 移动端
.mobile-header__content {
    width: 100%;
    align-items: center;
    display: flex;
    position: relative;
    padding: 1vh 2vh;
    .mobile-header {
        position: relative;
        margin: 0 auto;
        width: 100%;
        height: 100%;
        text-align: center;
        z-index: 1;
        .flex-middle {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .mobile-header-left,
        .mobile-header-right {
            position: absolute;
            top: 0;
            height: 100%;
        }
        .mobile-header-left {
            left: 0;
        }
        .mobile-header-center {
            height: 100%;
            a {
                display: flex;
                align-items: center;
                .logo {
                    width: 5vh;
                    height: 5vh;
                    object-fit: cover;
                }
            }
        }
        .mobile-header-right {
            right: 0;
        }
        .v-badge {
            width: 3rem;
            .menu-icon {
                font-size: 1.5rem;
            }
        }
        .s-badge {
            // padding: 0 1rem;
        }
    }
    .type-content-show {
        height: 100vh;
        background: #202020;
        opacity: 1;
        z-index: 1;
        transition: all 0.5s;
        // transform-origin: 50% 0;
    }
    .type-content-close {
        height: 3.25rem;
        transition: all 0.5s;
        z-index: 0;
        opacity: 0;
    }
    .aside-content-show {
        left: 0;
        opacity: 1;
        animation: slide-left 0.5s;
    }
    .aside-content-close {
        animation: slide-right 0.3s;
        left: -68%;
    }
    :root {
        --animate-duration: 1s;
        --animate-delay: 1s;
        --animate-repeat: 1;
    }
}
</style>
