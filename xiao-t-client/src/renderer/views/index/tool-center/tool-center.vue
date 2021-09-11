<template>
    <div class="container"
         element-loading-spinner="el-icon-loading"
         v-loading="loading"
    >
        <el-container v-if="online">
            <el-aside width="105px" style="background-color: #F8FAFC">
                <div class="menu">
                    <div class="item" @click="activeKey = item.key" :class="{'active': activeKey === item.key}"
                         v-for="item in menu" :key="item.key">{{item.name}}
                    </div>
                </div>
            </el-aside>
            <el-main class="cards">
                <el-row :gutter="10" v-if="activeKey === 'my' ? myPlugins.length : plugins.length">
                    <el-col :span="8" v-for="(plugin,index) in activePluginList" :key="index">
                        <el-card shadow="hover">
                            <div class="card" @click="showPluginDetail(plugin)">
                                <div class="left">
                                    <!-- 加载插件目录下的logo -->
                                    <el-avatar size="medium" :src="plugin.icon"></el-avatar>
                                </div>
                                <div class="right">
                                    <div class="name">{{plugin.pluginName}}</div>
                                    <div class="desc">{{plugin.description}}</div>
                                    <!--下载插件-->
                                    <div class="download" v-if="!myPluginNames.includes(plugin.pluginName)">
                                        <span @click.stop="handleDownload(plugin)" class="icon iconfont">&#xe601;</span>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-empty style="position: relative;top: 60px;" v-else description="暂无数据" :image="empty"></el-empty>
            </el-main>
        </el-container>
        <el-container v-else style="display: flex;justify-content: center;align-items: center;">
            <el-empty description="没有网络" :image="offline"></el-empty>
        </el-container>
        <!--插件详情-->
        <el-drawer
                size="80%"
                title="插件详情"
                v-model="pluginDetailShow"
                destroy-on-close>
            <div class="plugin-detail">
                <div class="plugin-top">
                    <div class="left">
                        <el-avatar shape="square" :size="120" :src="curSelectPlugin.icon"></el-avatar>
                    </div>
                    <div class="right">
                        <div class="name">{{curSelectPlugin.pluginName}}
                        </div>
                        <div class="desc">
                            开发者: <span style="color: #3a8ee6;cursor: pointer;padding-right: 10px" @click="openBrowser(curSelectPlugin.homepage)">{{curSelectPlugin.author}}</span>
                            版本: {{curSelectPlugin.version}}
                        </div>
                        <div class="desc">{{curSelectPlugin.description}}</div>
                    </div>
                </div>
                <div class="plugin-bottom">
                    <div class="markdown-body" v-html="readme"></div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
    import {toRefs, reactive, onMounted, computed, getCurrentInstance} from 'vue';
    import empty from "@renderer/assets/empty.png";
    import offline from "@renderer/assets/offline.png";
    import {useStore} from "vuex";
    import {openBrowser} from "@renderer/utils";
    import marked from 'marked';
    const { ipcRenderer,remote } = require("electron");
    const rendererMD = new marked.Renderer();
    const fs = require('fs');
    const path = require("path");
    import { useRouter } from 'vue-router'
    import { getPluginList } from '@renderer/api/plugin';
    import {ElMessage} from "element-plus";
    import {getPluginFileByUrl} from '@renderer/utils'

    export default {
        setup: function () {
            const store = useStore()
            const router = useRouter()
            const { $m } = getCurrentInstance().appContext.config.globalProperties
            const state: any = reactive({
                online: navigator.onLine,
                activeKey: 'my',
                loading: false,
                pluginDetailShow: false,
                curSelectPlugin: {},
                curItemTemplate: {},
                myPluginNames: [],
                plugins: [], // 从后端拉取插件列表数据
                myPlugins: [],
                menu: [
                    {
                        name: '我的',
                        key: 'my'
                    },
                    {
                        name: '全部',
                        key: 'all'
                    }
                ],

            });
            const activePluginList = computed(() => {
                return state.activeKey === 'all' ? state.plugins : state.myPlugins
            })
            const readme = computed(() => {
                marked.setOptions({
                    renderer: rendererMD,
                    gfm: true,
                    breaks: false,
                    pedantic: false,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false
                });
                try {
                    const mdFile = path.join(state.curSelectPlugin.sourceFile, 'README.md');
                    return marked(fs.readFileSync(mdFile, 'utf8'));
                } catch (e) {
                    return '<p>暂无描述信息</p>'
                }

            })

            const readDirectory = (pathName, plugins = []) => {
                console.log('%c读取插件目录耗时↓↓↓↓↓','color: #ff6f00;font-weight:bold;font-size:18px;')
                console.time()
                //fs.readdir读取文件目录
                fs.readdirSync(pathName).forEach((item, index) => {
                    if (item  !=='_download'){
                        let filePath = path.join(pathName, item)
                        let pluginDetail;
                        try {
                            pluginDetail = JSON.parse(fs.readFileSync(filePath + '\\plugin.json', 'utf-8'))
                            delete pluginDetail.features
                        }catch (e) {
                            console.log(e)
                            pluginDetail = null
                        }
                        if (pluginDetail){
                            pluginDetail.sourceFile = filePath
                            pluginDetail.icon = path.join(filePath, pluginDetail.logo)
                            state.myPluginNames.push(pluginDetail.pluginName)
                            plugins.push(pluginDetail)
                        }
                    }
                })
                console.timeEnd();
                return plugins
            }

            const getMyPlugins = () => {
                state.myPlugins = readDirectory(store.state.vuex_pluginDir)// 由用户选择的插件目录
            }
            const getPlugins = () => {
                getPluginList().then(res=>{
                    console.log(res)
                    res.data.forEach(item=>{
                        let pluginDetail;
                        try {
                            pluginDetail = JSON.parse(item.pluginJson)
                            delete pluginDetail.features
                        }catch (e) {
                            console.log(e)
                            pluginDetail = null
                        }
                        if (pluginDetail){
                            pluginDetail.icon = item.icon
                            pluginDetail.downloadUrl = item.downloadUrl
                            state.plugins.push(pluginDetail)
                        }
                    })
                })
            }
            const handleDownload = (e) => {
                if (!store.state.vuex_pluginDir){
                    ElMessage.error('请先设置插件目录')
                    // 让用户选择
                    remote.dialog
                        .showOpenDialog({
                            title: '选择插件目录',
                            properties: ['openDirectory', 'createDirectory']
                        })
                        .then(({filePaths}) => {
                            console.log('filePaths',filePaths)
                            if (filePaths[0]) {
                                $m.vuex('vuex_pluginDir',filePaths[0])
                            }
                        });
                    return
                }
                // 下载到插件目录下的_download目录
                console.log(e)
                state.loading = true
                getPluginFileByUrl(e.downloadUrl,e.pluginName + '.zip',store.state.vuex_pluginDir + '\\_download').then(()=>{
                    console.log(112)
                    state.loading = false
                })
            }
            const showPluginDetail = (e) => {
                if (state.activeKey === 'my'){
                    if (store.state.vuex_openInNewWin){
                        ipcRenderer.invoke("open-win", {url: '/plugin/' + encodeURIComponent(JSON.stringify(e))});
                    }else {
                        router.push('/plugin/'  + encodeURIComponent(JSON.stringify(e)))
                    }
                    return
                }
                state.curSelectPlugin = e
                state.pluginDetailShow = true
            }

            // 页面加载时
            onMounted(() => {
                if (store.state.vuex_pluginDir) { // 加载插件目录下的插件信息
                    getPlugins()
                    getMyPlugins()
                }
                window.addEventListener('offline', (e) => {
                    console.log(e)
                    state.online = false
                })
                window.addEventListener('online', (e) => {
                    console.log(e)
                    state.online = true
                })
            });
            return {
                empty,
                readme,
                offline,
                openBrowser,
                activePluginList,
                handleDownload,
                showPluginDetail,
                ...toRefs(state),
            };
        },
    };
