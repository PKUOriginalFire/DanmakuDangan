import { app } from "electron";
import fs from "fs";
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
    opacity: 0.8,
    defaultSize: 25,
    defaultColor: "#fff",
  },
};
try {
  const data = fs.readFileSync(
    path.join(app.getPath("userData"), "config.yaml"),
    "utf8"
  );

  config = YAML.parse(data);
  // 日志输出设置
  logger.transports.console.level = config.log.console.level;
  logger.transports.console.format = config.log.console.format;
  logger.transports.file.level = config.log.file.level;
  logger.transports.file.format = config.log.file.format;

  fs.writeFileSync(
    path.join(app.getPath("userData"), "config.yaml"),
    YAML.stringify(config),
    "utf8"
  );
  logger.debug("加载配置文件 `config.yaml`：" + YAML.stringify(config));
} catch (err) {
  if (err.code === "ENOENT") {
    logger.info("未找到配置文件。使用默认配置。");
    fs.writeFileSync(
      path.join(app.getPath("userData"), "config.yaml"),
      YAML.stringify(config),
      "utf8"
    );
  } else {
    logger.error(err);
  }
}

logger.catchErrors();

export default config;
