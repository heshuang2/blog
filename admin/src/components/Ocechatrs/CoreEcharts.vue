<template>
    <div class="echarts-container" :ref="chartId" :chartId="chartId" :option="option"></div>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { PieChart, BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, PieChart, BarChart, CanvasRenderer]);

export default {
    props: ['chartId', 'option'],
    data() {
        return {
            ChartLineGraph: null
        };
    },
    watch: {
        option: {
            handler(newValue, oldValue) {
                this.drawLineGraph(this.chartId, newValue);
            },
            deep: true
        }
    },
    mounted() {
        this.drawLineGraph(this.chartId, this.option);
    },
    methods: {
        drawLineGraph(id, data) {
            // eslint-disable-next-line no-unused-vars
            let _this = this;
            let muChart = this.$refs[id];
            this.ChartLineGraph = echarts.init(muChart);
            this.ChartLineGraph.setOption(data);
            window.addEventListener('resize', function () {
                _this.ChartLineGraph.resize();
            });
        }
    },
    beforeDestroy() {
        if (this.ChartLineGraph) {
            this.ChartLineGraph.clear();
        }
    },
    components: {}
};
</script>

<style lang="scss">
.echarts-container {
    width: 100%;
    height: 300px;
}
</style>