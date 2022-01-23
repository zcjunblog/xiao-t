import request from "@renderer/utils/request";

/**
 * @Created By zhaozc
 * @date 2021/8/9
 * @Description:
 */

export function getCliTemplateList() {
    return request({
        url: '/app/client/cli/list',
        method: 'post'
    })
}
