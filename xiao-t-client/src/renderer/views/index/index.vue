<template>
    <div class="main">
            <div v-show="showMain">
                <el-menu :selectedKeys="current" mode="horizontal" @select="changePath">
                    <el-menu-item key="market">
                        <el-icon type="appstore"/>
                        插件中心
                    </el-menu-item>
                    <el-menu-item key="plugin">
                        <el-icon type="heart"/>
                        已安装
                    </el-menu-item>
                    <el-menu-item key="dev">
                        <el-icon type="code"/>
                        开发者
                    </el-menu-item>
                    <el-menu-item key="settings">
                        <el-icon type="setting"/>
                        设置
                    </el-menu-item>
                </el-menu>
            </div>
            <router-view/>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import layout from '../layout/Index.vue'
    import cardIncome from './components/card-income.vue';
    import cardList from './components/card-list.vue';
    import cardChart from './components/card-chart.vue';
    import cardTable from './components/card-table.vue';
    export default defineComponent({
        components:{
            cardList,
            cardTable,
            cardChart,
            cardIncome,
        },
        data: () => ({

        }),
        created() {
        },
        mounted() {
        },
        methods: {

        },
    });
</script>

<style scoped lang="scss">
    .home {
        overflow: hidden auto;

        .card {
            background-color: #fff;
            border-radius: 5px;
            margin-bottom: 15px;

            &--last {
                margin-bottom: 0;
            }
        }
    }
</style>
