<template>
    <div class="container">
        code-generator
    </div>
</template>

<script lang="ts">
    import {toRefs, reactive, onMounted} from 'vue';

    export default {
        setup() {
            const state: any = reactive({
                name: 'joker',
                test: {
                    param: {
                        pageNum: 1,
                        pageSize: 10,
                    },
                },
            });
            // 初始化表格数据
            const test = () => {
                console.log(state.name)
                testFun(state.test)
            };
            // 测试函数
            const testFun = (obj: object) => {
                console.log(obj);
            };

            // 页面加载时
            onMounted(() => {
                test();
            });
            return {
                testFun,
                ...toRefs(state),
            };
        },
    };
</script>

<style scoped lang="scss">

</style>
