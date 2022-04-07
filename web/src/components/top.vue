<template>
    <div id="top" >
        <!--pc-->
        <div v-if="!this.$store.state.mobile" class="mini-header " :class="this.$store.state.theme ? 'bg-white' : 'bg-dark'"
        >
            <div class="mini-header-conten ">
                <div class="nav-link">
                    <ul>
                        <li
                            class="nav-link-li"
                            v-for="(item, index) in linknames"
                            :key="index"
                            @click="current = index"
                        >
                            <router-link :to="item.path">
                                <span :class="$store.state.theme ? 'text-black' : 'text-white'">{{ item.name }}</span>
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
                                    :icon-class="$store.state.theme ? item.icon1 : item.icon2"
                                    class="icon-item"
                                    @mouseover="selectStyle(item)"
                                    @mouseleave="outStyle"
                                />
                            </li>
                        </el-popover>
                        <li>
                            <el-tooltip content="切换主题" placement="bottom">
                                <svg-icon :icon-class="$store.state.theme ? 'night-black' : 'daytime'"
                                          class="icon-item" @click="changeTheme(!$store.state.theme)"></svg-icon>
                            </el-tooltip>
                        </li>
                    </ul>
                    <div class="login" v-if="!this.$store.state.isLogin">
                        <dialog-btn></dialog-btn>
                    </div>
                    <el-dropdown v-else placement="bottom" trigger="click" @command="handleCommand">
                        <div class="login-avatar">
                            <img :src="this.$store.state.currentUser.avatar" alt=""/>
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
        <!--h5-->
        <div v-else class="mobile-header__content animate__animated animate__fadeInDown" :class="this.$store.state.theme  ? 'bg-light text-black' : 'bg-dark text-white'" >
            <div class="mobile-header " >
                <div class="mobile-header-left flex-middle">
                    <div  v-show="!isBack" class="v-badge" @click="isTypeShow = true">
                        <svg-icon iconClass="type" class="menu-icon"></svg-icon>
                    </div>
                    <div  v-show="isBack" class="v-badge" @click="$router.back()">
                        <svg-icon :iconClass="this.$store.state.theme ? 'back1' : 'back1-dark'"
                                  class="menu-icon"></svg-icon>
                    </div>
                    <div  v-show="!isPost" class="s-badge">
                        <span>{{ this.$store.state.articleTitle | beautySub(11) }}</span>
                    </div>
                </div>
                <div class="mobile-header-center flex-middle">

                </div>
                <div class="mobile-header-right flex-middle" >
                    <music-player_h5 :musicShow.sync="musicShow"></music-player_h5>
                    <span class="v-badge" @click="onSelect">
                        <svg-icon :iconClass="$store.state.theme ? 'menu' : 'menu_dark'" class="menu-icon"></svg-icon>
                    </span>
                </div>
            </div>
            <type-card v-if="!isBack" :class="isTypeShow ? 'type-content-show' : 'type-content-close'"></type-card>
        </div>
        <aside-card
            v-show="isLoad === 1" ref="asideCard"
            :class="isAsideShow ? 'aside-content-show' : 'aside-content-close'"
            :linknames="linknames"
        ></aside-card>
        <van-action-sheet v-model="musicShow" class="music-card" :round="false">
            <music  :music-show.sync="musicShow"></music>
        </van-action-sheet>
        <van-overlay :show="isAsideShow" @click="onSelect"></van-overlay>
        <audio-player v-if="!$store.state.mobile"  ref="aplayer" :isMini="mini" class="aplayer"></audio-player>
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
import MusicPlayer_h5 from './h5_components/musicPlayer_h5/musicPlayer_h5';
import Music from '../views/Music';

export default {
    components: {
        Music,
        MusicPlayer_h5,
        searchs,
        AudioPlayer,
        DialogCard,
        DialogBtn,
        SvgIcon,
        TypeCard,
        AsideCard
    },
    name: 'top',
    data() {
        return {
            linknames: [
                { id: 1, name: '主站', path: '/home', icon: 'home' },
                { id: 2, name: '琐碎', path: '/Diarys', icon: 'diarys' },
                { id: 3, name: '留言', path: '/Messages', icon: 'messages' },
                { id: 4, name: '友链', path: '/links', icon: 'links' },
            ],
            navIcon: [
                {
                    msg: '搜索',
                    icon1: 'icon-search',
                    icon2: 'icon-search-black'
                },
                {
                    msg: '音乐',
                    icon1: 'icon-music',
                    icon2: 'icon-music-black'
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
            isPost: false,
            isHome: false,
            musicShow: false, // 音乐播放界面
        };
    },

    watch: {
        isAsideShow() {
            document.body.style.overflow = this.isAsideShow ? 'hidden' : 'inherit';
        },
        $route(to, from) {
            this.isBack = !['home', 'type'].includes(to.name);
            this.isPost = to.name !== 'post';
            this.isHome = to.name !== 'home';
              if (to.name === 'Reset') {
                this.isAsideShow = false;
            }
        }
    },
    mounted() {
        this.isBack = !['home', 'type'].includes(this.$route.name);
        this.isPost = this.$route.name !== 'post';
        this.isHome = this.$route.name !== 'home';
        console.log(this.$refs.music);
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
        // 切换主题
        changeTheme(_state) {
            this.$store.commit('handleTheme', _state);
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
    }
};
</script>

<style lang="scss">
.mini-header {
    height: 3.25rem;
    width: 100%;
    z-index: 1;
    position: absolute;
    border-bottom: 1px solid #ccc;
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

    span {
        color: rgb(223, 196, 46);
    }
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
        // background: #202020;
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





    :root {
        --animate-duration: 1s;
        --animate-delay: 1s;
        --animate-repeat: 1;
    }


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
.music-card {
    max-height: 100% !important;
    height: 100%;
}
</style>
