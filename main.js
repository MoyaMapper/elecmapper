const { app, BrowserWindow, Menu, dialog } = require('electron')
const menuTemplate = require('./src/common/menuTemplate')
const isDev = require('electron-is-dev')
const path = require('path')
const { autoUpdater } = require('electron-updater')

let win

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    // icon: './src/assets/logo.png', // windows/Linux有效，Mac无效
    width: 1024,
    height: 750,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  const urlLocation = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`
  win.loadURL(urlLocation) 

  // 打开开发者工具
  // win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

  // 设置菜单
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  if (isDev && process.platform === 'darwin') {
    app.dock.setIcon('./src/assets/logo.png')
  }

  // 检查更新
  checkUpdate()
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。


  // 检查更新
const checkUpdate = () => {
  if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
  }
  autoUpdater.autoDownload = false // 关闭自动下载功能
  autoUpdater.checkForUpdates() 
  // autoUpdater.checkForUpdatesAndNotify() // 打包后的程序才有用，开发环境下没用
  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknow" : (error.stack || error.message))
  })
  autoUpdater.on('checking-for-update', () => { 
    // 该回调会在 checkForUpdates 后被调用
    console.log('Checking for update...')
  })
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用有新的版本',
      message: '发现新版本，是否现在更新？',
      buttons: ['是', '否']
    }).then((result) => {
      // console.log('选择结果：', result)
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })
  autoUpdater.on('update-not-available', () => {
    // dialog.showMessageBox({
    //   title: '没有新版本',
    //   message: '当前已经是最新版本'
    // })
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond
    log_message = log_message + ' - Download' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    console.log(log_message)
  })
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      title: '安装更新',
      message: '更新下载完毕，应用将重启并进行安装'
    }).then(() => {
      // setImmediate()方法用于中断长时间运行的操作，并在浏览器完成其他操作（如事件和显示更新）后立即运行回调函数。 
      setImmediate(() => autoUpdater.quitAndInstall())
    })
  })
}