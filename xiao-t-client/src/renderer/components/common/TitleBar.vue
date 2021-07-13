<template>
    <div class="titleBar" :class="{'cant-drag':vuex_maximize}">
        <div class="bar-main">
            <div class="logo"><img class="img" src="../../assets/logo.png" alt=""></div>
            <div class="text"><slot></slot></div>
            <div class="options">
                <div class="option" @click="optionsClickHandle('setting')"><span class="icon iconfont" style="font-size: 18px">&#xe6f4;</span></div>
                <div class="option" @click="optionsClickHandle('zIndex')">
                    <span class="icon iconfont" v-if="vuex_atTheTop">&#xe60f;</span>
                    <span class="icon iconfont" v-else>&#xe61a;</span>
                </div>
                <div class="option" @click="optionsClickHandle('minimize')"><span class="icon iconfont">&#xe67c;</span></div>
                <div class="option" @click="optionsClickHandle('maximize')">
                    <span class="icon iconfont" v-if="vuex_maximize" style="font-size: 12px">&#xe677;</span>
                    <span class="icon iconfont" v-else style="font-size: 12px">&#xe64c;</span>
                </div>
                <div class="option" @click="optionsClickHandle('close')"><span class="icon iconfont" style="font-size: 14px">&#xe600;</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,getCurrentInstance, toRefs, reactive, onMounted} from 'vue'
import { useStore } from 'vuex'
const {Menu,app} = require('electron').remote;
const { ipcRenderer } = require("electron");

export default defineComponent({
    setup() {
        const { $m } = getCurrentInstance().appContext.config.globalProperties
        const store = useStore()
        const state: any = reactive({

        });
        // 右上角功能菜单
        const optionsClickHandle = (key: string) => {
            key === 'setting' && settingHandle() // 弹出设置项菜单
            if (key === 'zIndex'){ // 置顶
                ipcRenderer.send("zIndexMessage",!store.state.vuex_atTheTop);
            }
            if (key === 'minimize'){ // 最小化
                ipcRenderer.send("minimizeMessage");
            }
            if (key === 'maximize'){ // 最大化以及退出最大化
                ipcRenderer.send("maximizeMessage",store.state.vuex_maximize);
            }
            if (key === 'close'){ // 最大化以及退出最大化
                ipcRenderer.send("closeMessage");
            }
        };
        const settingHandle = () =>{
            let menu = Menu.buildFromTemplate([
                {label:'开机自启',type:'checkbox',checked:app.getLoginItemSettings().openAtLogin, click : function () {
                        if(!app.isPackaged){
                            app.setLoginItemSettings({
                                openAtLogin: !app.getLoginItemSettings().openAtLogin,
                                path: process.execPath
                            })
                        }else{
                            app.setLoginItemSettings({
                                openAtLogin: !app.getLoginItemSettings().openAtLogin
                            })
                        }
                        console.log(app.getLoginItemSettings().openAtLogin)
                        console.log(!app.isPackaged);
                    }
                },
                {label:'快捷唤醒',type:'checkbox',checked:true, accelerator: 'F2'},
                {label:'插件目录',click : ()=>{
                        // 判断用户是否已选择插件目录
                    }},
                {type:'separator'},
                {label:'调试模式', type:'checkbox'},
                {label:'快速重启', accelerator: 'F5', role: 'reload'},
                {label:'新窗口打开插件',type:'checkbox',checked:store.state.vuex_openInNewWin, click : ()=>{
                        $m.vuex('vuex_openInNewWin',!store.state.vuex_openInNewWin)
                    }},
            ]);
            //此时窗口的菜单也会变成菜单项的内容
            menu.popup();
        }
        onMounted(()=>{
            ipcRenderer.on('receiveZIndexMessage', (event, atTheTop)=>{
                $m.vuex('vuex_atTheTop',atTheTop)
            })
            ipcRenderer.on('receiveMaximizeMessageMessage', (event, maximize)=>{
                $m.vuex('vuex_maximize',maximize)
            })
        })
        return {
            optionsClickHandle,
            ...toRefs(state),
        };
    },
})
</script>

<style scoped lang="scss">
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
                flex: 0 0 240px;
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
    .cant-drag{
        -webkit-app-region: no-drag!important;
    }
</style>
<style>
.sky_titleBar * {
    /*-webkit-app-region: no-drag;*/
}
</style>
