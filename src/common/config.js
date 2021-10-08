import { app } from "electron";
import fs from "fs";
import * as path from "path";
import YAML from "yaml";
import * as logger from "electron-log";

function assiginObj(target = {}, sources = {}) {
  let obj = target;
  if (typeof target != "object" || typeof sources != "object") {
    return sources; // 如果其中一个不是对象 就返回sources
  }
  for (let key in sources) {
    // 如果target也存在 那就再次合并
    if (target.hasOwnProperty(key)) {
      obj[key] = assiginObj(target[key], sources[key]);
    } else {
      // 不存在就直接添加
      obj[key] = sources[key];
    }
  }
  return obj;
}

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
  margin: { // 单位 %
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  danmaku: {
    speed: 144,
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

  const new_config = YAML.parse(data);
  assiginObj(config, new_config);
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
