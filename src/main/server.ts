import * as logger from 'electron-log'

import WebSocket, { WebSocketServer } from 'ws'

import type { ConfigStore } from './config'
import type { Danmaku } from '../common/types'

interface Client extends WebSocket {
  /// 连接状态。
  isAlive?: boolean
}

function initServer(config: ConfigStore, emit: (danmaku: Danmaku) => void): WebSocketServer {
  const { port, host } = config.get('server')
  const wss = new WebSocketServer<Client>({ port, host })

  wss.on('connection', (ws, request) => {
    ws.on('message', (message) => {
      try {
        const {
          text = '',
          size = config.get('danmaku.defaultSize', 25),
          color = config.get('danmaku.defaultColor', '#fff')
        } = JSON.parse(message.toString())
        const textTrim = text.trim()
        if (textTrim.length !== 0) {
          emit({ text: textTrim, size, color })
          logger.info('收到弹幕：', textTrim)
        }
      } catch (e) {
        logger.error(e)
      }
    })

    ws.on('pong', () => {
      ws.isAlive = true
    })

    const { remoteAddress, remotePort } = request.socket
    logger.info(`弹幕服务客户端 ${remoteAddress}:${remotePort} 连接成功。`)
    ws.on('close', () => {
      logger.info(`弹幕服务客户端 ${remoteAddress}:${remotePort} 断开连接。`)
    })
  })

  // 心跳检测
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate()
      }
      ws.isAlive = false
      ws.ping()
    })
  }, 30000)

  logger.info(`弹幕服务 Websocket 协议已运行于 ${host}:${port}`)

  return wss
}

export default initServer
