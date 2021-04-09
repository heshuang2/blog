<template>
    <div class="type-content">
        <div class="type-content-nav">
            <div class="mobile-header__content">
                <div class="mobile-header">
                    <v-touch class="mobile-header-left flex-middle" @tap="$parent.isTypeShow = false">
                        <span class="v-badge type-badge">
                            <svg-icon iconClass="close-type" class="menu-icon"></svg-icon>
                        </span>
                    </v-touch>
                    <div class="mobile-header-center flex-middle"></div>
                </div>
            </div>
        </div>
        <ul class="type-content-body" v-show="$parent.isTypeShow">
            <v-touch
                tag="li"
                v-for="(item, index) in this.$store.state.type"
                :key="index"
                @tap="toTypeList(item.name)"
                >{{ item.name }}</v-touch
            >
        </ul>
    </div>
</template>

<script>
import SvgIcon from '../../SvgIcon/SvgIcon.vue';
export default {
    data() {
        return {};
    },
    components: { SvgIcon },
    methods: {
        toTypeList(key) {
            this.$router
                .push({
                    name: `type`,
                    params: {
                        type: key
                    }
                })
                .catch((err) => {
                    err;
                });
            this.$parent.isTypeShow = false;
        }
    }
};
</script>

<style lang="scss">
.type-content {
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #000;
    ul {
        list-style: none;
    }
    // opacity: 0;
    .type-content-nav {
        height: 3.25rem;
        width: 100%;
        position: fixed;
        display: flex;
        border-bottom: 1px solid #878585;
        .type-badge {
            color: #d8d2d2;
        }
    }
    .type-content-body {
        display: block;
        position: absolute;
        top: 4rem;
        color: #fff;
        width: 100%;
        padding: 2vh 5vh;
        box-sizing: border-box;
        li {
            height: 3rem;
            line-height: 3rem;
            border-bottom: 1px solid #878585;
        }
    }
}
</style>