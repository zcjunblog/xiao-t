<template>
    <div class="container"
         :element-loading-text="loadingTips"
         element-loading-spinner="el-icon-loading"
         v-loading.fullscreen.lock="loading"
    >
        <el-container>
            <el-aside width="105px" style="background-color: #F8FAFC">
                <div class="menu">
                    <div class="item" @click="activeKey = item.key" :class="{'active': activeKey === item.key}"
                         v-for="item in menu" :key="item.key">{{item.name}}
                    </div>
                </div>
            </el-aside>
            <el-main class="cards">
                <el-row :gutter="10" v-if="activeCliTemps.length">
                    <el-col :span="8" v-for="(project,index) in activeCliTemps" :key="index">
                        <el-card shadow="hover">
                            <div class="card">
                                <div class="name">{{project.name}}</div>
                                <div class="desc">{{project.desc}}</div>
                                <div class="download">
                                    <span @click="openBrowser(project.url)" class="icon iconfont">&#xe7ba;</span>
                                    <span @click="handleDownload(project)" class="icon iconfont">&#xe601;</span>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-empty style="position: relative;top: 60px;" v-else description="暂无数据" :image="empty"></el-empty>
            </el-main>
        </el-container>
    <!--  下载弹出框  -->
        <el-dialog title="下载项目基础模板" v-model="downloadDialogShow">
            <el-form :model="model" :rules="rules" ref="formRef">
                <el-form-item label="项目名称：" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>
                <el-form-item label="存放目录：" prop="path">
                    <el-input v-model="model.path">
                        <template #append>
                            <el-button icon="el-icon-folder-opened" @click="openFileDialog"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="downloadDialogShow = false">取 消</el-button>
                        <el-button type="primary" @click="handleSubmit">确 定</el-button>
                    </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    const fs = require('fs');
    const path = require('path');
    const {remote, shell} = require('electron')
    import {ElMessage, ElMessageBox} from 'element-plus'
    import {toRefs, reactive, computed, ref, onMounted} from 'vue';
    import empty from "@renderer/assets/empty.png";
    import {gitClone, openBrowser} from "@renderer/utils";

    export default {
        setup: function () {
            const state: any = reactive({
                activeKey: 'all',
                loading: false,
                loadingTips: '正在下载模板...',
                downloadDialogShow: false,
                curItemProject: {},
                model: { // form参数
                    name: '',
                    path: ''
                },
                menu: [
                    {
                        name: '全部',
                        key: 'all'
                    },
                    {
                        name: '移动端',
                        key: 'mobile'
                    },
                    {
                        name: '客户端',
                        key: 'client'
                    },
                    {
                        name: '网页端',
                        key: 'web'
                    },
                    {
                        name: '服务端',
                        key: 'server'
                    },
                ],
                cliTemps: [
                    {
                        name: 'Uni-app + uView',
                        desc: '内置了Vuex,uView,小程序更新机制,各种常用函数....',
                        type: 'mobile',
                        url: 'https://github.com/zcjunblog/uni-app-uView-template',
                        remote: {
                            host: 'github.com',
                            userName: 'zcjunblog',
                            repo: 'uni-app-uView-template',
                            branch: 'master'
                        }
                    },
                    {
                        name: 'Electron + Vite + Element',
                        desc: '基于vue3+vite+electron13的模板',
                        type: 'client',
                        url: 'https://github.com/zcjunblog/vue-electron-element-template',
                        remote: {
                            host: 'github.com',
                            userName: 'zcjunblog',
                            repo: 'vue-electron-element-template',
                            branch: 'master'
                        }
                    },
                ],
                rules: {
                    name: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {pattern: /[A-Za-z0-9_-]+/g, message: '项目名称存在非法字符', trigger: 'change'},
                        {pattern: /^\S*$/, message: '不能含有空格', trigger: 'change'}
                    ],
                    path: [
                        {required: true, message: '请设置项目存放目录', trigger: 'blur'},
                        {pattern: /^\S*$/, message: '不能含有空格', trigger: 'change'}
                    ]
                }
            });
            const activeCliTemps = computed(() => {
                if (state.activeKey === 'all') return state.cliTemps
                return state.cliTemps.filter(el => el.type === state.activeKey)
            })

            // 弹出下载框
            const handleDownload = (item: object) => {
                state.downloadDialogShow = true
                state.curItemProject = item
            }

            // 提交下载表单
            const formRef = ref<null | HTMLElement>(null);
            const handleSubmit = () => {
                formRef.value.validate(async (valid) => {
                    if (!valid) return
                    const data = Object.assign({},state.model)
                    const projectPath = path.resolve(data.path, data.name);
                    if (fs.existsSync(projectPath)) return ElMessage.warning('警告: 文件已存在!');
                    state.loading = true;
                    try {
                        let remote = state.curItemProject.remote
                        console.log(`${remote.host}:${remote.userName}/${remote.repo}#${remote.branch}`, projectPath, { clone: true })
                        await gitClone(`${remote.host}:${remote.userName}/${remote.repo}#${remote.branch}`, projectPath, { clone: true }).catch(err=>{
                            console.log(err)
                            ElMessage.error('模板下载失败');
                        });
                    } catch (error) {
                        console.log(error)
                        ElMessage.error('模板下载失败');
                    }
                    state.loadingTips = '正在写入配置...';
                    let pkg = fs.readFileSync(path.resolve(projectPath, 'package.json'), 'utf8');
                    let pkgJson = JSON.parse(pkg);
                    pkgJson.name = data.name;
                    pkgJson.author = '';
                    fs.writeFileSync(path.resolve(projectPath, 'package.json'), JSON.stringify(pkgJson), { encoding: 'utf8' });
                    state.loadingTips = '';
                    state.loading = false;
                    state.downloadDialogShow = false;
                    state.model.name = ''
                    ElMessageBox.alert('模板已下载，是否打开？', '提示', {
                        confirmButtonText: '确定',
                        callback: () => {
                            shell.openPath(projectPath);
                        },
                    });
                });
            }
            // 选择路径
            const openFileDialog = () => {
                remote.dialog
                    .showOpenDialog({
                        title: '选择保存目录',
                        // defaultPath: '/Users/bwrong/WorkSpace',
                        // filters:(),
                        properties: ['openDirectory', 'createDirectory']
                    })
                    .then(({filePaths}) => {
                        if (filePaths[0]) {
                            state.model.path = filePaths[0];
                        }
                    });
            };

            // 页面加载时
            onMounted(() => {
            });
            return {
                empty,
                formRef,
                openBrowser,
                handleSubmit,
                handleDownload,
                openFileDialog,
                activeCliTemps,
                ...toRefs(state),
            };
        },
    };
</script>

<style scoped lang="scss">
    .container{
        width: 100%;
        height: 100%;
        ::v-deep(.el-dialog__footer){
            padding-bottom: 10px!important;
            border-top: 1px solid #f7f7f7;
        }
        ::v-deep(.el-dialog){
            border-radius: 6px!important;
        }
    }
    .menu{
        .item{
            height: 38px;
            line-height: 38px;
            text-align: left;
            padding: 0 15px;
            color: #505050;
            font-size: 14px;
            cursor: pointer;
            &.active{
                background-color: #e6e6e6;
            }
        }
    }
    .cards{
        ::v-deep(.el-col){
            padding-bottom: 10px;
        }
        .card{
            height: 100px;
            position: relative;
            .name{
                color: #272727;
                font-size: 16px;
                font-weight: bold;
            }
            .desc{
                color: #ADADAD;
                font-size: 14px;
                @include text-overflow(2);
                padding: 15px 0;
            }
            .download{
                cursor: pointer;
                color: #ADADAD;
                text-align: right;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                .icon{
                    font-size: 22px;
                    padding: 0 5px;
                    &:hover{
                        color: #6C9FE2;
                    }
                }
            }
        }
    }
</style>
