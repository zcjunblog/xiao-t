<template>
    <div class="home">
        <div class="titleBar">
            <div class="bar-main">
                <div class="logo"><img class="img" :src="pluginInfo.icon" alt=""></div>
                <div class="text">
                    <!--{{pluginInfo.pluginName}} {{pluginInfo.version}}-->
                    <el-input v-model="pluginInputValue" size="mini" :placeholder="pluginInputPlaceHolder" @keyup.enter.native="search"></el-input>
                </div>
                <div class="options">
                    <!--关闭-->
                    <div class="option" v-if="vuex_openInNewWin" @click="close">
                        <span class="icon iconfont" style="font-size: 18px">&#xe600;</span>
                    </div>
                    <!--返回-->
                    <div class="option" v-else @click="backToLastPage">
                        <span class="icon iconfont" style="font-size: 18px">&#xe602;</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="main">
            <webview id="webview" webpreferences="contextIsolation=false" style="height: 100%;" :src="path"
                     :preload="preload"></webview>
        </div>
    </div>
</template>

<script lang="ts">
    const path = require('path');
    const {shell, ipcRenderer} = require('electron')
    import {toRefs, reactive, onMounted} from 'vue';
    import {useRouter, useRoute} from 'vue-router'


    export default {
        setup() {
            const route = useRoute()
            const router = useRouter()
            const state: any = reactive({
                pluginInputValue: '',
                pluginInputPlaceHolder:'',
                path: null,
                // 加载当前 static 目录中的 preload.js
                preload: null,
                pluginInfo: {
                    icon: "",
                    version: ""
                },
            });
            // 测试函数
            const backToLastPage = () => {
                router.go(-1)
            };

            const close = () => {
                window.close()
            }
            const search = () => {
                const webview = document.getElementById('webview')
                webview.send('msg-back-setSubInput', state.pluginInputValue);
            }

            // 页面加载时
            onMounted(() => {
                // 插件信息
                state.pluginInfo = JSON.parse(route.query.info)
                state.path = state.pluginInfo.sourceFile + '\\' + state.pluginInfo.main
                if (process.env.NODE_ENV === 'production') {
                    state.preload = `file://${__static}/preload.js`
                } else {
                    state.preload = path.join(__dirname, '../../../../../../static/preload.js')
                }
                ipcRenderer.on('send-data', (event, data) => {
                    console.log(event)
                    console.log(data)
                })
                // 调用插件生命周期
                const webview = document.getElementById('webview')
                webview.addEventListener("dom-ready", function () {
                    webview.openDevTools()
                    webview.send('onPluginReady', JSON.stringify(state.pluginInfo));
                    webview.send('onPluginEnter', JSON.stringify(state.pluginInfo));
                });
                // 监听host消息
                webview.addEventListener('ipc-message', (event) => {
                    if (event.channel === 'setSubInput') {
                        state.pluginInputPlaceHolder = event.args[0].placeHolder
                    }

                    if (event.channel === 'setSubInputValue') {
                        state.pluginInputValue = event.args[0].text
                        // webview.send('msg-back-setSubInput',  state.pluginInputValue);
                    }
                })
            });
            return {
                close,
                search,
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

        .main {
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
            z-index: 10;
            -webkit-app-region: drag;

            .bar-main {
                flex: 1;
                display: flex;
                align-items: center;
                height: 100%;

                .logo {
                    flex: 0 0 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;

                    .img {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                    }
                }

                .text {
                    flex: 1;
                    user-select: none;
                    ::v-deep(.el-input__inner){
                        width: 310px;
                        border-radius: 40px;
                        border: none;
                        box-shadow: none;
                        -webkit-app-region: no-drag;
                    }
                }

                .options {
                    flex: 0 0 40px;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    user-select: none;
                    -webkit-app-region: no-drag;

                    .option {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        height: 100%;

                        &:hover {
                            background-color: #888888;

                            .iconfont {
                                color: #fff;
                            }
                        }

                        .iconfont {
                            font-size: 16px;
                            color: #6a6a6a;
                        }
                    }
                }
            }
        }
    }
</style>
