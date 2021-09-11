/**
 * @Created By zhaozc
 * @date 2021/7/7
 * @Description:
 */
const compressing = require('compressing');

const download = require('git-repo-down-for-vite')
const { shell} = require('electron')
const fs = require("fs");
const path = require("path");

// git克隆
export function gitClone(remote: string, name: string, option: object): Promise<boolean> {
    return new Promise((resolve, reject) => download(remote, name, option, (err: Error) => (err ? reject(err) : resolve(true))));
}

// 浏览器打开源码仓库
export const openBrowser = (url: string) => {
    shell.openExternal(url);
};

/**
 *
 * @param {*} url  网络文件url地址
 * @param {*} fileName 	文件名
 * @param {*} dir 下载到的目录
 */
export function getPluginFileByUrl(url,fileName,dir){
    console.log('------------------------------------------------')
    console.log(url)
    console.log(fileName)
    console.log(dir)
    return new Promise<void>(resolve => {
        if (!fs.existsSync(dir)){ // 目录不存在 反手创建一个
            fs.mkdirSync(dir)
        }
        let filePath = path.join(dir, fileName)
        let stream = fs.createWriteStream(filePath);
        // uncompress a stream
        console.log('filePath',filePath)
        // compressing.tgz.uncompress(stream, dir.replace(/\_download/,''))
        compressing.zip.uncompress(filePath, dir.replace(/\_download/,''))
            .then(()=> console.log('解压完成'))
            .catch((e)=>{
                console.log(e)
                console.log('解压出错')
            });
        resolve()
    })
}
