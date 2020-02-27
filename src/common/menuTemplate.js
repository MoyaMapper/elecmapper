// Electron默认菜单
// https://github.com/carter-thaxton/electron-default-menu/blob/master/index.js
const { app, shell, ipcMain } = require('electron')
const constants = require('./constants')

const template = [
  {
    label: '文件',
    submenu: [
      {
        label: '导出',
        accelerator: 'CmdOrCtrl+E',
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send('export-file')
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  {
    label: '视图',
    submenu: [
      {
        label: '刷新当前页面',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: '切换全屏幕',
        accelerator: (function () {
          if (process.platform === 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: '切换开发者工具',
        accelerator: (function () {
          if (process.platform === 'darwin')
            return 'Alt+Command+I';
          else
            return 'Ctrl+Shift+I';
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      },
    ]
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
    ]
  },
  {
    label: '关于',
    submenu: [
      {
        label: `主页: ${constants.appName}`,
        click: function () { shell.openExternal(constants.homepage) }
      },
      {
        label: `组织: ${constants.organization}`,
        click: function () { shell.openExternal(constants.organizationUrl) }
      },
      {
        label: `作者: ${constants.author}`,
        click: function () { shell.openExternal(constants.authorUrl) }
      }, {
        type: 'separator'
      }, {
        label: `版本: ${app.getVersion()}`
      }
    ]
  },
]

// MacOS专有菜单
if (process.platform === 'darwin') {
  const name = constants.appName
  template.unshift({
    label: name,
    submenu: [{
      label: '服务',
      role: 'services',
      submenu: []
    }, {
      label: `隐藏 ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: '隐藏其它',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: '显示全部',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: '退出',
      accelerator: 'Command+Q',
      click: function () { app.quit(); }
    },]
  })
} else {
  template[0].submenu.push({
    label: '设置',
    accelerator: 'Ctrl+,',
    click: (menuItem, browserWindow, event) => {
      ipcMain.emit('open-settings-window')
    }
  })
}

module.exports = template