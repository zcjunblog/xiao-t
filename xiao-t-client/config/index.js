module.exports = {
  build: {
    DisableF12: true, // 此配置已升级为禁用devtool 而非 单纯禁用f12
    env: require('./prod.env'),
    hotPublishUrl:"",
    hotPublishConfigName: ""
  },
  dev: {
    env: require('./dev.env'),
    removeElectronJunk: true,
    chineseLog: false,
    port: 9080,
  },
  DllFolder: '',
  HotUpdateFolder: 'update',
  UseStartupChart: false, // 启动动画
  IsUseSysTitle: false, // 使用系统顶部栏
  BuiltInServerPort: 25565
}
