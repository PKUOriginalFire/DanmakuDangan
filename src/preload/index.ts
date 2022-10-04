import * as logger from 'electron-log'

import type { Config, Danmaku } from '../common/types'
import { contextBridge, ipcRenderer } from 'electron'

try {
  // 进程间通信
  contextBridge.exposeInMainWorld('api', {
    onSetup(callback: (data: Config) => void) {
      ipcRenderer.on('setup', (_, config) => callback(config))
    },
    onEmit(callback: (data: Danmaku) => void) {
      ipcRenderer.on('emit', (_, dammaku) => callback(dammaku))
    },
    onShow(callback: () => void) {
      ipcRenderer.on('show', callback)
    },
    onHide(callback: () => void) {
      ipcRenderer.on('hide', callback)
    },
    onAbout(callback: () => void) {
      ipcRenderer.on('about', callback)
    },
    version: require('../../package.json').version,
    logger,
    done() {
      ipcRenderer.send('ready')
    }
  })
} catch (error) {
  console.error(error)
}
