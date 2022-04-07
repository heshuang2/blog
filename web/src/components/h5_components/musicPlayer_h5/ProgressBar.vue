<template>
    <div class="progress_bar" ref="progress_bar" @click="bar_click" :class="{progress_bar_active: active}">
        <div class="bar" ref="bar">
        </div>
        <div class="bar_pan" ref="bar_pan"  :class="{bar_pan_active: active}"
             @touchstart.prevent = "touch_start"
             @touchmove.prevent = "touch_move"
             @touchend = "touch_end"
             @click.stop = "pan_click"
        >
            <loading class="loading" v-show = "!audio_is_ready"
                     icon_class = "el-icon-loading"
                     :font_size = "9"
            >
            </loading>
        </div>
    </div>
</template>

<script>
import Loading from "./loading.vue";
export default {
    name: "ProgressBar",
    data(){
        return{
            length_copy: 0, //记录上一个播放状态下移动距离
            move_length: 0, //每一秒播放转换为实际距离
            touch: {init: false},
            precentMove: 0,
            active: false
        };
    },
    props: {
        precent: {
            type: Number,
            default: 0
        },
        audio_is_ready: {
            type: Boolean,
            default: false
        }
    },
    components: {Loading},
    mounted() {
        // console.log(this.$refs.progress_bar.clientWidth);
    },
    methods: {
        move(){
            this.$refs.bar.style.width = `${this.move_length}px`;
            this.$refs.bar_pan.style.left = `${this.move_length}px`;

        },
        bar_click(e){
        },
        pan_click(){

        },
        touch_start(e){
            this.touch.init = true;
            this.touch.start_pagex = e.touches[0].pageX;
            this.active = true;
            // console.log('点击',this.length_copy);
            this.$refs.bar_pan.style.left = this.length_copy + 'px';
            this.$refs.bar.style.width = this.length_copy +'px';
            this.precentMove = this.length_copy / this.$refs.progress_bar.clientWidth * 100;
            this.$emit("time_change", this.precentMove);
        },
        touch_move(e){
            if(this.touch.init){
                let distance = e.touches[0].pageX - this.touch.start_pagex;
                // console.log(distance);
                let moveDistance = this.length_copy + distance;
                moveDistance = moveDistance <= 0 ?　0 : moveDistance;
                moveDistance = moveDistance > this.$refs.progress_bar.clientWidth ?　this.$refs.progress_bar.clientWidth : moveDistance;
                this.$refs.bar_pan.style.left = moveDistance + 'px';
                this.$refs.bar.style.width = moveDistance +'px';
                this.precentMove = moveDistance / this.$refs.progress_bar.clientWidth * 100;
                this.$emit("time_change", this.precentMove);
            }
        },
        touch_end(){
            // console.log(this.precentMove);
            this.$emit("audio_change", this.precentMove);;
            this.length_copy = this.$refs.bar_pan.offsetLeft;
            this.active = false;
        }
    },
    watch: {
        precent(){
            if(!this.touch.init){
                this.move_length = this.$refs.progress_bar.clientWidth  * this.precent / 100 ;
                this.move();
                this.length_copy = this.$refs.bar_pan.offsetLeft; //播放状态下记录进度条贺按钮实时位置
            }
        }
    }
}
</script>

<style scoped lang="scss">
.progress_bar {
    position: relative;
    height: 3px;
    width: 100%;
    border-radius: 2px;
    margin: 0 15px;
    background: rgba(134, 126, 126, .6);
    transition: height .3s linear;

    .bar {
        height: 100%;
        width: 0;
        z-index: 9;
        background: #fff;
    }

    .bar_pan {
        position: absolute;
        left: 0;
        top: -5px;
        width: 4px;
        height: 4px;
        //border: 4px solid #fff;
        border-radius: 50%;
        padding: 4px;
        background: #ccc;
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform .1s linear;
        transform: translateX(-6px);
    }
    .bar_pan_active{
        transform: scale(1.5) translateX(-6px);
    }
}
.progress_bar_active {
    height: 4px;
}

</style>