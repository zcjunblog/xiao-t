import {MaxVuex} from "@renderer/store/maxVuex.mixin";

/**
 * @Created By zhaozc
 * @date 2021/5/28
 * @Description:
 */
// 声明全局组件 防止需要this调用时不能识别类型
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $m: MaxVuex;  // 声明全局方法
    }
}
