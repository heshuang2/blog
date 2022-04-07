<template>
    <div id="links">
        <div class="container link-main" >
            <div class="page text-init" :class="this.$store.state.theme ? 'bg-light' : 'bg-dark'">
                <div class="tip-header">
                    <svg-icon iconClass="tip" class="tip-icon"></svg-icon>
                </div>
                <div class="link-tip " :class="$store.state.theme ? 'bg-white' : 'bg-black text-white'">
                    <div class="tip1">
                        欢迎互换友链 ^_^ 不过请确定贵站可以正常运营,请发送邮件至
                        <a href="mailto:hx1323@yeah.net">hx1323@yeah.net.com</a>
                    </div>
                    <div class="tip2">博客名字：hxug</div>
                    <div class="tip3">博客地址：<a href="http://www.hxug.asia">www.hxug.asia</a></div>
                    <div class="tip3">
                        博客头像：<a
                        href="https://c-ssl.duitang.com/uploads/item/202003/12/20200312150033_yAFdf.thumb.1000_0.jpeg"
                    >(https://avatar.jpg)</a
                    >
                    </div>
                </div>
                <div class="link-people" :class="this.$store.state.theme ? 'bg-light' : 'bg-dark'" >
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-for="(item, index) in linksList"
                                :key="index"  >
                            <div class="link-user bg-white animate__animated " :class="$store.state.theme ? 'bg-white' : 'bg-black text-white'">
                                <div class="link-user-avatar">
                                    <img :src="item.avatar" alt=""/>
                                </div>
                                <div class="link-user-content" >
                                    <div class="link-user-name"><a href="">{{ item.name }}</a></div>
                                    <div class="link-user-desc ">{{ item.desc }}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';

export default {
    components: {
        SvgIcon
    },
    data() {
        return {
            linksList: [], //友链列表
            blocks: [] //获取页面上所有友链列表
        };
    },
    mounted() {
        this.fetchLinksList();
        window.addEventListener('scroll', this.scrollHander, true);
    },
    destroyed() {
        window.removeEventListener('scroll', this.scrollHander, true);
    },
    methods: {
        async fetchLinksList() {
            const { data: res } = await this.$http2.get('rest/friendLinks/');
            this.linksList = res.data;
            this.$nextTick(() => {
                this.blocks = document.querySelectorAll('.link-user');
                this.MonitorBlock();
            });
        },
        scrollHander() {
            this.MonitorBlock();
        },
        MonitorBlock() {
            this.blocks.forEach((block) => {
                if (this.utils.isElemVisible(block)) {
                    block.classList.add('animate__fadeInDown');
                }
            })
        }
    }

};
</script>

<style lang="scss">
#links {
    min-height: calc(100% - 80px);

    .link-main {
        margin: auto;
        position: relative;
        box-sizing: border-box;
        display: block !important;
        padding-top: 3.75rem;

        .tip-header {
            .tip-icon {
                font-size: 3.75rem;
            }
        }

        .link-tip {
            padding: 0.625rem 1.25rem;
            margin-bottom: 2rem;
            border-radius: 0.3125rem;

            div {
                letter-spacing: 0.03125rem;
            }

            .tip1 {
                padding: 0.3125rem 0;
            }
        }

        .link-people {
            padding: 0.625rem 1.25rem;
            border-radius: 0.3125rem;

            .link-user {
                border-radius: 0.3125rem;
                margin: 0.625rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 2rem;

                .link-user-avatar {
                    display: flex;
                    align-items: center;

                    img {
                        width: 5rem;
                        height: 5rem;
                        object-fit: cover;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                }

                .link-user-content {
                    .link-user-name {
                        padding: .3125rem;
                        text-align: right;
                        font-size: 1.125rem;
                    }

                    .link-user-desc {
                        padding: .3125rem;
                        text-align: right;
                        font-size: .9375rem;
                    }
                }
            }
        }
    }
}
</style>