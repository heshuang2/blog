<template>
    <div id="app" :class="[this.$store.state.mobile ? 'mobile' : 'pc']">
        <vue-particles
            v-if="!this.$store.state.mobile"
            :key="this.$store.state.theme"
            ref="particles"
            :color="$store.state.theme ? '#000' : '#fff'"
            :particleOpacity="0.7"
            :particlesNumber="60"
            shapeType="circle"
            :particleSize="4"
            :linesColor="$store.state.theme ? '#000' : '#fff'"
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
            :class="this.$store.state.theme  ? 'bg-light' : 'bg-dark'"

        >
        </vue-particles>
        <div class="loadding" v-show="this.$store.state.isLoding">
            <svg-icon iconClass="loadding" class="loadding-icon"></svg-icon>
        </div>
        <dialog-card :isDialog.sync="this.$store.getters.isDialog"></dialog-card>
        <!-- <div class="header"></div> -->
        <navbar ref="navbar"/>
<!--        <transition name="fade" mode="out-in" >-->
<!--        </transition>-->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <back-top ref="backTop"></back-top>
        <bottom/>
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
    data() {
        return {
            // 滚动前，滚动条距文档顶部的距离
            oldScrollTop: 0
        };
    },
    created() {
        this.isMobile();
        this._isMobile();
        window.onresize = () => {
            this.isMobile();
            this._isMobile();
        };
    },
    mounted() {
        window.addEventListener('scroll', this.scrollHander, true);
    },
    watch: {
      $route() {
          this.oldScrollTop = 0
      }
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
        },
        scrollHander(e) {
            // 滚动条距文档顶部的距离
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
                document.body.scrollTop;
            // 滚动条滚动的距离
            let scrollStep = scrollTop - this.oldScrollTop;
            // 更新——滚动前，滚动条距文档顶部的距离
            if (scrollStep > 50 || scrollStep < -50) {
                this.oldScrollTop = scrollTop;
            }
            if (scrollStep < -50) {
                this.$refs.backTop.$el.childNodes[0].classList.add('animate__fadeInUp');
                this.$refs.backTop.$el.childNodes[0].classList.remove('animate__fadeOutDown');
                this.$refs.backTop.$el.childNodes[0].style.display = 'flex';
            } else if (scrollStep > 50) {
                this.$refs.backTop.$el.childNodes[0].classList.remove('animate__fadeInUp');
                this.$refs.backTop.$el.childNodes[0].classList.add('animate__fadeOutDown');
                this.$refs.backTop.$el.childNodes[0].style.display = 'none';

            }
            if (scrollTop >= 100) {
                if (scrollStep < -50) {
                    this.$refs.navbar.$el.childNodes[0].classList.remove('animate__fadeOutUp');
                    this.$refs.navbar.$el.childNodes[0].classList.add('animate__fadeInDown');
                } else if (scrollStep > 50) {
                    this.$refs.navbar.$el.childNodes[0].classList.remove('animate__fadeInDown');
                    this.$refs.navbar.$el.childNodes[0].classList.add('animate__fadeOutUp');
                }
            } else {
                this.$refs.navbar.$el.childNodes[0].classList.add('animate__fadeInDown');
                this.$refs.navbar.$el.childNodes[0].classList.remove('animate__fadeOutUp');
            }

        }
    }
};
</script>
<style scoped>

.fade-enter-active, .fade-leave-active {
    transition: all 0s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

</style>
