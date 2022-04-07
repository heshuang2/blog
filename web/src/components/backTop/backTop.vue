<template>
    <div id="backtop" :class="{'backtop-show': backTopShow}" >
<!--        <span class="backtop-btn el-icon-upload2"></span>-->
<!--        <span class="backtop-border"></span>-->
<!--        <span class="backtop-border"></span>-->
        <div class="backtop_border animate__animated "  @click="backTop" >
            <svg-icon icon-class="up" class="up-icon "></svg-icon>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            //是否显示回到顶部
            backTopShow: false,
            // 是否允许操作返回顶部
            backTopAllow: true,
            // 返回顶部所需时间
            backSeconds: 20,
            // 往下滑动多少显示返回顶部（单位：px）
            showPx: 500
        };
    },
    mounted() {
        window.addEventListener('scroll', this.backTopShowOperate, true);
    },
    methods: {
        backTopShowOperate: function () {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > this.showPx) {
                this.backTopShow = true;
            } else {
                this.backTopShow = false;
            }
        },
        backTop() {
            this.backToTopShow = false;
            this.backTopAllow = false;
            var step = document.documentElement.scrollTop / this.backSeconds;
            var backTopInterval = setInterval(function () {
                if (document.documentElement.scrollTop > 0) {
                    document.documentElement.scrollTop -= step;
                } else {
                    this.backTopAllow = true;
                    clearInterval(backTopInterval);
                }
            }, 1);
        }
    }
};
</script>

<style lang="scss">
#backtop {
    // position: relative;
    cursor: pointer;
    display: none;

    .backtop_border {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background-color: rgb(252, 229, 24);
        border: 1px solid #e0620d;
        box-shadow: 0 0 20px rgb(252, 229, 24);
        transition: all 1s;
        -webkit-transition: all 1s;
        -moz-transition: all 1s;
        -ms-transition: all 1s;
        -o-transition: all 1s;

    }
    .up-icon {
        font-size: 24px;
    }
    .backtop-border {
        -webkit-animation: living 3s linear infinite;
        position: absolute;
        height: 42px;
        width: 42px;
        left: 0;
        bottom: 0;
        border-radius: 50%;
        background: rgb(252, 229, 24);
        z-index: -1;
    }
    .backtop-btn {
        z-index: 0;
        font-size: 20px;
        font-weight: bolder !important;
    }
}
.backtop-show {
    display: block !important;
}

#backtop:hover .backtop-btn {
    animation: key 1s linear;
}

@keyframes living {
    0% {
        transform: scale(1);
        opacity: 0.5;
    }
    50% {
        transform: scale(2);
        opacity: 0; /*圆形放大的同时，透明度逐渐减小为0*/
    }
    100% {
        transform: scale(1);
        opacity: 0.5;
    }
}
@keyframes key {
    0% {
        transform: rotate(0deg);
    }
    33% {
        transform: rotate(90deg);
    }
    66% {
        transform: rotate(180deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
#backtop span:nth-child(2) {
    -webkit-animation-delay: 1.5s; /*第二个span动画延迟1.5秒*/
}
</style>
