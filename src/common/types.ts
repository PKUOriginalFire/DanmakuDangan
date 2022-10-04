import type { LevelOption } from 'electron-log'

/**
 * 配置文件格式。
 */
export interface Config {
  // 服务端地址
  server: {
    host: string
    port: number
  }
  // 调试模式
  debug: boolean
  // 日志格式
  log: {
    console: {
      level: LevelOption
      format: string
    }
    file: {
      level: LevelOption
      format: string
    }
  }
  // 外边距
  margin: {
    left: string
    right: string
    top: string
    bottom: string
  }
  // 弹幕属性
  danmaku: {
    speed: number
    opacity: number
    defaultSize: number
    defaultColor: string
  }
}

// 弹幕数据。
export interface Danmaku {
  text: string
  size: number
  color: string
}
