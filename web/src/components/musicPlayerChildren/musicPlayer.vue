<template>
    <div id="musicCard">
        <el-card shadow="hover">
            <main class="audioPlayer" >
                <a
                    class="nav-icon"
                    v-on:click="isPlaylistActive = !isPlaylistActive"
                    :class="{ isActive: isPlaylistActive }"
                    title="Music List"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
                <div
                    class="audioPlayerList"
                    :class="{ isActive: isPlaylistActive }"
                >
                    <div
                        class="item"
                        v-for="(item, index) in musicPlaylist"
                        :key="index"
                        v-bind:class="{ isActive: isCurrentSong(index) }"
                        v-on:click="
                            changeSong(index),
                                (isPlaylistActive = !isPlaylistActive)
                        "
                    >
                        <p class="title">{{ item.title }}</p>
                        <p class="artist">{{ item.artist }}</p>
                    </div>
                </div>
                <div
                    class="audioPlayerUI"
                    :class="{ isDisabled: isPlaylistActive }"
                >
                    <div class="albumImage">
                        <transition
                            name="ballmove"
                            enter-active-class="animated zoomIn"
                            leave-active-class="animated fadeOutDown"
                            mode="out-in"
                        >
                            <!--封面-->
                            <img
                                ref="img"
                                @load="onImageLoaded()"
                                :src="musicPlaylist[currentSong].image"
                                :key="currentSong"
                                ondragstart="return false;"
                                id="playerAlbumArt"
                            />
                        </transition>
                           <span :class="{riffle1: isRiff}"></span>
                           <span :class="{riffle2: isRiff}"></span>
                    </div>
                    <div class="albumDetails">
                        <transition name="slide-fade" mode="out-in">
                            <p class="title" :key="currentSong">
                                {{ musicPlaylist[currentSong].title }}
                            </p>
                        </transition>
                        <transition name="slide-fade" mode="out-in">
                            <p class="artist" :key="currentSong">
                                {{ musicPlaylist[currentSong].artist }}
                            </p>
                        </transition>
                    </div>

                    <div class="playerButtons">
                        <a
                            class="button"
                            :class="{ isDisabled: currentSong == 0 }"
                            @click="prevSong()"
                            title="Previous Song"
                            ><i class="el-icon-caret-left"></i
                        ></a>
                        <a
                            class="button play"
                            v-on:click="playAudio()"
                            title="Play/Pause Song"
                        >
                            <transition name="slide-fade" mode="out-in">
                                <i
                                    class="el-icon-video-play"
                                    :class="[
                                        currentlyStopped
                                            ? 'el-icon-video-pause'
                                            : currentlyPlaying
                                            ? 'el-icon-video-pause'
                                            : 'el-icon-video-play',
                                    ]"
                                    :key="1"
                                ></i>
                            </transition>
                        </a>
                        <a
                            class="button"
                            :class="{
                                isDisabled:
                                    currentSong == musicPlaylist.length - 1,
                            }"
                            v-on:click="nextSong()"
                            title="Next Song"
                            ><i class="el-icon-caret-right"></i
                        ></a>
                    </div>

                    <div class="currentTimeContainer" style="text-align:center">
                        <span class="currentTime">{{
                            currentTime | fancyTimeFormat
                        }}</span>
                        <span class="totalTime">
                            {{ trackDuration | fancyTimeFormat }}</span
                        >
                        <!--<span style="color:black">({{ currentSong+1 }}/{{ musicPlaylist.length }})</span>-->
                    </div>
                    <div class="currentProgressBar">
                        <div
                            class="currentProgress"
                            :style="{ width: currentProgressBar + '%' }"
                        ></div>
                    </div>
                </div>
            </main>
        </el-card>
        <searchs @musicId="getMusicData"></searchs>
    </div>
</template>

