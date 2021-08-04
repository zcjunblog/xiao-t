/**
 * @Created By zhaozc
 * @date 2021/7/12
 * @Description:
 */
const {getData, getlocalDataFile, saveData} = require("./utils");
const marked = require("marked");
const rendererMD = new marked.Renderer();
const path = require('path');
const os = require('os');

const appPath = path.join(getlocalDataFile());
const dbPath = path.join(appPath, './db.json');

function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="font-size: 14px;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 130px;text-align: center;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

const filePath = location.pathname.replace('file://', '').substr(1);
const {ipcRenderer, nativeImage, clipboard, remote, shell} = require('electron');

const currentWindow = remote.getCurrentWindow();
const winId = currentWindow.id;
const BrowserWindow = remote.BrowserWindow;

function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

window.utools = window.xiao_t = {
    // 事件
    onPluginEnter(cb) {
        ipcRenderer.once('onPluginEnter', (e, message) => {
            const info = JSON.parse(message)
            cb({...info, type: 'text'})
        })
    },
    onPluginReady(cb) {
        ipcRenderer.once('', (e, message) => {
            const info = JSON.parse(message)
            cb({...info, type: 'text'})
        })
    },
    outPlugin(cb) {
        ipcRenderer.once('onPluginOut', (e, message) => {
            const info = JSON.parse(message)
            cb({...info, type: 'text'})
        })
    },
    onDbPull(cb) {
        ipcRenderer.once('onPluginOut', (e, message) => {
            const info = JSON.parse(message)
            cb({...info, type: 'text'})
        })
    },
    onPluginOut(cb) {
        ipcRenderer.once('onPluginOut', (e, message) => {
            const info = JSON.parse(message)
            cb({...info, type: 'text'})
        })
    },

    // 窗口交互
    hideMainWindow() {

    },
    showMainWindow() {

    },
    setExpendHeight(height) {

    },
    setSubInput(onChange, placeHolder, isFocus) {
        ipcRenderer.sendToHost('setSubInput', {
            placeHolder, isFocus
        });
        ipcRenderer.on(`msg-back-setSubInput`, (e, result) => {
            onChange({text: result});
        });
    },

    removeSubInput() {

    },

    setSubInputValue(text) {
        // console.log('text',text)
        ipcRenderer.sendToHost('setSubInputValue', {
            text
        });
    },

    getPath(name) {
        ipcRenderer.send('msg-trigger', {
            type: 'getPath',
            name,
        });
        return new Promise((resolve, reject) => {
            ipcRenderer.on(`msg-back-getPath`, (e, result) => {
                console.log(result)
                result ? resolve(result) : reject();
            });
        })
    },

    showNotification(body) {
        // return new Notification('小T 提示', {
        //     body
        // });
        Toast(body,1000);
    },
    showOpenDialog(options) {
        ipcRenderer.send('msg-trigger', {
            type: 'showOpenDialog',
            options: {...options},
        });
        return new Promise((resolve, reject) => {
            ipcRenderer.once(`msg-back-showOpenDialog`, (e, result) => {
                result ? resolve(result) : reject();
            });
        })
    },
    copyImage(img) {
        convertImgToBase64(img,(base64Image)=> {
            const image = nativeImage.createFromDataURL(base64Image)
            clipboard.writeImage(image)
            Toast('图片复制成功',1000);
        })
    },
    copyText(text) {
        clipboard.writeText(text);
    },
    db: {
        put(data) {
            data._rev = '';
            let dbData = getData(dbPath) || [];
            let target = [];
            dbData.some((d, i) => {
                if (d._id === data._id) {
                    target = [d, i]
                    return true;
                }
                return false;
            });

            // 更新
            if (target[0]) {
                dbData[target[1]] = data;
            } else {
                dbData.push(data);
            }
            saveData(dbPath, dbData);
            return {
                id: data._id,
                ok: true,
                rev: '',
            }
        },
        get(key) {
            const dbData = getData(dbPath) || [];
            return dbData.find(d => d._id === key) || '';
        },
        remove(key) {
            key = typeof key === 'object' ? key._id : key;
            let dbData = getData(dbPath);
            let find = false;
            dbData.some((d, i) => {
                if (d._id === key) {
                    dbData.splice(i, 1);
                    find = true;
                    return true;
                }
                return false;
            });
            if (find) {
                saveData(dbPath, dbData);
                return {
                    id: key,
                    ok: true,
                    rev: '',
                }
            } else {
                return {
                    id: key,
                    ok: false,
                    rev: '',
                }
            }
        },
        bulkDocs(docs) {
            const dbData = getData(dbPath);
            dbData.forEach((d, i) => {
                const result = docs.find(data => data._id === d._id);
                if (result) {
                    dbData[i] = result;
                }
            });
            saveData(dbPath, dbData);
            return docs.map(d => ({
                id: d._id,
                success: true,
                rev: '',
            }))
        },
        allDocs(key) {
            const dbData = getData(dbPath);
            if (!key) {
                return dbData;
            }
            if (typeof key === 'string') {
                return dbData.filter(d => d._id.indexOf(key) >= 0);
            }
            if (Array.isArray(key)) {
                return dbData.filter(d => key.indexOf(d._id) >= 0);
            }
            return [];
        }
    },
    isDarkColors() {
        return false;
    },
    getFeatures() {
        ipcRenderer.sendToHost('getFeatures');
        return new Promise(resolve => {
            ipcRenderer.on(`msg-back-getFeatures`, (e, result) => {
                resolve(result);
            });
        });
    },
    setFeature(feature) {
        ipcRenderer.sendToHost('setFeature', {feature});
    },
    ubrowser: {
        winId: '',
        async goto(md, opts) {
            const objExp = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
            let winId;
            let win;
            win = new BrowserWindow({
                show: false,
                title: typeof opts === 'object' ? '' : opts,
                webPreferences: {
                    webSecurity: false,
                    enableRemoteModule: true,
                    backgroundThrottling: false,
                    webviewTag: true,
                    nodeIntegration: true // 在网页中集成Node
                }
            });
            if (objExp.test(md) && md.indexOf('http') === 0) {
                await win.loadURL(md);
                winId = win.id;
            } else {
                marked.setOptions({
                    renderer: rendererMD,
                    gfm: true,
                    tables: true,
                    breaks: false,
                    pedantic: false,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false
                });
                const htmlContent = marked(md);
                win.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent))
                win.once('ready-to-show', () => win.show());
                winId = win.id;
            }
            return {
                value(selector, value) {
                    ipcRenderer.send('msg-trigger', {
                        type: 'ubrowser.value',
                        winId,
                        selector, value
                    });
                    return new Promise(resolve => {
                        ipcRenderer.once(`msg-back-ubrowser.value`, (e, result) => {
                            resolve(this)
                        });
                    })
                },
                click(selector) {
                    ipcRenderer.send('msg-trigger', {
                        type: 'ubrowser.click',
                        winId,
                        selector,
                    });
                    return new Promise(resolve => {
                        ipcRenderer.once(`msg-back-ubrowser.click`, (e, result) => {
                            resolve(this)
                        });
                    })
                },
                run(options) {
                    ipcRenderer.send('msg-trigger', {
                        type: 'ubrowser.run',
                        winId,
                        ...options
                    });
                }
            }
        },
    },
    // 系统
    shellOpenExternal(url) {
        shell.openExternal(url);
    },

    isMacOs() {
        return os.type() === 'Darwin';
    },

    isWindows() {
        return os.type() === 'Windows_NT';
    },
}

try {
    require(path.join(filePath, '../', './preload.js'));
}catch (e) {
    console.log('插件无preload.js或路径错误!')
}

window.exports
