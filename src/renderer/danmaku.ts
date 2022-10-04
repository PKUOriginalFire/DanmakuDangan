import { Danmaku } from '../common/types'
import DanmakuEngine from 'danmaku'

/**
 * 自定义弹幕类。
 */
class CustomDanmakuEngine {
  app: HTMLElement
  danmaku: DanmakuEngine
  constructor(app: HTMLElement) {
    this.app = app
    this.danmaku = new DanmakuEngine({
      container: app,
      engine: 'dom'
    })
    this.danmaku.show()
  }

  emit({ text, size, color }: Danmaku): void {
    this.danmaku.emit({
      text,
      style: {
        fontSize: `${size}px`,
        fontWeight: 'bold',
        color,
        textShadow: '#000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px'
      }
    })
  }

  show(): void {
    this.app.style.marginTop = '0'
  }

  hide(): void {
    this.app.style.marginTop = '100%'
  }

  resize(): void {
    this.danmaku.resize()
  }

  setSpeed(speed: number): void {
    this.danmaku.speed = speed
  }
}

export default CustomDanmakuEngine
