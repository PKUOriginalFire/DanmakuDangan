import { app } from "electron";
import { promises as fs } from "fs";
import * as path from "path";
import YAML from "yaml";
import * as logger from "electron-log";

let config = {
  server: {
    port: 3000,
    host: "localhost",
  },
	ws: {
    port: 3456,
    host: "localhost",
	},
  debug: false,
  log: {
    console: {
      level: "warn",
      format: "[{h}:{i}:{s}.{ms}] [{level}] {text}",
    },
    file: {
      level: "info",
      format: "[{h}:{i}:{s}.{ms}] [{level}] {text}",
    },
  },
  danmaku: {
    defaultSize: 25,
    defaultColor: "#fff",
  },
};

fs.readFile(path.join(app.getPath("userData"), "config.yaml"), "utf8")
  .then((data) => {
    config = YAML.parse(data);
    // 日志输出设置
    logger.transports.console.level = config.log.console.level;
    logger.transports.console.format = config.log.console.format;
    logger.transports.file.level = config.log.file.level;
    logger.transports.file.format = config.log.file.format;

    logger.debug("加载配置文件 `config.yaml`：" + YAML.stringify(config));
  })
  .catch((err) => {
    if (err.code === "ENOENT") {
      logger.info("未找到配置文件。使用默认配置。");
      fs.writeFile(path.join(app.getPath("userData"), "config.yaml"), YAML.stringify(config), "utf8");
    }
  });

logger.catchErrors();

export default config;
