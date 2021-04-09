<template>
    <div id="app" :class="this.$store.state.mobile ? 'mobile' : 'pc'" class="bg-white">
        <vue-particles
            v-if="this.$store.state.device"
            color="#000"
            :particleOpacity="0.7"
            :particlesNumber="120"
            shapeType="circle"
            :particleSize="4"
            linesColor="#000"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
            class="lizi"
        >
        </vue-particles>
        <div class="loadding" v-show="this.$store.state.isLoding">
            <svg-icon iconClass="loadding" class="loadding-icon"></svg-icon>
        </div>
        <dialog-card :isDialog.sync="this.$store.getters.isDialog"></dialog-card>
        <!-- <div class="header"></div> -->
        <navbar />
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <back-top></back-top>
        <bottom />
    </div>
</template>

<script>
import navbar from './components/top';
import bottom from './components/bottom';
import BackTop from './components/backTop/backTop';
import AudioPlayer from './components/musicPlayerChildren/AudioPlayer.vue';
import DialogCard from './components/dialogCard/DialogCard.vue';
export default {
    components: {
        navbar,
        bottom,
        BackTop,
        AudioPlayer,
        DialogCard
    },
    created() {
        this.isMobile();
        this._isMobile();
        window.onresize = () => {
            this.isMobile();
            this._isMobile();
        };
    },
    methods: {
        isMobile() {
            let pageWidth = this.hasScrollbar() ? document.body.clientWidth + 8 : document.body.clientWidth;
            if (pageWidth >= 1264) {
                this.$store.commit('handleDevice', true);
            } else {
                this.$store.commit('handleDevice', false);
            }
            // console.log(this.$store.state.device);
        },
        _isMobile() {
            let flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            // console.log(flag);
            if (flag) {
                this.$store.commit('handleMobile', true);
            } else {
                this.$store.commit('handleMobile', false);
            }
            // console.log(this.$store.state.mobile);
        },
        hasScrollbar() {
            return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
        }
    }
};
</script>
<style></style>
