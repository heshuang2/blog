<template>
    <div id="music">
        <div class="player">
            <div class="close-player" @click="closePlayer">
                <svg-icon icon-class="arrow-down-dark" class="close-player-icon"></svg-icon>
            </div>
            <div class="player_full">
                <img class="player-background"
                     :src="currentMusic.cover"
                     :class="{opacity: true}" alt=""/>
                <!--                             @error="img_error"-->
                <div class="player-color"></div>
                <div class="player-header">
                    <div class="player-name text-white">{{ currentMusic.name }}</div>
                    <div class="player-artist text-grey">{{ currentMusic.artist }}</div>
                </div>
                <div class="middle">
                    <div class="disc">
                        <div class="disc_neddle">
                            <img src="../assets/img/disc_neddle.png"/>
                        </div>
                        <div class="disc_pan">
                            <img ref="img" :src="currentMusic.cover" alt="">
                        </div>
                    </div>
                    <div class="player-bottom">
                        <div class="bar">
                            <div class="active_time">
                                {{ time_update }}
                            </div>
                            <progress-bar ref="progress" :precent="precent" :audio_is_ready="isAudioReady"
                                          @time_change="time_change" @audio_change="audio_change">
                            </progress-bar>
                            <div class="total_time">
                                {{ time_minute }}
                            </div>
                        </div>
                        <!--播放器控制按钮，此处图标是我自己封装的svg组件-->
                        <div class="player-control flex-center">
                            <div class="player_mode flex-center">
                                <span class="control-btn">
                                    <svg-icon icon-class="play_list_loop"></svg-icon>
                                </span>
                            </div>
                            <div class="center_control flex-center">
                                <span>
                                    <svg-icon icon-class="prev" @click="prevSong"></svg-icon>
                                </span>
                                <span>
                                    <svg-icon
                                        :icon-class="$store.state.playStatus === 'pause' ? 'play_control' : 'pause_control'"
                                        @click="playAudio()"></svg-icon>
                                </span>
                                <span>
                                    <svg-icon icon-class="next" @click="nextSong"></svg-icon>
                                </span>
                            </div>
                            <div class="song_list flex-center">
                                <span class="control-btn">
                                    <svg-icon icon-class="music_list" @click="openMusicList"></svg-icon>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <music-list-card ref="music_list_card" :audio="audio" :currentMusic="currentMusic"
                @switchMusic="switchMusic" @closeMusicList="openMusicList">
                </music-list-card>
                <van-overlay :show="isMusicList" @click="openMusicList"></van-overlay>
            </div>
        </div>
        <audio ref="audio" :src="currentMusic.url" @timeupdate="audio_update"
               @ended="audioEnd"></audio>
    </div>
</template>

<script>
import ProgressBar from '../components/h5_components/musicPlayer_h5/ProgressBar';
import Logo from '../../../admin/src/layout/components/Sidebar/Logo';
import MusicListCard from '../components/h5_components/musicPlayer_h5/musicListCard';

