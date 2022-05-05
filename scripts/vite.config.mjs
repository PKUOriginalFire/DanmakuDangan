import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../out/renderer',
    emptyOutDir: true,
    assetsDir: '', // 这个要格外小心，使用默认的 assets 会导致在 Electron 打包后基于 file:// 加载文件失败
    rollupOptions: {
      output: { format: 'cjs' }
    }
  }
})
