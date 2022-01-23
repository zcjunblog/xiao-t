<template>
    <div class="container">
        <!--TODO: 目前这个项目不支持vue3 这里应该本地嵌入一个 离线也能使用-->
        <iframe src="https://mrhj.gitee.io/form-generator/" frameborder="0" height="100%" width="100%"></iframe>
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
    .container{
        height: 100%;
    }
</style>