export default {
    name: 'Music',
    components: { MusicListCard, ProgressBar },
    props: {
        musicShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            el: null,
            audio: [],
            index: 0,
            currentMusic: {},
            rotateVal: 0, // 封面旋转角度
            InterVal: null, // 定时器
            Timeout: null,
            isAudioReady: false, // 缓冲是否完成
            newPrecent: 0,
            bar_is_move: false, //判断进度条是否正在移动
            duration: 0,
            currentTime: 0,
            time_minute: '00:00', // 播放剩余时间
            isiOS: false,
            isMusicList: false,
            playStatus: false // 播放状态
        };
    },
    mounted() {
        this.getMusicList();
    },
    watch: {
        '$store.state.playStatus'() {
            const el = document.querySelector('.disc_neddle')
            if (this.$store.state.playStatus === 'playing' && this.isAudioReady) {
                el.style.transform = 'rotate3d(0, 0, 1, -5deg)';
                this.el.play();
                this.Timeout = setTimeout(() => {
                    this.utils.rotate.call(this, this.$refs.img, 1);
                }, 500);
            } else {
                el.style.transform = 'rotate3d(0, 0, 1, -40deg)';
                this.el.pause();
                clearTimeout(this.Timeout);
                clearInterval(this.InterVal);
            }
        },
        'currentTime'() {
            this.time_minute = this.utils.time_minute(this.duration - this.currentTime);
        },
        'currentMusic'() {
            this.currentTime = 0;
            this.bar_is_move = true;
            this.rotateVal = 0;
            this.$refs.progress.length_copy = 0;
        }
    },
    computed: {
        time_update() {
            return this.utils.time_minute(this.currentTime);
        },
        //歌曲播放时current_time变化而引起的进度条的变化.
        precent() {
            if (!this.bar_is_move) {
                // console.log('currentTime',this.currentTime);
                // console.log('duration',this.duration);
                return (this.currentTime / this.duration) * 100;
            }
        }
    },
    methods: {
        getMusicList() {
            this.$http2.get('rest/music').then((res) => {
                const { data } = res.data;
                console.log(data);
                this.audio = data;
                this.currentMusic = this.audio[0];
                this.$store.commit('handleCurrentMusic', this.currentMusic);
                this.el = this.$refs.audio;
                this.isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
                this.el.load();
                this.el.addEventListener('loadedmetadata', this.audio_ready, true);
            });
        },
        // 获取播放时长
        audio_ready() {
            if (!this.isAudioReady) {
                this.isAudioReady = true;
                this.duration = parseFloat(this.el.duration.toFixed(4));
                this.bar_is_move = false;
                this.time_minute = this.utils.time_minute(this.el.duration - this.currentTime);
                if (this.playStatus) {
                    this.el.play();
                    console.log(this.isAudioReady);
                    this.$store.commit('handlePlayStatus', 'playing');
                }
            }
            // this.currentMusic.currentTime = this.el.currentTime;
        },
        // 播放时间发生改变
        audio_update() {
            if (!this.bar_is_move) {
                this.currentTime = this.el.currentTime;
            }
        },
        // 当前歌曲播放结束
        audioEnd(e) {
            this.playStatus = true;
            this.$store.commit('handlePlayStatus', 'playing');
            this.nextSong();
        },
        // 切换下一首
        nextSong() {
            if (this.index >= this.audio.length - 1) {
                this.index = 0;
            } else {
                this.index += 1;
            }
            this.setPlayMusic(this.index);
        },
        // 切换上一首
        prevSong() {
            if (this.index <= 0) {
                this.index = this.audio.length - 1;
            } else {
                this.index -= 1;
            }
            this.setPlayMusic(this.index);
        },
        setPlayMusic(index) {
            this.currentMusic = this.audio[index];
            this.$store.commit('handleCurrentMusic', this.currentMusic);
            this.isAudioReady = false;
            this.el.load();
            this.el.addEventListener('loadedmetadata', this.audio_ready, true);

        },
        playAudio() {
            console.log(this.$store.state.playStatus);
            if (this.$store.state.playStatus === 'playing') {
                //    暂停播放
                this.playStatus = false;
                this.$store.commit('handlePlayStatus', 'pause');
            } else {
                //    开始播放
                this.playStatus = true;
                this.$store.commit('handlePlayStatus', 'playing');
            }
        },
        // 关闭播放器
        closePlayer() {
            this.$emit('update:musicShow', false);
            this.$refs.music_list_card.$el.classList.remove('animate__fadeOutDown');
            this.$refs.music_list_card.$el.classList.remove('animate__fadeInUp');
            if (!this.isMusicList) {
                this.$refs.music_list_card.$el.style.opacity = 0;
                this.$refs.music_list_card.$el.style.zIndex = -2;
            }
        },
        // 接受进度条拖拽过程中传过来的 precent
        time_change(num) {
            this.newPrecent = parseFloat((num * this.duration / 100).toFixed(4));
            if (this.duration === this.newPrecent) {
                this.newPrecent = this.duration - 1;
            }
            this.currentTime = this.newPrecent;
            this.bar_is_move = true;
        },
        // 进度条拖拽事件结束跳转到指定播放时间
        audio_change(num) {
            this.bar_is_move = false;
            // this.el.load();
            if (this.isiOS && this.$store.state.playStatus === 'pause') {
                this.el.play();
                this.el.pause();
                this.el.currentTime = this.newPrecent;
            } else {
                this.el.currentTime = this.newPrecent;
            }

            this.$refs.progress.touch.init = false;
        },
        //显示播放列表
        openMusicList() {
            if (!this.isMusicList) {
                this.isMusicList = true;
                this.$refs.music_list_card.$el.classList.remove('animate__fadeOutDown');
                this.$refs.music_list_card.$el.classList.add('animate__fadeInUp');
                this.$refs.music_list_card.$el.style.opacity = 1;
                this.$refs.music_list_card.$el.style.zIndex = 2;
            } else {
                this.isMusicList = false;
                this.$refs.music_list_card.$el.classList.remove('animate__fadeInUp');
                this.$refs.music_list_card.$el.classList.add('animate__fadeOutDown');
            }
        },
        //播放列表切换音乐
        switchMusic(index) {
            console.log(this.index);
            if  (index !== this.index) {
                this.index = index;
                this.playStatus = true;
                this.setPlayMusic(this.index);
            }
        },
        closeMusicList() {

        }
     }
};
</script>

