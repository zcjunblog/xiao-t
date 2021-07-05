/**
 * @创建: zhaozc
 * @时间: 2021/5/27
 * @说明: Vue 全局混入
 */
import {mapState} from "vuex";
import store from "./index"
import {App, getCurrentInstance} from 'vue'

// 将定义的state变量key全部加载到全局变量中
const $mStoreKey = store.state ? Object.keys(store.state) : [];
export class MaxVuex{
    vuex = (name: string, value: any): void=>{
        store.commit('$changeStore', {
            name, value
        })
    }
}

// 大型项目不推荐这种方式 QAQ
export default<T> (app: App<T>) => {
    // 进行全局混入
    // 将vuex方法挂载到$m中
    /* 使用方法为：
    1.如果要修改vuex的state中的"vuex_xxx"变量为"x" => this.$m.vuex('vuex_xxx','x')
    2.在composition-api中使用:
    写:
    import { getCurrentInstance } from 'vue'
    const { proxy }: any = getCurrentInstance()
    const { $m } = getCurrentInstance().appContext.config.globalProperties
    $m.vuex('vuex_xxx','x')
    读:
    页面上无需任务引入直接{{ vuex_xxx }}即可
    js中引入useStore读取
    import { useStore } from 'vuex'
    const store = useStore()
    store.state.vuex_xxx
    */
    app.config.globalProperties.$m = new MaxVuex();
    app.mixin({
        computed: {
            // 将vuex的state中的所有变量，解构到全局混入的mixin中
            ...mapState($mStoreKey)
        }
    })
}
