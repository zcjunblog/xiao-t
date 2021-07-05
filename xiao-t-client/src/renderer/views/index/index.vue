<template>
    <div>
        <TitleBar>
            项目模板
        </TitleBar>
        <div class="main">
            <wired-input placeholder="Enter name"></wired-input>
            <wired-button>Click Me</wired-button>
        </div>
    </div>

</template>

<script lang="ts">
    import "wired-elements";
    import { defineComponent, getCurrentInstance, toRefs, reactive, onMounted} from 'vue'
    import { useStore } from 'vuex'
    export default defineComponent({
        setup() {
            const { proxy }: any = getCurrentInstance()
            const { $m } = getCurrentInstance().appContext.config.globalProperties
            const store = useStore()
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
