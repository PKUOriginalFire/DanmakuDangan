import * as logger from 'electron-log'
import * as path from 'path'

import { BrowserWindow, app, ipcMain } from 'electron'
import getConfigStore, { defaultConfig } from './config'
import { is, optimizer } from '@electron-toolkit/utils'

import type { Config } from '../common/types'
import initServer from './server'
import initTray from './tray'

/**
 * 创建窗口。
 */
function createWindow(): BrowserWindow {
  // 浏览器窗口
  const mainWindow = new BrowserWindow({
    resizable: false,
    transparent: true,
    frame: false,
    fullscreen: true,
    simpleFullscreen: true,
    focusable: false,
    skipTaskbar: true, // 全屏透明
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  // 显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // 点击穿透
  mainWindow.setIgnoreMouseEvents(true, { forward: true })

  // 置顶
  mainWindow.setAlwaysOnTop(true, 'screen-saver') // 到置顶最高等级
  const timer = setInterval(() => {
    mainWindow.moveTop() // 强行置顶
  }, 1000)

  const loadConfig = (config: Config = defaultConfig): void => {
    // 日志输出设置
    logger.transports.console.level = config.log.console.level
    logger.transports.console.format = config.log.console.format
    logger.transports.file.level = config.log.file.level
    logger.transports.file.format = config.log.file.format
    mainWindow.webContents.send('setup', config)
  }

  // 初始化页面
  ipcMain.on('ready', () => {
    // 初始化配置
    const config = getConfigStore(true)
    loadConfig(config.store)
    config.onDidAnyChange(loadConfig)

    // 发送初始化弹幕
    mainWindow.webContents.send('about')
  })

  // 关闭窗口
  mainWindow.on('closed', () => {
    clearInterval(timer)
  })

  return mainWindow
}

app.whenReady().then(() => {
  // 配置文件
  const config = getConfigStore()

  // 开发者工具与禁用刷新
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  let mainWindow = createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow()
  })

  // WebSocket 服务
  const server = initServer(config, (danmaku) => {
    mainWindow.webContents.send('emit', danmaku)
  })

  // 托盘
  const tray = initTray(config, (channel) => {
    mainWindow.webContents.send(channel)
  })

  app.on('quit', () => {
    server.close()
    tray.destroy()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

logger.catchErrors()
