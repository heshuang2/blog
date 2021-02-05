<template>
    <div id="audioPlayer">
        <!-- <searchs @musicId="getMusicData"></searchs> -->
        <aplayer ref="aplayer" :audio="audio" fixed :mini="ismini"  listFolded />
    </div>
</template>

<script>
export default {
    data() {
        return {
            audio: [
                {
                    name: '蒲空英的约定',
                    artist: '黄叶',
                    url:
                        'https://edu-guil-1010.oss-cn-beijing.aliyuncs.com/%E8%92%B2%E5%85%AC%E8%8B%B1%E7%9A%84%E7%BA%A6%E5%AE%9A.m4a',
                    cover: 'https://edu-guil-1010.oss-cn-beijing.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720200713203148.jpg',
                    lrc: '[00:00.00] (,,•́ . •̀,,) 刚刚开始学钢琴弹的hhhh'
                },
                {
                    id: 1469005988,
                    name: '无畏',
                    artist: '马頔',
                    url:
                        'https://edu-guil-1010.oss-cn-beijing.aliyuncs.com/%E9%A9%AC%E9%A0%94%20-%20%E6%97%A0%E7%95%8F.flac',
                    cover: 'https://edu-guil-1010.oss-cn-beijing.aliyuncs.com/%E4%BB%A5%E5%AE%B6%E4%B9%8B%E5%90%8D.jpg', // prettier-ignore
                    lrc: '[00:00.00] (,,•́ . •̀,,) 抱歉，当前歌曲暂无歌词'
                },
                {
                    name: '蓝乐',
                    artist: '白纸',
                    url:
                        'https://edu-guil-1010.oss-cn-beijing.aliyuncs.com/%E8%93%9D%E4%B9%90%20-%20%E7%99%BD%E7%BA%B8.flac',
                    cover: 'https://edu-guil-1010.oss-cn-beijing.aliyuncs.com/-1992181439.jpg',
                    lrc: '[00:00.00] (,,•́ . •̀,,) 抱歉，当前歌曲暂无歌词'
                }
            ],
            musicData: {},
            isPush: true,
            ismini: true
        };
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
            // console.log(res1);
            this.audio.find((item, index) => {
                if (item.id === id) {
                    this.isPush = false;
                }
            });
            if (this.isPush) {
                this.musicData.url = res1.data[0].url;
                this.musicData.id = id;
                this.musicData.name = res2.songs[0].name;
                this.musicData.artist = res2.songs[0].ar[0].name;
                this.musicData.cover = res2.songs[0].al.picUrl;
                this.audio.push(this.musicData);
                console.log(this.$refs.aplayer);
                this.musicData = [];
            };
            this.$refs.aplayer.switch(res2.songs[0].name); 
            this.$refs.aplayer.play();
            this.isPush = true;
        });
    }
};
</script>

<style lang="scss"></style>
