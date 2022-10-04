import * as logger from 'electron-log'
import type { Config } from '../common/types'

declare global {
  interface API {
    onSetup(callback: (data: Config) => void): void
    onEmit(callback: (data: Danmaku) => void): void
    onShow(callback: () => void): void
    onHide(callback: () => void): void
    onAbout(callback: () => void): void
    version: string
    logger: typeof logger
    done(): void
  }
  interface Window {
    api: API
  }
}
