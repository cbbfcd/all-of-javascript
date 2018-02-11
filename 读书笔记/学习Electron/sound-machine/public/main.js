/*
* @Author: huangteng
* @Date:   2018-02-10 16:46:59
* @Last Modified by:   huangteng
* @Last Modified time: 2018-02-10 18:04:43
* @Description: ''
*/
const {app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, dialog} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const isDev = require('electron-is-dev');

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win
let trayIcon

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({width: 368, height: 700, resizable: false, frame: false})
  //win = new BrowserWindow({width: 368, height: 700});
  
  // 然后加载应用的 index.html。
  win.loadURL( isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, '../build/index.html')}`);
  

  // 打开开发者工具。
  //win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

  // 注册全局快捷键
  setGlobalShortcuts();
}

// 注册or取消全局快捷键
// 注册应该在ready之后。
const globalShort = {
  register: ( str, cb )=>{
    const ret = globalShortcut.register(str, cb);
    if(!ret){
      console.log('registration failed');
    }
  },
  unregister: ( str )=>{
    globalShortcut.unregister(str); 
    if(globalShortcut.isRegistered(str)){
      console.log('unregistration failed');
    }
  },
  unregisterAll: ()=>{
    globalShortcut.unregisterAll(); // 清除所有的快捷键
  }
}

// 基于本地配置文件重写设置全局快捷键的方法
const setGlobalShortcuts = () => {
  globalShort.unregisterAll(); // 先清除一次
  let file = JSON.parse(fs.readFileSync('./setting.json', 'utf-8'));
  let pre = file.data.length === 0 ? '' : file.data.join('+')+'+';
  // 获取存在本地的配置
  globalShort.register(pre + '1', () => {
    win.webContents.send('global-short', 0);
  });

  globalShort.register(pre + '2', () => {
    win.webContents.send('global-short', 1);
  });
  // 显示作者信息
  globalShort.register(pre + '3', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'sound-machine made by 波比小金刚',
      message: 'a simple demo for electron+react',
      detail: 'inspired by http://get.ftqq.com/7870.get'
    })
  });
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

app.on('will-quit', () => {
  globalShort.unregisterAll();
})

// 主进程订阅close-main-window事件
// ipcMain.on('close-main-window', () => {
//   app.quit()
// })

// 订阅快捷键改变事件
ipcMain.on('shortcuts-changed', () => {
  setGlobalShortcuts();
})

// 托盘菜单
// ipcMain.on('put-in-tray', () => {
//   let icoPath = process.env.platform === 'darwin' ? path.join(__dirname + './tray-iconTemplate.png') : path.join(__dirname + './tray-icon-alt.png');
//   trayIcon = new Tray(icoPath);
//   let trayMenuTemplate  = [
//    {
//      label: 'sound-machine',
//      enable: false
//    },
//    {
//      label: 'Setting',
//      click: () => {
//        window.history.location = 'http:localhost:3000/set'
//      }
//    },
//    {
//      label: 'Quit',
//      click: () => {
//        app.quit();
//      }
//    }
//   ];
//   const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
//   trayIcon.setContextMenu(trayMenu);
// })

