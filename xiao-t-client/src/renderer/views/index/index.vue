<template>
    <div class="home">
        <TitleBar>
            XIAO-T
        </TitleBar>
        <div class="main">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane name="first">
                    <template #label>
                        <span><span class="icon iconfont">&#xe617;</span> 创建项目</span>
                    </template>
                    <cli-template-clone></cli-template-clone>
                </el-tab-pane>
                <el-tab-pane name="second">
                    <template #label>
                        <span><span class="icon iconfont">&#xe695;</span> 工具中心</span>
                    </template>
                    <tool-center></tool-center>
                </el-tab-pane>
                <el-tab-pane name="third">
                    <template #label>
                        <span><span class="icon iconfont">&#xe694;</span> 模板仓库</span>
                    </template>
                    <templateLibrary></templateLibrary>
                </el-tab-pane>
                <el-tab-pane name="fourth">
                    <template #label>
                        <span><span class="icon iconfont" style="font-size: 18px">&#xe615;</span> 开发者</span>
                    </template>
                    <developer-panel></developer-panel>
                    <!--<form-generator></form-generator>-->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">

    import { defineComponent, getCurrentInstance, toRefs, reactive, onMounted} from 'vue'
    import { useStore } from 'vuex'
    import cliTemplateClone from './cli-template-clone/cli-template-clone.vue'
    import templateLibrary from './template-library/template-library.vue'
    import toolCenter from './tool-center/tool-center.vue'
    import formGenerator from './form-generator/form-generator.vue'
    import developerPanel from './developer-panel/developer-panel.vue'
    export default defineComponent({
        components:{
            toolCenter,
            formGenerator,
            cliTemplateClone,
            templateLibrary,
            developerPanel
        },
        setup() {
            const { $m } = getCurrentInstance().appContext.config.globalProperties
            const store = useStore()
            const state: any = reactive({
                activeName: 'first'
            });
            const handleClick = (tab, event) => {
                // console.log(tab, event);
            };

            // 页面加载时
            onMounted(() => {

            });
            return {
                handleClick,
                ...toRefs(state),
            };
        },
    });
</script>

<style scoped lang="scss">
    .home {
        height: 100%;
        overflow: hidden auto;
        ::v-deep(.el-tabs__item.is-top:nth-child(2)){
            padding-left: 20px!important;
        }
        ::v-deep(.el-tabs--card .el-tabs__header .el-tabs__item){
            padding: 0 15px!important;
        }
        ::v-deep(.el-tabs__header){
            margin-bottom: 0!important;
        }
        ::v-deep(.el-tabs--card .el-tabs__header .el-tabs__item),
        ::v-deep(.el-tabs--card .el-tabs__header),
        ::v-deep(.el-tabs--card .el-tabs__header .el-tabs__nav){
            border: none;
        }
        ::v-deep(.el-tabs--card .el-tabs__header .el-tabs__item.is-active){
            border-bottom: 2px solid #6C9FE2;
        }
        ::v-deep(.el-tabs),::v-deep(.el-tab-pane),::v-deep(.el-container){
            height: 100%;
        }
        ::v-deep(.el-tabs__content){
            height: calc(100% - 40px);
        }
        .main{
            height: calc(100% - 40px);
            .iconfont{
                font-size: 16px;
            }
        }
    }
</style>
