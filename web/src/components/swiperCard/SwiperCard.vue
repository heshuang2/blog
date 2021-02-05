<template>
    <div id="right">
        <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide><img src="../../assets/img/0010.jpg" alt=""/></swiper-slide>
            <swiper-slide><img src="../../assets/img/007.jpg"/></swiper-slide>
            <swiper-slide><img src="../../assets/img/0011.jpeg"/></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
    data() {
        return {
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
        // current swiper instance
        // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
        // console.log('this is current swiper instance object', this.swiper);
        // this.swiper.slideTo(3, 1000, false);
    }
};
</script>

<style>
.swiper-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin-top: 10px;
    border-radius: 1rem;
}
.swiper-container img {
    width: 100%;
    height: 100%;
    background-size: cover;
    animation: living 6s linear infinite;
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
        transform: scale(1);
        opacity: 1;
    }
}
</style>
