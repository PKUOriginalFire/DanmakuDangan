import config from "./config.js";
import Hapi from "@hapi/hapi";
import * as logger from "electron-log";

async function initServer(send) {
  const server = Hapi.server({
    port: config.server.port,
    host: config.server.host,
    routes: {
      cors: true,
    },
  });

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => await onDanmaku(request.query, h),
  });

  server.route({
    method: "POST",
    path: "/",
    handler: async (request, h) => await onDanmaku(request.payload, h),
  });

  async function onDanmaku(query, h) {
    const {
      text = "",
      size = config.danmaku.defaultSize,
      color = config.danmaku.defaultColor,
    } = query;
    const textTrim = text.trim();
    if (textTrim.length !== 0) {
      send("danmaku", {
        text: textTrim,
        size,
        color,
      });
    }
    return h.response().code(200);
  }

  await server.start();
  logger.info("弹幕服务已运行：%s", server.info.uri);
}

export default initServer;