<style lang="scss" scoped>
#music {
    position: fixed;
    //position: relative;
    width: 100%;
    height: 100%;

    .player {
        height: 100%;

        .close-player {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            margin: 1rem 1.5rem;

            .close-player-icon {
                font-size: 2rem;
            }
        }

        .player_full {
            position: relative;
            z-index: 9;
            width: 100%;
            height: 100%;

            .player-background {
                position: fixed;
                z-index: -1;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                background-position-x: center;
                background-position-y: center;
                filter: blur(2rem) brightness(.8);
                transform: scale(1.5);
            }

            .player-color {
                position: fixed;
                z-index: -2;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 1);
            }

            .player-header {
                position: fixed;
                width: 100%;
                top: 1rem;
                text-align: center;
                font-weight: 300;
                font-family: "Open Sans", sans-serif;

                .player-name {
                    font-size: 1.2rem;
                    padding: .2rem;
                }

                .player-artist {
                    font-size: .9rem;
                }
            }

            .middle {
                position: fixed;
                width: 100%;
                top: 4.2rem;
                bottom: 140px;

                .disc {
                    position: relative;
                    overflow: hidden;

                    .disc_neddle {
                        position: absolute;
                        z-index: 11;
                        top: 0;
                        width: 110px;
                        left: calc(50% - 18px);
                        height: 157px;
                        transform-origin: 16.8px 17px;
                        transform: rotate3d(0, 0, 1, -40deg);
                        transition: all 1s;
                        //animation: rotate_1 1s linear;
                        img {
                            width: 100%
                        }
                    }

                    .disc_pan {
                        position: relative;
                        z-index: 10;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 21rem;
                        height: 21rem;
                        background-image: url(../assets/img/disc_pan.png);
                        background-size: cover;
                        margin: 72px auto 0;

                        img {
                            width: 13.5rem;
                            height: 13.5rem;
                            border-radius: 50%;
                            object-fit: cover;
                        }
                    }

                }

                .player-bottom {
                    position: fixed;
                    width: 100%;
                    bottom: 0;
                    padding-bottom: 2rem;

                    .bar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 13px;
                        height: 13px;
                        margin: 0 20px 20px;
                        color: #fff;

                    }

                    .player-control {
                        margin: 0 1.5rem;
                        justify-content: space-between;

                        .center_control {
                            justify-content: space-between;

                            > span {
                                //overflow: auto;
                                padding: .5rem .8rem;
                                font-size: 3rem;
                                display: flex;
                                align-items: center;

                            }

                            span:nth-child(2) {
                                font-size: 4rem;
                            }
                        }

                        .control-btn {
                            display: flex;
                            align-items: center;
                            font-size: 2rem;
                        }

                    }
                }
            }
        }
    }
}
</style>