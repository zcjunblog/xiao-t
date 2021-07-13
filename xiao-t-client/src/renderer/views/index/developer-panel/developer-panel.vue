<template>
    <div class="container">
        112
    </div>
</template>

<script lang="ts">
    import {toRefs, reactive, onMounted} from 'vue';

    export default {
        setup() {
            const state: any = reactive({
                name: 'joker',
            });
            // 测试函数
            const testFun = (obj: object) => {
                console.log(obj);
            };

            // 页面加载时
            onMounted(() => {

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
