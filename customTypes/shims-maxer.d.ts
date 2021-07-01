import {Maxer} from "@renderer/store/maxer.mixin";

/**
 * @Created By zhaozc
 * @date 2021/5/28
 * @Description:
 */
// 声明全局组件 防止需要this调用时不能识别类型
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $m: Maxer;  // 声明全局方法
    }
}
