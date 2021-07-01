<template>
    <div class="card-chart">
        <div class="card-chart__header">
            <span>收入统计图</span>
        </div>
        <div class="card-chart__container">
            <div id="chart" style="width:100%;height:400px;"></div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import echarts from "echarts"

    window.onresize = function() {
        // 浏览器窗口变化后需要做的事情
        // location.reload()
        const echart = echarts.init(document.getElementById('chart') as HTMLDivElement);
        echart.resize();
    }
    export default defineComponent({
        data: () => ({

        }),
        created() {
        },
        mounted() {
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }

                    }
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
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
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {},
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };
            const chart = echarts.init(document.getElementById('chart') as HTMLDivElement);
            chart.setOption(option);
        },
        methods: {

        },
    });
</script>

<style lang="scss" scoped>

    .card-chart {
        &__header {
            display: flex;
            align-items: center;
            height: 50px;
            font-size: 15px;
            font-weight: bold;
            color: #333333;
            padding: 0 20px;
        }

        &__container {
            padding: 0 20px;
        }
    }
</style>
