<template>
    <div id="audioPlayer">
        <!-- <searchs @musicId="getMusicData"></searchs> -->
        <aplayer ref="aplayer" :audio="audio" :fixed="!$store.state.mobile" :mini="ismini"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            audio: [
                {
                    id: 1,
                    name: '一路向北',
                    artist: '周杰伦',
                    url:
                        'https://mp3.9ku.com/hot/2005/07-05/67693.mp3',
                    cover: 'https://node-blog-1304818575.file.myqcloud.com/%E5%A4%B4%E6%96%87%E5%AD%97D.jpg', // prettier-ignore
                    lrc: '[00:00.00] (,,•́ . •̀,,) 抱歉，当前歌曲暂无歌词'
                },
                {
                    id: 1469005988,
                    name: '平凡之路',
                    artist: '朴树',
                    url:
                        'https://mp3.9ku.com/hot/2014/07-16/642431.mp3',
                    cover: 'https://5b0988e595225.cdn.sohucs.com/images/20180418/5eaf932d82634026a7ab9adc355881e5.jpeg', // prettier-ignore
                    lrc: '[00:00.00] (,,•́ . •̀,,) 抱歉，当前歌曲暂无歌词'
                }
            ],
            musicData: {},
            isPush: true,
            ismini: true,
            audio_is_ready: false
        };
    },
    watch: {},
    mounted() {
        this.$store.commit('handleCurrentMusic', this.$refs.aplayer.currentMusic);
        this.$bus.$on('play', this.$refs.aplayer.play);
        this.$bus.$on('pause', this.$refs.aplayer.pause);
        this.$bus.$on('seek', this.$refs.aplayer.seek);
        // this.$bus.$on('audio_is_ready', this.$refs.aplayer.pause);
    },
    created() {
        this.$bus.$on('musicId', async id => {
            const { data: res1 } = await this.$http1.get('/song/url', {
                params: {
                    id: id
                }
            });
            const { data: res2 } = await this.$http1.get('/song/detail', {
                params: {
                    ids: id
                }
            });
            console.log(res1);
            this.audio.find((item, index) => {
                if (item.id === id) {
                    this.isPush = false;
                    this.$refs.aplayer.switch(index);
                }
            });
            if (this.isPush) {
                this.musicData.url = res1.data[0].url;
                this.musicData.id = id;
                this.musicData.name = res2.songs[0].name;
                this.musicData.artist = res2.songs[0].ar[0].name;
                this.musicData.cover = res2.songs[0].al.picUrl;
                this.audio.push(this.musicData);
                this.$refs.aplayer.switch(id);
                this.musicData = [];
            }
            this.$refs.aplayer.play();
            this.isPush = true;
        });
    },
    methods: {
        // 当前播放音乐改变事件
        /*handleEvent(e) {
            console.log(e)
            this.$store.commit('handleAudioReady', false);
            this.$store.commit('handleCurrentMusic', e);
        },
        // 当文件就绪可以开始播放时触发（缓冲已足够开始时）
        getDuration() {
            this.$nextTick(() => {
                const { media } = this.$refs.aplayer;
                this.$store.commit('handleAudioReady', true);
                this.$store.commit('PushCurrentMusic', ['duration', media.duration]);
                this.$store.commit('PushCurrentMusic', ['currentTime', media.currentTime]);
            })
        },
        changeCurrentTime() {
            if (this.$store.state.playStatus === 'pause')  return;
            // console.log('突然改变',this.$refs.aplayer.media.currentTime);
            this.$store.commit('PushCurrentMusic', ['currentTime', this.$refs.aplayer.media.currentTime]);
        },
        seekStatus(e) {
            // console.log(e);
            // this.$refs.aplayer.pause();
        }*/
    }
};
</script>

<style lang="scss"></style>
