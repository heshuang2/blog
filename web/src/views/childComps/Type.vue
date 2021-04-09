<template>
    <div id="type">
        <v-touch class="main type-body v-touch"  @swiperight="swiperight">
            <div v-if="!this.$store.state.device && !this.$store.state.mobile" class="type-card">
                    <browsing></browsing>
            </div>
            <div class="center">
                <div class="flex-middle-between font-a">
                    <span class="title">{{ this.type }}</span>
                </div>
                <article-card v-if="!this.$store.state.mobile" :articles="this.$store.state.articles[this.type]"></article-card>
                <article-card-h5 v-else :articles="this.$store.state.articles[this.type]"></article-card-h5>
            </div>
            <div v-if="this.$store.state.device" id="left">
                <div class="burl">
                    <browsing class="is_fixed"></browsing>
                </div>
            </div>
        </v-touch>
    </div>
</template>

<script>
import ArticleCard from '../../components/articleCard/ArticleCard.vue';
import Browsing from '../../components/browsing/Browsing.vue';
import ArticleCardH5 from '../../components/h5_components/articleCard_h5/articleCard_h5.vue';
export default {
    data() {
        return {
            type: ''
        };
    },
    components: { ArticleCard, Browsing, ArticleCardH5 },
    created() {
        this.type = this.$route.params.type;
    },
    watch: {
        $route(to, from) {
            this.type = this.$route.params.type;
        }
    },
    methods: {
        swiperight() {
            this.$router.push('/home')
        }
    },
};
</script>

<style lang="scss">
#type {
    min-height: 90%;
    .type-body {
        display: block;
        
    }
}
</style>