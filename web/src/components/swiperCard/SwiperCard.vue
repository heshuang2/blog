<template>
    <div id="swiper-card">
        <swiper :options="swiperOption" ref="mySwiper" v-if="items.length != 0">
            <swiper-slide v-for="(item, index) in items" :key="index"
                ><div class="img" :style="{backgroundImage:'url(' + item.icon + ')'}"></div>
                <div class="item-title">
                    <span>{{ item.title }}</span>
                </div></swiper-slide
            >
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="banner move1"></div>
            <div class="banner move2"></div>
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
    data() {
        return {
            items: [],
            swiperOption: {
                loop: true,
                effect: 'fade',
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false
                },
                fadeEffect: {
                    crossFade: true
                },
                // 显示分页
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true //允许分页点击跳转
                },
                on: {
                    //关键在这儿，通过点击事件拿到对应的元素，从而确定具体index
                    click: () => {
                        let i = this.swiper.activeIndex - 1;
                        this.handle(i);
                    }
                }
            }
        };
    },
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper;
        }
    },
    mounted() {
        this.getArticleList();
    },
    methods: {
        async getArticleList() {
            const { data: res } = await this.$http2.get('/rest/articles');
            // 洗牌随机获取3篇文章
            this.items = this.utils.randSolt(res.data, 3);
        },
        handle(id) {
            this.$router.push(`/post/${id == 3 ? this.items[0]._id : this.items[id]._id}`);
            //这里写点击的逻辑
        }
    }
};
</script>

<style lang="scss">
#swiper-card {
    /* display: flex; */
    // position: absolute;
    width: 100%;
    box-sizing: border-box;
    min-height: 900px;
    // margin-top: 60px;
    animation: slide-down 0.5s;
    transform-origin: 50% 0;
    border-radius: 1rem;
    background: #e0e0e0;
    z-index: 9;
    .banner {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 1000%;
        transition-duration: 0.4s, 0.4s;
        animation-name: move;
        animation-fill-mode: backwards;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }
    .move1 {
        background: url(../../assets/img/wave1.png);
        height: 65px;
        animation-duration: 50s;
    }
    .move2 {
        background: url(../../assets/img/wave2.png);
        height: 85px;
        left: -183px;
        animation-duration: 80s;
    }
}
.swiper-container {
    position: relative;
    width: 100%;
    height: 900px;
    border-radius: 1rem;
    cursor: pointer;
    .item-title {
        position: absolute;
        bottom: 120px;
        left: 50px;
        color: #fff;
        font-size: 2.125rem !important;
        line-height: 2.5rem;
        letter-spacing: 0.0073529412em !important;
    }
}
.swiper-container .img {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    transition: 0.5s ease-out;
}
.swiper-container:hover {
    .img {
        // filter: blur(1.2px);
        transform: scale(1.1);
    }
}
@keyframes living {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 1; /*圆形放大的同时，透明度逐渐减小为0*/
    }
    100% {
        transform: scale(1.2);
        opacity: 1;
    }
}
</style>
