<template>
    <div class="loading-contain">
        <i :class="icon_class" :style="icon_style" v-show="show"></i>
    </div>
</template>

<script >
export default {
    name: "Loading",
    props: {
        icon_class: {
            type: String,
            default: ""
        },
        font_size: {
            type: Number,
            default: 24
        },
        time: {
            type: Number,
            default: 1
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        icon_style(){
            return {
                "font-size": `${this.font_size}px`,
                "animation-duration": `${this.time}s`,
            };
        }
    }
}
</script>

<style scoped lang="scss">

</style>