</script>

<style scoped lang="scss">
    .container {
        width: 100%;
        height: 100%;

        ::v-deep(.el-dialog__footer) {
            padding-bottom: 10px !important;
            border-top: 1px solid #f7f7f7;
        }

        ::v-deep(.el-dialog) {
            border-radius: 6px !important;
        }
    }

    .menu {
        .item {
            height: 38px;
            line-height: 38px;
            text-align: left;
            padding: 0 15px;
            color: #505050;
            font-size: 14px;
            cursor: pointer;

            &.active {
                background-color: #e6e6e6;
            }
        }
    }

    .cards {
        ::v-deep(.el-col) {
            padding-bottom: 10px;
        }

        .card {
            height: 40px;
            position: relative;
            cursor: pointer;
            display: flex;

            .left {
                flex: 0 0 40px;
            }

            .right {
                flex: 1;
                padding-left: 10px;

                .name {
                    color: #272727;
                    font-size: 16px;
                    font-weight: bold;
                }

                .desc {
                    color: #ADADAD;
                    font-size: 12px;
                    @include text-overflow(2);
                    font-weight: 100;
                    width: 85%;
                }

                .download {
                    color: #ADADAD;
                    text-align: right;
                    position: absolute;
                    right: -8px;
                    top: 8px;

                    .icon {
                        font-size: 22px;
                        padding: 0 5px;

                        &:hover {
                            color: #6C9FE2;
                        }
                    }
                }
            }
        }
    }
    .plugin-detail{
        overflow: scroll;
        height: 520px;
        padding: 20px;
        border-top: 1px solid #eee;
        .plugin-top{
            display: flex;
            .left{
                flex: 0 0 140px;
                ::v-deep(.el-avatar--square){
                    border-radius: 10px!important;
                }
            }
            .right{
                padding-left: 10px;
                flex: 1;
                .name {
                    color: #272727;
                    font-size: 38px;
                    font-weight: bold;
                }

                .desc {
                    color: #ADADAD;
                    font-size: 14px;
                    padding: 5px 0;
                    font-weight: 100;
                }
            }
        }
    }
    ::v-deep(.el-overlay){
        top: 40px!important;
    }
</style>
