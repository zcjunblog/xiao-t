<template>
    <div class="home">
        <div class="titleBar">
            <div class="bar-main">
                <div class="logo"><img class="img" src="../../assets/logo.png" alt=""></div>
                <div class="text">名字</div>
                <div class="options">
                    <div class="option" v-if="vuex_openInNewWin">
                        <span @click="" class="icon iconfont" style="font-size: 18px">&#xe600;</span>
                    </div>
                    <div class="option" v-else><span @click="backToLastPage" class="icon iconfont" style="font-size: 18px">&#xe602;</span></div>
                </div>
            </div>
        </div>
        <div class="main">
            <webview id="webview" :src="path" :preload="preload"></webview>
        </div>
    </div>
</template>

<script lang="ts">
    import path from 'path';
    import {toRefs, reactive, onMounted} from 'vue';
    import { useRouter, useRoute } from 'vue-router'
    export default {
        setup() {
            const route = useRoute()
            const router = useRouter()
            const state: any = reactive({
                // path: `File://${this.$route.query.sourceFile}`,
                // 加载当前 static 目录中的 preload.js
                // preload: `File://${path.join(__static, './preload.js')}`,
                webview: null,
                // query: this.$route.query,
                config: {},
            });
            // 测试函数
            const backToLastPage = () => {
                router.go(-1)
            };

            // 页面加载时
            onMounted(() => {
                console.log(route.params)
            });
            return {
                backToLastPage,
                ...toRefs(state),
            };
        },

    };
</script>

<style scoped lang="scss">
    .home {
        height: 100%;
        overflow: hidden auto;
        .main{
            height: calc(100% - 40px);
        }
        .titleBar {
            width: 100%;
            height: 40px;
            position: sticky;
            top: 0;
            background-color: #E7EAED;
            display: flex;
            align-items: center;
            z-index:10;
            -webkit-app-region: drag;
            .bar-main{
                flex: 1;
                display: flex;
                align-items: center;
                height: 100%;
                .logo{
                    flex: 0 0 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select:none;
                    .img{
                        width: 30px;
                        height: 30px;
                    }
                }
                .text{
                    flex: 1;
                    user-select:none;
                }
                .options{
                    flex: 0 0 40px;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    user-select:none;
                    -webkit-app-region: no-drag;
                    .option{
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        height: 100%;
                        &:hover{
                            background-color: #888888;
                            .iconfont{
                                color: #fff;
                            }
                        }
                        .iconfont{
                            font-size: 16px;
                            color: #6a6a6a;
                        }
                    }
                }
            }
        }
    }
</style>