<script>
import searchs from "./searchs";
export default {
    data() {
        return {
            audio: "",
            imgLoaded: false,
            // 是否播放
            currentlyPlaying: false,
            currentlyStopped: false,
            currentTime: 0,
            checkingCurrentPositionInTrack: "",
            trackDuration: 0,
            currentProgressBar: 0,
            isPlaylistActive: false,
            currentSong: 0,
            debug: false,
            // 封面旋转角度
            rotateVal: 0,
            // 定时器
            InterVal: null,
            img: null,
            musicPlaylist: [
                {
                     title: "我的一个道姑朋友",
                    artist: "以冬",
                    url:"http://cdn5.lizhi.fm/audio/2017/12/31/2644586399417379846_hd.mp3",
                    image: "https://cdnimg103.lizhi.fm/audio_cover/2017/12/31/2644589622789729799_320x320.jpg"
                }
            ],
            audioFile: "",
            // 搜索框内容
            input: "",
            drawer: false,
            // 歌曲url
            musicURL: "",
            // 歌曲详情
            musicData: [],
            // 歌单内歌曲是否相同
            isPush: true,
            isRiff: false
        };
    },
    components: {
        searchs,
    },
    mounted: function() {
        this.changeSong();
        this.audio.loop = false;
    },
    destroyed() {
        this.stopAudio();
    },
    filters: {
        fancyTimeFormat: function(s) {
            return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
        },
    },
    methods: {
        togglePlaylist: function() {
            this.isPlaylistActive = !this.isPlaylistActive;
        },
        // 下一首
        nextSong: function() {
            if (this.currentSong < this.musicPlaylist.length - 1)
                this.changeSong(this.currentSong + 1);
        },
        // 上一首
        prevSong: function() {
            if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
        },
        changeSong: function(index) {
            var wasPlaying = this.currentlyPlaying;
            this.imageLoaded = false;
            if (index !== undefined) {
                this.stopAudio();
                this.currentSong = index;
            }
            this.audioFile = this.musicPlaylist[this.currentSong].url;
            this.audio = new Audio(this.audioFile);
            var localThis = this;
            this.rotateVal = 0;
            clearInterval(this.InterVal);
            // 判断音频的源数据是否加载完成
            this.audio.addEventListener("loadedmetadata", function() {
                localThis.trackDuration = Math.round(this.duration);
            });
            // 监听当前音乐是否播放完毕
            this.audio.addEventListener("ended", this.handleEnded);
            // 判断是否在播放中点击切换
            if (wasPlaying) {
                this.playAudio();
            }
        },
        isCurrentSong: function(index) {
            if (this.currentSong == index) {
                return true;
            }
            return false;
        },
        getCurrentSong: function(currentSong) {
            return this.musicPlaylist[currentSong].url;
        },
        // 开始播放
        playAudio: function() {
            if (
                this.currentlyStopped == true &&
                this.currentSong + 1 == this.musicPlaylist.length
            ) {
                this.currentSong = 0;
                this.changeSong();
            }
            if (this.imgLoaded && !this.currentlyPlaying) {
                this.getCurrentTimeEverySecond(true);
                this.currentlyPlaying = true;
                this.audio.play();
                this.rotate(this.img);
                this.isRiff = true;
            } else {
                this.stopAudio();
            }
            this.currentlyStopped = false;
        },
        // 暂停播放
        stopAudio: function() {
            this.audio.pause();
            this.isRiff = false;
            clearInterval(this.InterVal);
            this.currentlyPlaying = false;
            this.pausedMusic();
        },
        // 播放完切换下一首
        handleEnded: function() {
            if (this.currentSong + 1 == this.musicPlaylist.length) {
                this.currentlyPlaying = false;
                this.currentlyStopped = true;
                this.changeSong(0);
                this.playAudio();
            } else {
                this.currentlyPlaying = false;
                this.currentSong++;
                this.changeSong();
                this.playAudio();
                // this.rotate(img);
            }
        },
        // 监听歌曲封面加载完成
        onImageLoaded: function() {
            this.imgLoaded = true;
            this.img = this.$refs.img;
            if (this.currentlyPlaying) {
                clearInterval(this.InterVal);
                this.rotate(this.img);
            }
        },
        getCurrentTimeEverySecond: function(startStop) {
            var localThis = this;
            this.checkingCurrentPositionInTrack = setTimeout(
                function() {
                    localThis.currentTime = localThis.audio.currentTime;
                    localThis.currentProgressBar =
                        (localThis.audio.currentTime /
                            localThis.trackDuration) *
                        100;
                    localThis.getCurrentTimeEverySecond(true);
                }.bind(this),
                1000
            );
        },
        pausedMusic: function() {
            clearTimeout(this.checkingCurrentPositionInTrack);
        },
        toggleDebug: function() {
            this.debug = !this.debug;
            document.body.classList.toggle("debug");
        },
        // 设置定时器
        rotate(img) {
            this.InterVal = setInterval((_) => {
                this.rotateVal += 1;
                // 设置旋转属性(顺时针)
                img.style.transform = "rotate(" + this.rotateVal + "deg)";
                // 设置旋转属性(逆时针)
                //img.style.transform = 'rotate(-' + rotateVal + 'deg)'
                // 设置旋转时的动画  匀速0.1s
                img.style.transition = "0.1s linear";
            }, 100);
        },
        // 获取音乐
        async getMusicData(id) {
            
            const { data: res1 } = await this.$http1.get("/song/url", {
                params: {
                    id: id,
                },
            });
            this.musicURL = res1.data[0].url;

            const { data: res2 } = await this.$http1.get("/song/detail", {
                params: {
                    ids: id,
                },
            });
            this.musicData = res2.songs[0];
            this.musicPlaylist.forEach((item, index) => {
                if (item.id === id) {
                    this.isPush = false;
                    this.stopAudio();
                    this.changeSong(index);
                    this.playAudio();
                }
            });
            if (this.isPush) {
                this.musicPlaylist.push({
                    id: id,
                    title: this.musicData.name,
                    artist: this.musicData.ar[0].name,
                    url: this.musicURL,
                    image: this.musicData.al.picUrl,
                });
                console.log(this.musicPlaylist);
                this.stopAudio();
                this.changeSong(this.musicPlaylist.length - 1);
                this.playAudio();
            }
            this.isPush = true;
        },
    },
    watch: {
        currentTime: function() {
            this.currentTime = Math.round(this.currentTime);
        },
    },
    beforeDestroy: function() {
        this.audio.removeEventListener("ended", this.handleEnded);
        this.audio.removeEventListener("loadedmetadata", this.handleEnded);
        clearTimeout(this.checkingCurrentPositionInTrack);
    },
};
</script>

