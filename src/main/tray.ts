import * as logger from 'electron-log'
import * as path from 'path'

import { Menu, Tray, app, shell } from 'electron'

import { ConfigStore } from './config'

export default function initTray(config: ConfigStore, send: (channel: string) => void): Tray {
  const tray = new Tray(path.join(__dirname, '../../public/logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      type: 'checkbox',
      checked: true,
      click: (item) => (item.checked ? send('show') : send('hide'))
    },
    { type: 'separator' },
    {
      label: '打开配置文件',
      type: 'normal',
      click: () => shell.openPath(config.path)
    },
    {
      label: '打开日志目录',
      type: 'normal',
      click: () => shell.showItemInFolder(logger.transports.file.getFile().path)
    },
    { type: 'separator' },
    {
      label: '关于',
      type: 'normal',
      click: () => send('about')
    },
    {
      label: '重启',
      type: 'normal',
      click: (): void => {
        app.relaunch()
        app.quit()
      }
    },
    { label: '退出', type: 'normal', role: 'quit' }
  ])
  tray.setToolTip('元火弹幕姬')
  tray.setContextMenu(contextMenu)
  return tray
}
