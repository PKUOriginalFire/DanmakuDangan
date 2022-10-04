import type { Config } from '../common/types'
import Store from 'conf'
import yaml from 'js-yaml'

// 默认配置
export const defaultConfig: Config = {
  // 服务端地址
  server: {
    port: 3456,
    host: 'localhost'
  },
  // 调试模式
  debug: false,
  // 日志格式
  log: {
    console: {
      level: 'warn',
      format: '[{h}:{i}:{s}.{ms}] [{level}] {text}'
    },
    file: {
      level: 'info',
      format: '[{h}:{i}:{s}.{ms}] [{level}] {text}'
    }
  },
  // 外边距
  margin: {
    left: '0',
    right: '0',
    top: '0',
    bottom: '0'
  },
  // 弹幕属性
  danmaku: {
    speed: 144,
    opacity: 0.8,
    defaultSize: 25,
    defaultColor: '#fff'
  }
}

export default function getConfigStore(watch = false): Store<Config> {
  return new Store<Config>({
    defaults: defaultConfig,
    fileExtension: 'yaml',
    serialize: yaml.dump,
    deserialize: yaml.load as never,
    watch
  })
}

export type ConfigStore = Store<Config>
