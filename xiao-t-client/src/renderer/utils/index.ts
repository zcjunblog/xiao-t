/**
 * @Created By zhaozc
 * @date 2021/7/7
 * @Description:
 */
const download = require('git-repo-down-for-vite')
const { shell} = require('electron')
// git克隆
export function gitClone(remote: string, name: string, option: object): Promise<boolean> {
    return new Promise((resolve, reject) => download(remote, name, option, (err: Error) => (err ? reject(err) : resolve(true))));
}

// 浏览器打开源码仓库
export const openBrowser = (url: string) => {
    shell.openExternal(url);
};
