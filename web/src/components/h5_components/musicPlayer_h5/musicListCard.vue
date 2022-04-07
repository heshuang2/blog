<template>
    <div id="musicListCard" class="animate__animated" >
        <img class="musicList-background"
             :src="SelectMusic.cover" alt=""/>
        <div class="musicList-content">
            <div class="musicList-content-header text-white"  >
                <span>播放列表({{musicList.length}})</span>
                <span  @click="closeMusicCard"><svg-icon  icon-class="close-type"></svg-icon></span>
            </div>
            <ul>
                <li v-for="(item, index) in musicList" :key="index"
                    @click="playMusic(index)"
                    :class="{'active-music': item.id === SelectMusic.id}" >
                    <div class="musicList-border"></div>
                    <span v-show="item.id === SelectMusic.id"><svg-icon icon-class="playing_music"></svg-icon></span>
                    <span v-show="item.id !== SelectMusic.id">{{index + 1}}</span>
                    <span class="text-white">{{item.name | beautySub()}}</span>
                    <span class="text-grey">{{item.artist | beautySub()}}</span>
                </li>
            </ul>
            <div class="musicList-content-bottom">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'musicListCard',
    props: ['audio', 'currentMusic'],
    data() {
        return {
            musicList: [],
            SelectMusic: []
        }
    },
    watch: {
        audio(val) {
            this.musicList = val;
        },
        currentMusic(val) {
            console.log(val);
            this.SelectMusic = val;
        }
    },
    mounted() {
        // console.log(this.audio);
    },
    methods: {
        playMusic(index) {
            this.$emit('switchMusic', index);
        },
        closeMusicCard() {
            this.$emit('closeMusicList')
        }
    }
};
</script>

<style lang="scss" scoped>
#musicListCard {
    position: fixed;
    height: 30rem;
    bottom: 0;
    width: 100%;
    //border-radius: .8rem;
    overflow: hidden;
    opacity: 0;
    background: rgba(45, 50, 53, 1);
    z-index: -2;
    padding-bottom: 2rem;
    .musicList-background {
        position: absolute;
        height: 100%;
        width: 100%;
        object-fit: cover;
        background-position-x: center;
        background-position-y: center;
        filter: blur(4rem) brightness(1);
        opacity: .6;
        //transform: scale(3);
    }
    .musicList-content {
        //z-index: 2;
        padding: .5rem;
        .musicList-content-header {
            font-weight: 550;
            padding: .5rem;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            :nth-child(2) {
                font-size: 20px;
                z-index: 9;
            }
        }
        ul {
            counter-reset: sectioncounter;
            overflow-x: hidden;
            max-height: 26rem;
            .active-music {
                > * {
                    color: #f4ea2a !important;
                }

            }
            li {
                padding: .8rem 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                .musicList-border {
                    position: absolute;
                    left: -1rem;
                    right: -1rem;
                    height: 100%;
                    background: #000;
                    opacity: 0;
                    transition: opacity .3s linear;
                }
                :nth-child(2) {
                    position: absolute;
                    width: 1rem;
                    left: 0;
                }
                :nth-child(3) {
                    font-weight: bold;
                    color: #999;
                    position: absolute;
                    width: 1rem;
                    left: 0;
                    text-align: center;
                    font-family: HelveticaNeue-Bold, HelveticaNeue;
                    font-size: 13px;
                }
                :nth-child(4) {
                    padding-left: 1rem;
                    width: 60%;
                }
                :nth-child(5) {
                    font-size: 12px;
                    width: 40%;
                    text-align: right;
                }
            }
            li:active {
                .musicList-border {
                    opacity: .6;
                }
            }

        }
        .musicList-content-bottom {
            height: 1px;
            background: #5a5e66;
            ;
        }

    }
}
</style>