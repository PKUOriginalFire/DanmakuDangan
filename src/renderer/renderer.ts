import type { Config } from '../common/types'
import DanmakuEngine from './danmaku'

window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')!
  const danmakuEngine = new DanmakuEngine(app)

  const api = window.api
  const logger = api.logger

  // 加载配置
  api.onSetup((config: Config) => {
    logger.debug('加载设置：', config)
    const setMargin = ({ left, top, right, bottom }: Config['margin']): void => {
      app.style.left = left
      app.style.top = top
      app.style.right = right
      app.style.bottom = bottom
    }
    setMargin(config.margin)
    app.style.opacity = config.danmaku.opacity.toString()
    danmakuEngine.setSpeed(config.danmaku.speed)
    danmakuEngine.resize()
  })

  // 注册事件
  api.onEmit((danmaku) => {
    logger.debug('发送弹幕：', danmaku)
    danmakuEngine.emit(danmaku)
  })

  api.onShow(danmakuEngine.show)
  api.onHide(danmakuEngine.hide)
  api.onAbout(() => {
    danmakuEngine.emit({
      text: `~~元火动漫社弹幕姬v${api.version}desu~~`,
      size: 40,
      color: 'hsl(360, 100%, 90%)'
    })
  })

  logger.info('弹幕姬启动成功~')
  api.done()
})
