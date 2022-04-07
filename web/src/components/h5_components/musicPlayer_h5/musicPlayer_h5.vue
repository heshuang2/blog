<template>
    <div class="musicPlayer_h5">
        <div class="musicPlayer_cover"  @click="getAudio">
            <img ref="img" :src="$store.state.currentMusic.cover" alt="">
            <div class="playerButtons">
                <span>
                    <svg-icon :icon-class="$store.state.playStatus" class="btn-icon"></svg-icon>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import AudioPlayer from '../../musicPlayerChildren/AudioPlayer';
export default {
    name: 'musicPlayer_h5',
    components: { AudioPlayer },
    data() {
        return {
            rotateVal: 0, // 封面旋转角度
            imgCover: '', // 封面
            InterVal: null, // 定时器
        }
    },
    watch: {
        '$store.state.playStatus'() {
            if (this.$store.state.playStatus === 'playing') {
                this.utils.rotate.call(this ,this.$refs.img, 10);
            } else {
                clearInterval(this.InterVal);
            }
        }
    },
    methods: {
        getAudio() {
            this.$emit('update:musicShow', true);
           /* if (this.$store.state.playStatus === 'play') {
                //    暂停播放
                this.$store.commit('handlePlayStatus', 'pause');
            } else {
                //    开始播放
                this.$store.commit('handlePlayStatus', 'play');

            }*/
        },
        // 设置定时器
    }
};
</script>

<style lang="scss">
.musicPlayer_h5 {
    height: 2.5rem;
    width: 2.5rem;
    .musicPlayer_cover {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        img {
            height: 2.5rem;
            width: 2.5rem;
            object-fit: cover;
            border-radius: 50%;
        }
        .playerButtons {
            width: 1.2rem;
            height: 1.2rem;
            position: absolute;
            border-radius: 50%;
            line-height: 1.2rem;
            .btn-icon {
                font-size: 1.2rem;
            }
        }
    }
}

</style>