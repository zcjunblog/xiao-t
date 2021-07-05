<template>
    <div class="sky_titleBar">
        <div class="bar-main">
            <div class="logo"><img class="img" src="../../assets/logo.png" alt=""></div>
            <div class="text"><slot></slot></div>
            <div class="options">
                <div class="option" @click="optionsClickHandle('setting')"><span class="icon iconfont" style="font-size: 18px">&#xe6f4;</span></div>
                <div class="option" @click="optionsClickHandle('zIndex')"><span class="icon iconfont">&#xe61a;</span></div>
                <div class="option" @click="optionsClickHandle('minimize')"><span class="icon iconfont">&#xe67c;</span></div>
                <div class="option" @click="optionsClickHandle('maximize')"><span class="icon iconfont" style="font-size: 12px">&#xe64c;</span></div>
                <div class="option" @click="optionsClickHandle('close')"><span class="icon iconfont" style="font-size: 14px">&#xe600;</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive} from 'vue'
const {Menu,app} = require('electron').remote;
export default defineComponent({
    setup() {
        const state: any = reactive({

        });
        // 右上角功能菜单
        const optionsClickHandle = (key: string) => {
            console.log(key);
            key === 'setting' && settingHandle()
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
                // {type:'separator'},
                {label:'快捷呼出',type:'checkbox',checked:true, accelerator: 'F2',},
            ]);
            // //此时窗口的菜单也会变成菜单项的内容
            menu.popup({x:760,y:40});
        }
        return {
            optionsClickHandle,
            ...toRefs(state),
        };
    },
})
</script>

<style scoped lang="scss">
    .sky_titleBar {
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
</style>
<style>
.sky_titleBar * {
    /*-webkit-app-region: no-drag;*/
}
</style>
