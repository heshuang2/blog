<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        window.onload = function() {
            if (!window.sessionStorage['tempFlag']) {
                localStorage.clear();
                location.reload(); //不能省，强制跳到登陆页
            } else {
                window.sessionStorage.removeItem('tempFlag');
            }
        };
        window.onunload = function() {
            window.sessionStorage['tempFlag'] = true;
        };
        window.onbeforeunload = function() {
            window.sessionStorage['tempFlag'] = true;
        };
    }
};
</script>
