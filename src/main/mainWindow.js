import { BrowserWindow } from "electron";
import config from "../common/config.js";
import * as path from "path";
import initServer from "../common/server.js";
import initwsServer from "../common/wss.js";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow(isDevelopment) {
  const window = new BrowserWindow({
    resizable: false,
    transparent: true,
    frame: false,
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: !config.debug,
    skipTaskbar: true, // 全屏透明
    webPreferences: {
      devTools: config.debug,
      nodeIntegration: true,
      defaultEncoding: "utf-8",
    },
  });

  if (isDevelopment && config.debug) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadFile(path.join(__dirname, "index.html"));
  }

  window.setIgnoreMouseEvents(!config.debug);

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  window.webContents.on("did-finish-load", () => {
    window.webContents.send("init", config);
  });

  // 启动服务器
  initServer((channel, ...args) => window.webContents.send(channel, ...args));

  initwsServer((channel, ...args) => window.webContents.send(channel, ...args));

  mainWindow = window;
}

export default createMainWindow;
export { mainWindow };
