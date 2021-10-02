import { app, Menu, Tray, shell } from "electron";
import * as path from "path";
import { mainWindow } from "./mainWindow.js";
import * as logger from "electron-log";

let tray;
app.whenReady().then(() => {
  tray = new Tray(path.join(__static, "logo.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示",
      type: "checkbox",
      checked: true,
      click: (item) =>
        item.checked
          ? mainWindow.webContents.send("show")
          : mainWindow.webContents.send("hide"),
    },
    { type: "separator" },
    {
      label: "打开配置文件",
      type: "normal",
      click: () =>
        shell.openItem(
          path.resolve(path.join(app.getPath("userData"), "config.yaml"))
        ),
    },
    {
      label: "打开日志目录",
      type: "normal",
      click: () =>
        shell.showItemInFolder(logger.transports.file.getFile().path),
    },
    { type: "separator" },
    {
      label: "关于",
      type: "normal",
      click: () => mainWindow.webContents.send("about"),
    },
    { label: "退出", type: "normal", role: "quit" },
  ]);
  tray.setToolTip("元火弹幕姬");
  tray.setContextMenu(contextMenu);
});
