<template>
    <div id="bottom" >
        <div class="bottom-content" :class="this.$store.state.theme  ? 'bg-light' : 'bg-dark text-white'">
            <div><a href="http://www.hxug.asia">©2022 hxug.asia</a></div>
            <div><a href="https://beian.miit.gov.cn" target="_blank">鄂ICP备2021010676号-1</a></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            el: ''
        };
    },
    mounted() {
        this.el = document.querySelector('#bottom');
        if (this.$store.state.mobile) {
            if (this.$route.name === 'messages'|| this.$route.name === 'post' && this.$store.state.mobile) {
                console.log(this.$route.name);
                this.el.classList.add('up-el');
            }
        }
    },
    watch: {
        '$route'(to, from) {
            if (this.$store.state.mobile) {
                if (to.name === 'messages' || to.name === 'post' && this.$store.state.mobile) {
                    this.el.classList.add('up-el');
                } else {
                    this.el.classList.remove('up-el') ;
                }
            }
        }
    }
};
</script>

<style lang="scss">
.up-el {
    transform: translate(0, -5rem);
    padding-bottom: 3rem;
}
#bottom {
    .bottom-content {
        position: absolute;
        margin: 0 auto;
        width: 100%;
        height: 100%;
        div{
            display: flex;
            justify-content: center;
            align-items: center;
            margin: .2rem;
        }
            a {
                font-size: 15px;
                text-align: center;
                color: inherit;
                font-weight: bold;
            }

    }
}
</style>