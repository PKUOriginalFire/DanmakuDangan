import { build as esbuild } from 'esbuild'
import esbuildConfig from './esbuild.config.mjs'
import fs from 'fs-extra'
import { build as viteBuild } from 'vite'

await fs.remove('./out')
await esbuild({ ...esbuildConfig, minify: true })
await viteBuild({ configFile: 'scripts/vite.config.mjs' })
