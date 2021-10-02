import Danmaku from "danmaku";

class CustomDanmaku {
  constructor(app) {
    this.app = app;
    this.danmaku = new Danmaku({
      container: app,
      engine: "DOM",
    });
  }

  init() {
    this.danmaku.show();
  }

  emit(text, size, color) {
    this.danmaku.emit({
      text,
      style: {
        fontSize: `${size}px`,
        fontWeight: "bold",
        color,
        textShadow:
          "#000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px",
      },
    });
  }

  show() {
    this.app.style.marginTop = 0;
  }

  hide() {
    this.app.style.marginTop = "100%";
  }
}

export default CustomDanmaku;
