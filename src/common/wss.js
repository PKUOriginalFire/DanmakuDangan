import config from "./config.js";
import * as logger from "electron-log";
import WebSocket, { WebSocketServer } from 'ws';

async function initwsServer(send)
{
	const wss = new WebSocketServer({
		port: config.ws.port,
    host: config.ws.host
	});
	
	wss.on('connection', function(ws) {
		ws.on('message', function(message) {
			onDanmaku(message.toString());
		});
	});
	
	// TODO: 笑死，连心跳都没写（？
	
  async function onDanmaku(query) {
		try {
      const {
        text = "",
        size = config.danmaku.defaultSize,
        color = config.danmaku.defaultColor,
      } = JSON.parse(query);
      const textTrim = text.trim();
      if (textTrim.length !== 0) {
        send("danmaku", {
          text: textTrim,
          size,
          color,
        });
      }
		}catch(e) {
			
		}
  }
	
  logger.info("弹幕服务ws协议已运行于端口%d", config.ws.port);
}

export default initwsServer;