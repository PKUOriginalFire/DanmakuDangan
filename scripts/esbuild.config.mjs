/**
 * @type {import('esbuild').BuildOptions}
 */
const config = {
  entryPoints: ['./src/main/index.ts', './src/preload/index.ts'],
  bundle: true,
  external: ['electron'],
  platform: 'node',
  outdir: './out'
}

export default config
