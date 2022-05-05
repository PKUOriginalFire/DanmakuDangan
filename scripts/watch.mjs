import { createServer } from 'vite'
import electron from 'electron'
import { build as esbuild } from 'esbuild'
import esbuildConfig from './esbuild.config.mjs'
import fs from 'fs-extra'
import { spawn } from 'child_process'

async function watchMain(server) {
  const address = server.httpServer.address()
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port,
    ELECTRON_RENDERER_URL: `http://${address.address}:${address.port}`
  })

  let electronProcess = null
  const restartElectron = () => {
    if (electronProcess) {
      electronProcess.kill()
      electronProcess = null
    }
    console.log(`启动 electron，加载地址：${address.address}:${address.port}。`)
    electronProcess = spawn(electron, ['./out/main/index.js'], { env, stdio: 'inherit' })
  }
  const restartElectronPlugin = {
    name: 'electron-watcher',
    setup(build) {
      build.onEnd((result) => {
        console.log(`主进程构建完成，发生${result.errors.length}个错误。`)
        !result.errors.length && restartElectron()
      })
    }
  }

  await fs.remove('./out')
  return await esbuild({
    ...esbuildConfig,
    sourcemap: true,
    watch: true,
    incremental: true,
    plugins: [restartElectronPlugin]
  })
}

// bootstrap
const server = await createServer({
  configFile: 'scripts/vite.config.mjs',
  build: { minify: false, sourcemap: true }
})

await server.listen()
await watchMain(server)
