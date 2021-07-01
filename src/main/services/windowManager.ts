import setIpc from './ipcMain'
import config from '@config/index'
import menuconfig from '../config/menu'
import DownloadUpdate from './downloadFile'
import Update from './checkupdate';
import { app, BrowserWindow, Menu, Tray, dialog } from 'electron'
import { winURL, loadingURL, logoURL } from '../config/StaticPath'

class MainInit {

  public winURL: string = ''
  public shartURL: string = ''
  public appTray: any = null
  public loadWindow: BrowserWindow = null
  public mainWindow: BrowserWindow = null

  constructor() {
    this.winURL = winURL
    this.shartURL = loadingURL
    if (process.env.NODE_ENV === 'development' ? true : !config.build.DisableF12) {
      menuconfig.push({
        label: '开发者设置',
        submenu: [{
          label: '切换到开发者模式',
          accelerator: 'CmdOrCtrl+I',
          role: 'toggledevtools'
        }]
      })
    }
  }
  // PC端
  // 按屏幕宽度大小排序
  // 分辨率   比例 | 设备尺寸
  // 1024*500 （8.9寸）
  // 1024*768 （比例4：3  | 10.4寸、12.1寸、14.1寸、15寸; ）
  // 1280*800（16：10  |15.4寸）
  // 1280*1024(比例：5：4  | 14.1寸、15.0寸)
  // 1280*854(比例：15：10 | 15.2）
  // 1366*768 (比例：16：9 | 不常见）
  // 1440*900 （16：10  17寸 仅苹果用）
  // 1440*1050（比例：5：4  | 14.1寸、15.0寸）
  // 1600*1024（14：9  不常见）
  // 1600*1200 （4：3 | 15、16.1）
  // 1680*1050（16：10 | 15.4寸、20.0寸）
  // 1920*1200 (23寸）
  // 主窗口函数
  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      height: 854,
      useContentSize: true,
      width: 1280,
      minWidth: 1280,
      minHeight: 854,
      show: false,
      frame: config.IsUseSysTitle,
      titleBarStyle: 'hidden',
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        // 如果是开发模式可以使用devTools
        // devTools: process.env.NODE_ENV === 'development',
        devTools: process.env.NODE_ENV === 'development' ? true : !config.build.DisableF12, // 跟随禁用f12的配置
        // 在macos中启用橡皮动画
        scrollBounce: process.platform === 'darwin'
      }
    })
    // 赋予模板
    const menu = Menu.buildFromTemplate(menuconfig as any)
    // 加载模板
    Menu.setApplicationMenu(menu)
    // 加载主窗口
    this.mainWindow.loadURL(this.winURL)
    // TODO: 暂时不使用electron提供的更新方案
    // 下载文件
    // new DownloadUpdate(this.mainWindow).start()
    // electron-update注册
    // new Update(this.mainWindow)
    // 启用协议，这里暂时只用于自定义头部的时候使用
    setIpc.Mainfunc(this.mainWindow, config.IsUseSysTitle)
    // dom-ready之后显示界面
    this.mainWindow.webContents.once('dom-ready', () => {
      this.mainWindow.show()
      if (config.UseStartupChart) this.loadWindow.destroy()
    })
    // this.mainWindow.webContents.openDevTools({ mode: 'undocked', activate: true })
    // 开发模式下自动开启devtools
    if (process.env.NODE_ENV === 'development' ? true : !config.build.DisableF12) {
      this.mainWindow.webContents.openDevTools({ mode: 'undocked', activate: true })
    }
    // 当确定渲染进程卡死时，分类型进行告警操作
    app.on('render-process-gone', (event, webContents, details) => {
      const message = {
        title: "",
        buttons: [],
        message: '',
      }
      switch (details.reason) {
        case 'crashed':
          message.title = "警告"
          message.buttons = ['确定', '退出']
          message.message = "图形化进程崩溃，是否进行软重启操作？"
          break;
        case 'killed':
          message.title = "警告"
          message.buttons = ['确定', '退出']
          message.message = "由于未知原因导致图形化进程被终止，是否进行软重启操作？"
          break;
        case 'oom':
          message.title = "警告"
          message.buttons = ['确定', '退出']
          message.message = "内存不足，是否软重启释放内存？"
          break;

        default:
          break;
      }
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: message.title,
        buttons: message.buttons,
        message: message.message,
        noLink: true
      }).then(res => {
        if (res.response === 0) this.mainWindow.reload()
        else this.mainWindow.close()
      })
    })
    // 不知道什么原因，反正就是这个窗口里的页面触发了假死时执行
    this.mainWindow.on('unresponsive', () => {
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: '警告',
        buttons: ['重载', '退出'],
        message: '图形化进程失去响应，是否等待其恢复？',
        noLink: true
      }).then(res => {
        if (res.response === 0) this.mainWindow.reload()
        else this.mainWindow.close()
      })
    })
    /**
     * 新的gpu崩溃检测，详细参数详见：http://www.electronjs.org/docs/api/app
     * @returns {void}
     * @author zmr (umbrella22)
     * @date 2020-11-27
     */
    app.on('child-process-gone', (event, details) => {
      const message = {
        title: "",
        buttons: [],
        message: '',
      }
      switch (details.type) {
        case 'GPU':
          switch (details.reason) {
            case 'crashed':
              message.title = "警告";
              message.buttons = ['确定', '退出'];
              message.message = "硬件加速进程已崩溃，是否关闭硬件加速并重启？";
              break;
            case 'killed':
              message.title = "警告";
              message.buttons = ['确定', '退出'];
              message.message = "硬件加速进程被意外终止，是否关闭硬件加速并重启？";
              break;
            default:
              break;
          }
          break;

        default:
          break;
      }
      dialog.showMessageBox(this.mainWindow, {
        type: 'warning',
        title: message.title,
        buttons: message.buttons,
        message: message.message,
        noLink: true
      }).then(res => {
        // 当显卡出现崩溃现象时使用该设置禁用显卡加速模式。
        if (res.response === 0) {
          if (details.type === 'GPU') app.disableHardwareAcceleration();
          this.mainWindow.reload()
        } else {
          this.mainWindow.close()
        }
      })
    })

    // 创建托盘图标
    this.mainWindow.hide();
    // 当前目录下的app.ico图标
    this.appTray = new Tray(logoURL)
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate([{// 系统托盘图标目录
      label: '退出',
      click:  ()=> {
        this.mainWindow.destroy();
      }
    }])
    // 设置托盘悬浮提示
    this.appTray.setToolTip('I‘m 易齿君');
    // 设置托盘菜单
    this.appTray.setContextMenu(contextMenu);
    // 单击托盘小图标显示应用
    this.appTray.on('click', ()=>{
      // 显示主程序
      this.mainWindow.show();
      // 关闭托盘显示
      // this.appTray.destroy();
    });

    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (event) => {
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore()
          this.mainWindow.focus()
        }
      })
    }

    app.on('gpu-process-crashed', () => {

    })

    this.mainWindow.on('close', (e) => {
      e.preventDefault(); // 禁止关闭行为
      // 隐藏主窗口
      this.mainWindow.hide();

    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  // 加载窗口函数
  loadingWindow(loadingURL: string) {
    this.loadWindow = new BrowserWindow({
      width: 400,
      height: 600,
      frame: false,
      skipTaskbar: true,
      transparent: true,
      resizable: false,
      webPreferences: { experimentalFeatures: true }
    })

    this.loadWindow.loadURL(loadingURL)
    this.loadWindow.show()
    this.loadWindow.setAlwaysOnTop(true)
    // 延迟两秒可以根据情况后续调快，= =，就相当于个，sleep吧，就那种。 = =。。。
    setTimeout(() => {
      this.createMainWindow()
    }, 1500)
  }

  // 初始化窗口函数
  initWindow() {
    if (config.UseStartupChart) {
      return this.loadingWindow(this.shartURL)
    } else {
      return this.createMainWindow()
    }

  }
}
export default MainInit
