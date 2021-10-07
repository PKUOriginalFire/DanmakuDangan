import { ipcRenderer } from "electron";
import CustomDanmaku from "./danmaku.js";
import { version } from "../../package.json";
import * as logger from "electron-log";

const styles = document.createElement("style");
styles.innerText = `html,body{height:100%;}body{margin:0;background:#ffffff00;overflow:hidden;}`;
document.head.appendChild(styles);

window.addEventListener("load", () => {
  const app = document.getElementById("app");
  app.style.height = "100%";

  ipcRenderer.on("init", (event, config) => {
    logger.info("init", config);
    logger.info(config.danmaku.opacity.toString());
    app.style.opacity = config.danmaku.opacity.toString();
  });

  const danmaku = new CustomDanmaku(app);

  danmaku.init();

  ipcRenderer.on("danmaku", (event, message) => {
    const { text, size, color } = message;
    logger.info(message);
    danmaku.emit(text, size, color);
  });

  ipcRenderer.on("show", () => danmaku.show());
  ipcRenderer.on("hide", () => danmaku.hide());

  ipcRenderer.on("about", () =>
    danmaku.emit(
      `~~北京大学元火动漫社弹幕姬v${version}~~`,
      40,
      "hsl(360, 100%, 90%)"
    )
  );
});
