<template>
        <button class="dialog-btn bg-primary ripple" @click="dialog">登录</button>
</template>

<script>

export default {
    methods: {
        dialog() {
            this.$store.commit('dialogStatus', true);
        }
    },
};
</script>

<style>

</style>