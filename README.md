# 元火弹幕姬

使用 Electron 框架搭建的实时桌面弹幕服务。

~~其实是因为第一代弹幕姬年久失修而花两天时间赶工做的临时方案~~
  
## 使用方法

启动后，会在本地的指定端口开启 HTTP 服务，接收来自客户端的弹幕数据。

可以通过 GET 或 POST 方法发送弹幕：

```
[GET] http://localhost:3000/?text=弹幕测试&size=25&color=rgb(255,0,0)
```

```
[POST] http://localhost:3000
{
  "text": "弹幕测试",
  "size": 25,
  "color": "#ff0000"
}
```

`text` 为弹幕内容，`size` 为字号（可选，单位像素），`color` 为弹幕颜色（可选，按照 css 的颜色格式）。

可以通过托盘区图标控制弹幕姬，如设置弹幕是否显示、打开配置文件、退出弹幕姬等。

## 配置文件

弹幕姬启动后，会在本地生成一个配置文件，在 Windows 系统下，此文件位于 `%APPDATA%\Roaming\danmaku-dangan\config.yaml`。

如果记不住这个路径，可以在托盘图标的右键菜单中，点击“打开配置文件”，找到配置文件的位置。

默认配置如下：

```yaml
server: # 弹幕服务器配置
  port: 3000 # 端口
  host: localhost # 主机
debug: false # 是否开启调试模式
log: # 日志配置
  console: # 控制台
    level: warn # 日志级别
    format: "[{h}:{i}:{s}.{ms}] [{level}] {text}" # 日志格式，参考 electron-log
  file: # 日志文件
    level: info
    format: "[{h}:{i}:{s}.{ms}] [{level}] {text}"
danmaku: # 弹幕配置
  defaultSize: 25 # 默认字号，单位像素
  defaultColor: "#fff" # 默认颜色
```

## 日志文件

在托盘图标右键菜单中，可以打开日志文件所在目录。

日志的显示级别和格式，可以在配置文件中设置。

## 开源协议

本项目以 GNU Lesser General Public License 3.0 开源。
