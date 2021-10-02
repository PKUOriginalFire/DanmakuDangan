import { app } from "electron";
import "../common/config.js";
import createMainWindow from "./mainWindow.js";
import "./tray.js";

const isDevelopment = process.env.NODE_ENV !== "production";

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    createMainWindow(isDevelopment);
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  createMainWindow(isDevelopment);
});
