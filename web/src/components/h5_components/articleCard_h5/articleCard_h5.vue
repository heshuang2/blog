<template>
    <div class="article-content">
        <div
            class="article-card"
            :class="$store.state.theme ? 'bg-white' : 'bg-black'"
            v-for="(item, index) in articles"
            :key="index"
        >
            <div class="article-img" :style="{ backgroundImage: 'url(' + item.icon + ')' }"></div>
            <div
                class="article-body"
                :class="$store.state.theme ? 'text-black' : 'text-white'"
                @click="ariticleDetails(item._id)"
            >
                <div class="article-title">
                    <span href="">{{ item.title }}</span>
                </div>
                <div class="article-time text-grey">
                    <span>{{ item.datetime | playTimeFormat(10) }}</span>
                </div>
                <div class="article-brief">
                    <span>{{ item.brief | beautySub(42) }}</span>
                </div>
            </div>
            <div class="article-bar" :class="$store.state.theme ? 'text-black' : 'text-white'">
                <span><svg-icon :iconClass="$store.state.theme ? 'eye' : 'eye-dark'" class="bar-icon"></svg-icon>{{ item.views }}</span>
                <!-- <span><svg-icon iconClass="like" class="bar-icon"></svg-icon>1</span> -->
                <span><svg-icon :iconClass="$store.state.theme ? 'message1' : 'message-dark'"  class="bar-icon"></svg-icon>{{ item.comments.length }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../SvgIcon/SvgIcon.vue';
export default {
    components: { SvgIcon },
    props: {
        articles: {
            type: Array,
            default: () => []
        }
    },
  
    methods: {
        ariticleDetails(id) {
            this.$router.push(`/post/${id}`);
        }
    }
};
</script>

<style lang="scss">
.article-content {
    width: 100%;
    .article-card {
        border-radius: 1rem;
        margin-bottom: 1.5rem;
        position: relative;
        overflow: hidden;
        .article-img {
            height: 28vh;
            object-fit: cover;
            background-position-x: center;
            background-position-y: center;
            background-size: cover;
            width: 100%;
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
            filter:  brightness(1);
        }
        .article-title {
            padding: 3vh 3vh 0 3vh;
            display: flex;
            // justify-content: center;
            align-items: center;
            span {
                z-index: 2;
                font-size: 1.25rem;
                font-weight: 600;
                letter-spacing: 0.0125em;
                line-height: 2rem;
                word-break: break-all;
                text-shadow: 0 0.1875rem 0.3125rem #d8d6d6;
            }
        }
        .article-time {
            padding: 0 3vh;
            font-size: 0.9375rem;
        }
        .article-brief {
            font-size: 0.9375rem;
            padding: 3vh;
            text-align: justify;
            font-family: 'Open Sans', sans-serif;
        }
        .article-bar {
            box-sizing: border-box;
            padding: 1vh 3vh 5vh 3vh;
            span {
                display: flex;
                box-sizing: border-box;
                padding-right: 3vh;
                // color: #011111cb;
                text-align: center;
                font-size: 11px;
                float: left;
                align-items: center;
                .bar-icon {
                    font-size: 19px;
                    padding-right: 0.3125rem;
                }
            }
        }
    }
}
</style>