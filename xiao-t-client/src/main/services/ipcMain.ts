import { ipcMain, dialog, BrowserWindow } from 'electron'
import Server from '../server'
import { winURL } from '../config/StaticPath'
import { updater } from './HotUpdater'
import config from '@config/index'

export default {
  Mainfunc(mainWindow: BrowserWindow, IsUseSysTitle: Boolean) {
    ipcMain.handle('IsUseSysTitle', async () => {
      return IsUseSysTitle
    })
    ipcMain.handle('windows-mini', () => {
      mainWindow.minimize()
    })
    ipcMain.handle('window-max', async () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore()
        return { status: false }
      } else {
        mainWindow.maximize()
        return { status: true }
      }
    })
    ipcMain.handle('window-close', () => {
      mainWindow.close()
    })
    ipcMain.handle('open-messagebox', async (event, arg) => {
      const res = await dialog.showMessageBox(mainWindow, {
        type: arg.type || 'info',
        title: arg.title || '',
        buttons: arg.buttons || [],
        message: arg.message || '',
        noLink: arg.noLink || true
      })
      return res
    })
    ipcMain.handle('open-errorbox', (event, arg) => {
      dialog.showErrorBox(
          arg.title,
          arg.message
      )
    })
    ipcMain.handle('start-server', async () => {
      try {
        const serveStatus = await Server.StatrServer()
        console.log(serveStatus)
        return serveStatus
      } catch (error) {
        dialog.showErrorBox(
            '错误',
            error
        )
      }
    })
    ipcMain.handle('stop-server', async (event, arg) => {
      try {
        const serveStatus = await Server.StopServer()
        return serveStatus
      } catch (error) {
        dialog.showErrorBox(
            '错误',
            error
        )
      }
    })
    ipcMain.handle('hot-update', (event, arg) => {
      updater(mainWindow)
    })
    ipcMain.handle('open-win', (event, arg) => {
      let x,y;

      const currentWindow = BrowserWindow.getFocusedWindow();//获取当前活动的浏览器窗口。
      if(currentWindow) { //如果上一步中有活动窗口，则根据当前活动窗口的右下方设置下一个窗口的坐标
        const [ currentWindowX, currentWindowY ] = currentWindow.getPosition();
        x = currentWindowX + 10;
        y = currentWindowY +10;
      }


      const ChildWin = new BrowserWindow({
        x,
        y,
        show: false,
        height: 600,
        // resizable : false,
        useContentSize: true,
        width: 800,
        frame:false,
        // frame: config.IsUseSysTitle,
        title: '小T插件',
        webPreferences: {
          contextIsolation: false, // 关闭上下文隔离 开启后渲染进程无法访问electron实例
          enableRemoteModule: true, // 让 renderer 进程使用 remote 模块
          webviewTag: true,// 允许使用 webview 标签
          nodeIntegration: true,// 允许在网页中使用 node
          webSecurity: false, // 发起了一些跨域请求，webSecurity 可以设置成 false
          // 如果是开发模式可以使用devTools
          devTools: process.env.NODE_ENV === 'development' ? true : !config.build.DisableF12, // 跟随禁用f12的配置
          // 在macos中启用橡皮动画
          scrollBounce: process.platform === 'darwin'
        }
      })
      if (process.env.NODE_ENV === 'development' ? true : !config.build.DisableF12) {
        ChildWin.webContents.openDevTools({mode: 'undocked', activate: true})
      }
      ChildWin.loadURL(winURL + `#${arg.url}`)
      ChildWin.webContents.once('dom-ready', () => {
        ChildWin.show()
        ChildWin.on('close', () => {
          console.log('close')
        })
        ChildWin.webContents.send('send-data', arg.sendData)
        if (arg.IsPay) {
          // 检查支付时候自动关闭小窗口
          const testUrl = setInterval(() => {
            const Url = ChildWin.webContents.getURL()
            if (Url.includes(arg.PayUrl)) {
              ChildWin.close()
            }
          }, 1200)
          ChildWin.on('close', () => {
            console.log('close')
            clearInterval(testUrl)
          })
        }
      })
    })
  }
}
