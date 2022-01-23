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
              <div v-if="1">112</div>
                <el-empty style="position: relative;top: 60px;" v-else description="暂无数据" :image="empty"></el-empty>
            </el-main>
        </el-container>
        <el-container v-else style="display: flex;justify-content: center;align-items: center;">
            <el-empty description="没有网络" :image="offline"></el-empty>
        </el-container>
    </div>
</template>

<script lang="ts">
    import {toRefs, reactive,onMounted} from 'vue';
    import empty from "@renderer/assets/empty.png";
    import offline from "@renderer/assets/offline.png";

    export default {
        setup: function () {
            const state: any = reactive({
                online: navigator.onLine,
                activeKey: 'all',
                loading: false,
                curItemTemplate: {},
                menu: [
                    {
                        name: '全部',
                        key: 'all'
                    },
                    {
                        name: '商城',
                        key: 'shop'
                    },
                    {
                        name: '社交',
                        key: 'social'
                    },
                    {
                        name: '休闲',
                        key: 'leisure'
                    },
                    {
                        name: '生活',
                        key: 'life'
                    },
                    {
                        name: '知识',
                        key: 'knowledge'
                    },
                ],

            });

            // 页面加载时
            onMounted(() => {
                window.addEventListener('offline', (e)=> {
                    console.log(e)
                    state.online = false
                })
                window.addEventListener('online', (e)=> {
                    console.log(e)
                    state.online = true
                })
            });
            return {
                empty,
                offline,
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
</style>
