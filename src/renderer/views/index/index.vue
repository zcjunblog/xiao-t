<template>
    <div class="main">
            <div class="home">
                <el-row :gutter="15">
                    <el-col :span="6">
                        <div class="card">
                            <card-income></card-income>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="card">
                            <card-income></card-income>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="card">
                            <card-income></card-income>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="card">
                            <card-income></card-income>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                    <el-col :span="24" :xl="14">
                        <div class="card">
                            <card-table></card-table>
                        </div>
                    </el-col>
                    <el-col :span="24" :xl="10">
                        <div class="card">
                            <card-list></card-list>
                        </div>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <div class="card card--last">
                            <card-chart></card-chart>
                        </div>
                    </el-col>
                </el-row>
            </div>
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
