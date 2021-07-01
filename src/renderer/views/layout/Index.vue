<template>
    <div class="layout">
        <div class="layout-left">
            <div class="left-logo">
                <!--<img alt="logo" src="../../assets/inspection_logo.png" width="30">-->
                <img alt="logo" src="../../assets/design_logo.png" width="30">
            </div>
            <div class="left-menu" >
                <el-menu
                        :collapse="collapse"
                        :default-active="curMenuIndex"
                        class="el-menu-vertical"
                        @select="onCollapse"
                        background-color="#222834"
                        text-color="#fff"
                        active-text-color="#4165d7">
                    <el-tooltip :content="item.value" :disabled="!collapse" placement="right" v-for="(item,key) in menus" :key="key">

                    <el-menu-item :index="item.index">
                        <i :class="'el-icon-' + item.icon"></i>
                        <span class="menu-title">{{item.value}}</span>
                    </el-menu-item>
                    </el-tooltip>
                </el-menu>
                <div @click="collapse = !collapse" class="collapsed"
                     :class="{'coll_animation':collapse,'coll_animation_reverse':!collapse}"><i class="el-icon-d-arrow-left"></i>
                </div>
            </div>
        </div>
        <div class="layout-right">
            <div class="right-top">
                <div class="header">
                    <div class="title">{{menus[curMenuIndex].value}}</div>
                    <div class="info">
                       <span class="name">赵子成</span>
                        <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="avatar" alt="">
                    </div>
                </div>
            </div>
            <div class="right-main">
                <router-view></router-view>
            </div>
            <div class="right-bottom"></div>
        </div>

    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data: () => ({
            collapse: false,
            curMenuIndex: 0,
            menus:[
                {
                    index: '0',
                    value: '首页',
                    routerName: 'Workbench',
                    icon: 'data-analysis'
                },
                {
                    index: '1',
                    value: '任务',
                    routerName: 'Order',
                    icon: 'tickets'
                }
            ]
        }),
        created() {
            if(this.vuex_menuIndex){
                this.curMenuIndex = this.vuex_menuIndex
            }
        },
        mounted() {
        },
        methods: {
            onCollapse(key){
                this.curMenuIndex = key
                let routerName = this.menus[this.curMenuIndex].routerName // 跳转对应的路由
                this.$m.vuex('vuex_menuIndex',this.curMenuIndex)
                this.$router.push({name:routerName})
            },
        },
    });
</script>

<style scoped lang="scss">
    .coll_animation {
        transition: all 1s;
        transform: rotateZ(180deg);
    }
    .coll_animation_reverse {
        transition: all 1s;
        transform: rotateZ(360deg);
    }
    .el-menu-vertical:not(.el-menu--collapse) {
        width: 200px;
    }
    .el-menu-item.is-active{
        background-color: rgba(10, 10, 10, 0.97) !important;
    }
    .layout {
        display: flex;
        height: 100vh;
        overflow: hidden;
    }
    .layout-right {
        position: relative;
        flex: 1;
        overflow: auto;
        background-color: #f7f7f7;
        .right-top{
            .header{
                height: 50px;
                font-size: 12px;
                font-weight: 400;
                background-color: #fff;
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .info{
                display: flex;
                align-items: center;
                .name{
                    padding-right: 15px;
                }
                .avatar{
                    height: 32px;
                    width: 32px;
                    border-radius: 32px;
                }
            }
        }
    }
    .main-content {
        margin: 24px;
        position: relative;
    }
    .layout-left{
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #222834;
        color: #c0c4cc;
        transition-duration: .1s;
    }
    .left-logo{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .left-menu{
        flex: 1;
        overflow: hidden auto;
        position: relative;
        .collapsed {
            text-align: center;
            height: 58px;
            line-height: 58px;
            color: #fff;
            cursor: pointer;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;

            i {
                font-size: 16px;
            }
        }
    }
    .el-icon-menu{
        color: #fff;
    }
    .menu-title{
        font-size: 12px;
    }
    .el-menu{
        border-right: 0!important;
    }
    .el-menu .el-menu-item:hover {
        background-color: #4165d7!important;
        color: #fff!important;
    }
    .right-main{
        padding: 20px;
    }
</style>
