<template>
    <div class="dashboard-container">
        <el-card shadow="hover"
        >
            <div class="dashboard-text">账号: {{ name }}</div>
        </el-card
        >
        <el-row>
            <el-col :span="12" v-for="(item, index) in optionList" :key="index">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>{{ item.title }}</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮
                        </el-button>
                    </div>
                    <core-echarts :chartId="item.id" :option="item.option"></core-echarts>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CoreEcharts from '../../components/Ocechatrs/CoreEcharts.vue';

export default {
    components: { CoreEcharts },
    name: 'Home',
    data() {
        return {
            categories: 50,
            optionList: [
                {
                    id: 'chart1',
                    title: '文章统计',
                    option: {
                        title: {
                            text: '文章分类数量',
                            subtext: '',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left'
                        },
                        series: [
                            {
                                name: '数量',
                                type: 'pie',
                                radius: '50%',
                                data: [
                                    // { value: '', name: '' },
                                ],
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    id: 'chart2',
                    title: '数量统计',
                    option: {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['分类', '文章', '留言', '管理用户', '普通用户'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '数量',
                                type: 'bar',
                                barWidth: '60%',
                                data: []
                            }
                        ]
                    }
                }
            ]
        };
    },
    computed: {
        ...mapGetters(['name'])
    },
    mounted() {
        this.getDatas();
    },
    methods: {
        async getDatas() {
            const { data: res1 } = await this.$http.get('/rest/categorys');
            const { data: res2 } = await this.$http.get('/rest/articles');
            const { data: res3 } = await this.$http.get('/rest/messages');
            const { data: res4 } = await this.$http.get('/rest/adminUsers');
            const { data: res5 } = await this.$http.get('/rest/Users');
            console.log(res4);
            this.optionList[1].option.series[0].data.push(
                res1.length,
                res2.length,
                res3.data.length,
                res4.length,
                res5.length
            );
            let type = res1.find((key) => key.name === '文章标签').children;
            type.forEach((key, index) => {
                let names = { name: key.name, value: 0 };
                this.optionList[0].option.series[0].data.push(names);
            });
            res2.forEach((element) => {
                element.categories.forEach((item) => {
                    // console.log(item);
                    this.optionList[0].option.series[0].data.forEach((key) => {
                        if (item.name === key.name) {
                            key.value += 1;
                        }
                    });
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        // margin: 30px;
    }

    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}

.chart-1 {
    width: 100%;
    height: 400px;
}
</style>