<style lang="scss" scoped>
#musicCard {
    width: 300px;
}
.el-card {
    margin-top: 10px;
    // border: none;
    border-radius: 0.5rem;
}

// @import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700");

// @import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

$primary_color: #fff;
$player_width: 20rem;
$player_padding: 1.5rem;
$player_border_radius: 0.5rem;

$button_size: 1.5rem;

$anim_duration: 0.5s;

/* Debugging */
.debug {
    main * {
        outline: solid 0.25rem rgba(255, 0, 0, 0.25);
    }
}

.audioPlayer {
    position: relative;
    background: #383749;
    width: 300px;
    min-height: 13.5rem;
    box-sizing: border-box;
    overflow: hidden;
    padding: $player_padding;
    margin: 0 auto;
    border-radius: $player_border_radius;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
    user-select: none;
    .nav-icon {
        position: absolute;
        width: 15px;
        height: 12px;
        position: absolute;
        top: ($player_padding)- ($player_padding/4);
        left: $player_padding;
        z-index: 1;
        transform: rotate(0deg);
        transition: 0.25s ease-in-out;
        cursor: pointer;

        span {
            display: block;
            position: absolute;
            height: 2px;
            width: 100%;
            background: $primary_color;
            border-radius: 6px;
            opacity: 1;
            left: 0;
            transform: rotate(0deg);
            transition: 0.5s ease-in-out;
        }
        span:nth-child(1) {
            top: 0px;
        }

        span:nth-child(2) {
            top: 5px;
        }

        span:nth-child(3) {
            top: 10px;
        }

        &.isActive span:nth-child(1) {
            top: 5px;
            transform: rotate(135deg);
        }

        &.isActive span:nth-child(2) {
            opacity: 0;
            left: -60px;
        }

        &.isActive span:nth-child(3) {
            top: 5px;
            transform: rotate(-135deg);
        }
    }
    .audioPlayerList {
        color: $primary_color;
        width: ($player_width)- (2 * $player_padding);
        transition: $anim_duration;
        transform: translateX(-200%);
        position: absolute;
        margin-top: 0.5rem;
        overflow-y: auto;
        z-index: 10;
        will-change: transform;
        max-height: 160px;
        &.isActive {
            transform: translateX(0);
        }
        .item {
            margin-top: 0.2rem;
            border-left: 0.1rem solid transparent;
            transition: 0.2s;
            overflow: hidden;
            &:hover {
                padding-left: 0.5rem;
                cursor: pointer;
            }
            .title {
                
                font-size: 1rem;
                margin: 0.3rem 0;
            }
            .artist {
                color: $primary_color;
                font-size: 0.8rem;
                margin: 0;
            }
            &.isActive {
                border-left-color: black;
                padding-left: 1rem;
            }
        }
        .debugToggle {
            cursor: pointer;
            color: red;
        }
    }
    .audioPlayerList::-webkit-scrollbar {
        width: 5px;
    }
    .audioPlayerList::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #bababa;
    }
    .audioPlayerUI {
        position: relative;
        display: block;
        margin-top: 0;
        will-change: transform, filter;
        transition: $anim_duration;
        &.isDisabled {
            transform: scale(0.75) translateX(100%);
            filter: blur(5px) grayscale(100%);
        }
        .albumDetails {
            text-align: center;
            margin: 0;
            width: 122px;
            height: 45px;
            position: absolute;
            display: block;
            right: 0;
            top: 1rem;
            margin: 0.1rem 0;
            p {
                margin: 0px;
                &.title {
                    font-size: 1rem;
                    width: 122px;
                    height: 21px;
                    color: #fff;
                    overflow: hidden;
                    font-weight: bold;
                    font-family:Roboto, sans-serif;
                }
                &.artist {
                    width: 122px;
                    height: 16px;
                    margin-top: 0.5rem;
                    font-size: .6rem;
                    // font-weight: none;
                    color: $primary_color;
                    transition-delay: 100ms;
                    font-family:Roboto, sans-serif;
                }
            }
        }
        .albumImage {
            // position: relative;
            display: inline-block;
            width: 8rem;
            height: 8rem;
            overflow: hidden;
            margin: 0.5rem 0;
            border-radius: 50%;
            text-align: center;
            // vertical-align: middle;
            img {
                width: 8rem;
                height: 8rem;
                z-index: 10;
                object-fit: cover;
                object-position: 50% 50%;
                border-radius: 50%;
            }
             span:nth-child(3) {
                box-sizing: border-box;
                height: 8rem;
                width: 8rem;
                position: fixed;
                left: 0;
                // bottom: 0;
                border-radius: 50%;
              
                 z-index: -1;
            }
            span:nth-child(2) {
                box-sizing: border-box;
                height: 8rem;
                width: 8rem;
                position: fixed;
                left: 0;
                // bottom: 0;
                border-radius: 50%;
               
                 z-index: -1;
            }
            @keyframes living {
                0% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                25% {
                    transform: scale(1.5);
                    opacity: 0.5; /*圆形放大的同时，透明度逐渐减小为0*/
                }
                50% {
                    transform: scale(4);
                    opacity: 0; /*圆形放大的同时，透明度逐渐减小为0*/
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
        }
        .playerButtons {
            position: absolute;
            margin: 0;
            right: 0;
            top: 80px;
            //margin-bottom: 1.5rem;
            text-align: center;
            width: 122px;
            height: 64px;
            .button {
                font-size: $button_size;
                display: inline-block;
                vertical-align: middle;
                padding: 0 0.1rem;
                margin: 0 0.1rem;
                color: #fff;
                border-radius: 50%;

                outline: 0;
                text-decoration: none;
                cursor: pointer;
                transition: $anim_duration;

                &.play {
                    font-size: 2 * $button_size;
                    margin: 0 0.1rem;
                }
                &:active {
                    opacity: 0.75;
                    transform: scale(0.75);
                }
                &.isDisabled {
                    color: rgba(0, 0, 0, 0.2);
                    cursor: initial;
                    margin: 0.1rem;
                }
                &.isDisabled:active {
                    transform: none;
                }
            }
        }
        .currentTimeContainer {
            position: absolute;
            width: 100%;
            height: 1rem;
            top: 135px;
            display: flex;
            justify-content: space-between;
            margin: 0.5rem 0;
            .currentTime,
            .totalTime {
                font-size: 0.8rem;
                font-family: monospace;
                color: $primary_color;
            }
        }

        .currentProgressBar {
            position: absolute;
            top: 145px;
            width: 100%;
            background-color: #fff;
            margin: 1.5rem 0;
            .currentProgress {
                background-color: rgb(255, 231, 19);
                width: 0px;
                height: 1.2px;
                transition: 100ms;
            }
        }
    }
}
.riffle1 {
    -webkit-animation: living 3s linear infinite;
      background-color:  rgb(189, 19, 189);
}
.riffle2 {
    -webkit-animation: living 2s linear infinite;
     border: 1px solid rgb(252, 229, 24);
}
.loader {
    margin: 60px auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
}

/* data change transitions */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity $anim_duration;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* pen specific formatting */

.heading {
    text-align: center;
    margin: 0;
    margin: 2rem 0;
    font-family: Inconsolata, monospace;

    h1 {
        color: #eceff1;
        margin: 0;
        margin-bottom: 1rem;
        font-size: 1.75rem;
    }
    p {
        margin: 0;
        font-size: 0.85rem;
    }
    a {
        color: rgba(255, 255, 255, 0.8);
        transition: 0.3s;
        text-decoration-style: dotted;
        &:hover {
            color: rgba(255, 255, 255, 1) !important;
        }
        &:visited {
            color: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>
