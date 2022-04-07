<template>
    <div class="counter">
        <div class="nums" ref="nums">
            <span v-for="(countdown, index) in 60" :key="index" :class="{in: index === 0}">{{
                    60 - countdown
                }}</span>
            s后重新发送s
        </div>
    </div>
</template>

<script>
export default {
    name: 'Countdown.vue',
    data() {
        return {
            countdown: 0, //倒计时
        }
    },
    methods: {
    runAnimation() {
        const nums = document.querySelectorAll('.nums span');
        nums.forEach((num, idx) => {
            const penultimate = nums.length - 1;
            num.addEventListener('animationend', (e) => {
                if (e.animationName === 'goIn' && idx !== penultimate) {
                    num.classList.remove('in');
                    num.classList.add('out');
                } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                    num.nextElementSibling.classList.add('in');
                } else {
                    this.$emit('update:isMail', true);
                }
            });
        });
    }
}
};
</script>

<style scoped>
.counter {
    text-align: right;
}


.nums {
    color: #3498db;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 24px;
    line-height: 24px;
}

.nums span {
    font-size: 24px;
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(-50%, -50%) rotate(180deg);
    transform-origin: bottom center;
}

.nums span.in {
    transform: translate(-50%, -50%) rotate(0deg);
    animation: goIn .5s ease-in-out;
}

.nums span.out {
    animation: goOut .5s ease-in-out;
}
</style>