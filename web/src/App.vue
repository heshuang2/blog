<template>
    <div id="app">
        <vue-particles
            color="#fff"
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
        <dialog-card :isDialog.sync="this.$store.getters.isDialog"></dialog-card>
        <!-- <div class="header"></div> -->
        <navbar />
        <router-view></router-view>
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
    }
};
</script>
<style></style>
