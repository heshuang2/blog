<template>
    <div id="photos">
        <div class="container photo-main">
            <div class="page bg-white">
            </div>
        </div>
    </div>
</template>

<script>
export default {
  
};
</script>

<style lang="scss">
#photos {
    min-height: 90%;
    
    .photo-main {
        margin: auto;
        position: relative;
        box-sizing: border-box;
        display: block !important;
        padding-top: 60px;
        /* height: 100%; */
        height: 100vh;
    }
}

.box {
    height: 100px;
    width: 100px;
    background-color: black;
}
</style>