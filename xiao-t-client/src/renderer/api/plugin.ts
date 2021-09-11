import request from "@renderer/utils/request";

/**
 * @Created By zhaozc
 * @date 2021/8/10
 * @Description:
 */
export function getPluginList() {
    return request({
        url: '/app/client/plugin/list',
        method: 'post'
    })
}
