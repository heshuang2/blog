<template>
    <div id="diarys">
        <div class="container">
            <div class="doc-container">
                <div class="timeline-main">
                    <!-- 时间线 -->
                    <div class="timeline-line"></div>
                    <!-- 一年 -->
                    <div class="timeline-year" v-for="(item, index) in year">
                        <h2>
                            <a class="yearToggle text-primary">{{ item }}年</a>
                            <i class="fa el-icon-bottom-right fa-fw text-primary"></i>
                        </h2>
                        <div class="timeline-month" v-for="(element, index) in trivialList[item]">
                            <ul>
                                <li>
                                    <div class="h4 animated fadeInLeft">
                                        <p class="date ">{{ element.time }}</p>
                                    </div>
                                    <p class="animated dot-circle">
                                        <i class="el-icon-s-flag"></i>
                                    </p>
                                    <div class="content">
                                        <div class="content-message animated fadeInRight">{{ element.content }}</div>
                                        <img :src="element.image" v-if="element.image" alt="" />
                                    </div>
                                    <div class="clear"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 月 -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            year: [],
            trivialList: {}
        };
    },
    created() {
        this.getTrivialList();
    },
    methods: {
        async getTrivialList() {
            const { data: res } = await this.$http2.get('/rest/Trivial');
            res.reverse();
            res.forEach(item => {
                item.datetime = this.$options.filters['playTimeFormat'](item.datetime);
                item.year = item.datetime.substring(0, 4);
                item.time = item.datetime.substring(5);
                item.time = item.time.replace('-', '月').slice(0, 5) + '日' + item.time.slice(5);
                this.trivialList[item.year] = [];
            });
            Object.keys(this.trivialList).forEach(element => {
                this.year.unshift(element);
                this.trivialList[element] = res.filter(item => element === item.year);
            });
            // console.log(res);
        }
    }
};
</script>

<style lang="scss">

.container {
    padding: 70px 0;
    box-sizing: border-box;
    margin-left: 15%;
    margin-right: 15%;
}

.doc-container {
    box-sizing: border-box;
    background-color:  rgba(0, 0, 0, 0);
    // height: 600px;
    width: 100%;
    padding: 15px;
    position: relative;
    min-height: 90vh;
}
.timeline-main {
    position: relative;
    min-height: 85vh;
}
.timeline-line {
    position: absolute;
    left: 18%;
    top: 0;
    height: 100%;
    width: 2px;
    background: #484348;
    z-index: 0;
}
.timeline-year {
    margin: 10px 0;

}
.yearToggle {
    box-sizing: border-box;
    padding-right: 20px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: 400;
}
@media (min-width: 768px) {
    .timeline-main h2,
    .timeline-main h3 {
        width: 16%;
        margin: 5px 0;
        color: #000;
        text-align: right;
    }
}
@media (min-width: 992px) {
    .timeline-main h2 > a {
        font-size: 30px;
        font-weight: 800;
        margin: 5px 0;
        color: #000;
        text-decoration: none;
        border: none;
        text-align: right;
    }
}
.fa-fw {
    width: 1.28571429em;
    text-align: center;
}
.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
ul,
li {
    padding: 0;
    margin: 0;
}
.timeline-month > ul > li {
    padding: 10px 0;
    list-style: none;
}
@media (min-width: 768px) {
    .timeline-month > ul > li .h4 {
        width: 16%;
        display: inline-block;
        text-align: right;
        float: left;
    }
}
.date {
    margin: 0;
    display: inline-block;
    padding: 2px 10px;
    color: #fff;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #484348;;
    border-radius: 1em;
}
.dot-circle {
    color: #484348;
    width: 8%;
    text-align: center;
    font-size: 22px;
    z-index: 1;
    position: relative;
    background: #fff;
    float: left;
    width: 4%;
    font-size: 25px;
    margin-top: 5px;
}
.fadeInRight {
    -webkit-animation-name: fadeInRight;
    animation-name: fadeInRight;
}
@media (min-width: 768px) {
    .content {
        box-sizing: border-box;
        max-width: 70%;
        float: left;
        padding: 20px;
        margin-left: 10px;
        position: relative;
        z-index: 1;
        background: #484348;
        color: #fff;
        border-radius: 1em;
        img {
            box-sizing: border-box;
            width: 100%;
            margin-top: .625rem;
        }
    }
}
.clear {
    clear: both;
}
</style>
