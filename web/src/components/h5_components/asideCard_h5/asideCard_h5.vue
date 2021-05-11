<template>
    <div class="aside-content" :class="this.$store.state.theme ? 'bg-coffee' : 'bg-pitck'">
        <div class="aside-content-header">
            <div class="aside-avatar" @click="toUsers">
                <div
                    class="aside-avatar-img"
                    :style="{
                        backgroundImage: $store.state.isLogin
                            ? 'url(' + $store.state.currentUser.avatar + ')'
                            : 'url(' + imgSrc + ')'
                    }"
                ></div>
                <div v-if="$store.state.isLogin" class="aside-avatar-user">
                    <div class="aside-user-name">{{ $store.state.currentUser.name }}</div>
                    <div class="aside-user-content text-grey">
                        账号与资料
                        <svg-icon iconClass="info-white"></svg-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="aside-content-body aside-content-bar" :class="this.$store.state.theme ? 'bg-brick' : 'bg-dark'">
            <div class="aside-content-nav">
                <ul class="aside-nav-body">
                    <li v-for="(item, index) in linknames" :key="index" @click="current = index">
                        <a @click="toClick(item.path)">
                            <span class="nav-content">
                                <svg-icon :iconClass="item.icon" class="nav-icon"></svg-icon>
                                {{ item.name }}</span
                            >
                            <span class="nav-content">
                                <svg-icon iconClass="info" class="back-icon"></svg-icon>
                            </span>
                            <span class="nav-border"></span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="aside-content-bottom">
            <div class="aside-group-bar aside-content-bar">
                <svg-icon iconClass="notify" class="group-icon"></svg-icon>
                <svg-icon
                    v-show="this.$store.state.theme === true"
                    iconClass="night"
                    class="group-icon"
                    @click="changeTheme(false)"
                ></svg-icon>
                <svg-icon
                    v-show="this.$store.state.theme === false"
                    iconClass="daytime"
                    class="group-icon"
                    @click="changeTheme(true)"
                ></svg-icon>
            </div>
            <div class="aside-content-bar aside-content-btn">
                <button v-if="!this.$store.state.isLogin" class="login-btn ripple" @click="dialog">登录</button>
                <button v-else class="login-btn ripple" @click="loginOut">退出登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../SvgIcon/SvgIcon.vue';
export default {
    components: { SvgIcon },
    props: {
        linknames: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            imgSrc: require('../../../assets/img/0010.jpg')
        };
    },
    mounted() {
        console.log(this.$store.state);
    },
    methods: {
        toClick(url) {
            let path = this.$route.path;
            this.$parent.isAsideShow = path == url ? true : false;
            setTimeout(() => {
                this.$router.push(url).catch((err) => {
                    err;
                });
            }, 200);
        },
        dialog() {
            this.$store.commit('dialogStatus', true);
        },
        loginOut() {
            this.$http2.post('/logout', { account: this.$store.state.currentUser.account }).then((res) => {
                console.log(res);
                this.$store.dispatch('setUser', null);
                window.location.reload();
            });
        },
        toUsers() {
            this.$router.push(`/user/${ this.$store.state.isLogin ? this.$store.state.currentUser.account : 123456}`).catch((err) => {err});
            this.$parent.isAsideShow = false;
        },
        changeTheme(_state) {
            let theme = _state;
            this.$store.commit('handleTheme', theme);
        }
    }
};
</script>

<style lang="scss">
.aside-content {
    padding: 0;
    position: fixed;
    top: 0;
    left: -68%;
    width: 68%;
    height: 100%;

    z-index: 9;
    color: #fff;
    .aside-content-bar {
        box-sizing: border-box;
        position: relative;
        bottom: 0;
        padding: 2vh;
        border-radius: 2rem 2rem 0 0;
    }
    .aside-content-header {
        // height: 10%;
        padding: 3rem 1rem;
        .aside-avatar {
            padding: 0.5rem;
            display: flex;
            // justify-content: center;
            // align-items: center;
            .aside-avatar-img {
                height: 84px;
                width: 84px;
                background-size: cover;
                background-position: center center;
                border-radius: 1rem;
            }
        }
        .aside-avatar-user {
            padding-left: 1rem;

            .aside-user-name {
                font-size: 21px;
                padding-bottom: 1.5rem;
            }
            .aside-user-content {
                font-size: 13px;
            }
        }
    }
    .aside-content-body {
        position: absolute;
        width: 100%;
        height: 75%;
        bottom: 0;
    }
    .aside-content-bottom {
        position: absolute;
        width: 100%;
        bottom: 0;
        .aside-group-bar {
            display: flex;
            justify-content: space-between;
            .group-icon {
                font-size: 24px;
                padding: 0 1rem;
            }
        }
    }
    .aside-content-nav {
        .aside-nav-body {
            display: inline-block;
            color: #fff;
            width: 100%;
            padding: 2rem 0;
            box-sizing: border-box;
            li {
                width: 100%;
                height: 3rem;
                line-height: 3rem;
                a {
                    width: 100%;
                    color: #fff;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    .nav-content {
                        padding: 0 1vh;
                        .nav-icon {
                            padding: 0 1vh;
                        }
                    }
                    .nav-border {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border-radius: 2rem;
                        opacity: 0;
                        background: rgba(255, 255, 255, 0.74);
                    }
                }
                a:active {
                    .nav-border {
                        opacity: 0.2;
                    }
                }
            }
        }
    }
    .aside-content-btn {
        .login-btn {
            width: 100%;
            height: 6vh;
            background-color: #c57807;
            border: none;
            border-radius: 2rem;
        }
    }
}
</style>