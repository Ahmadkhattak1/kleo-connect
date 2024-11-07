import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      process: 'process/browser',
      path: 'path-browserify',
      os: 'os-browserify',
      "@": path.resolve(__dirname, "./src"),
    }
  },
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [
        'fs' // Excludes the polyfill for `fs` and `node:fs`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true
    })
  ],
  envPrefix: 'VITE_'
  // build: {
  //   assetsInlineLimit: 1000000,
  //   assetsInclude: ['**/*.svg'],
  //   commonjsOptions: {
  //     include: []
  //   }
  //   // rollupOptions: {
  //   //   plugins: [rollupNodePolyFill()]
  //   // }
  // }
  // optimizeDeps: {
  //   disabled: false,
  //   esbuildOptions: {
  //     // Enable esbuild polyfill plugins
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         process: true,
  //         buffer: true
  //       }),
  //       NodeModulesPolyfillPlugin()
  //     ]
  //   }
  // }
})
