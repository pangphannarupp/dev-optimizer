import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    // Only enable electron plugin if NOT a web build
    !process.env.IS_WEB_BUILD && electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: 'electron/preload.ts',
      },
      renderer: {},
    }),
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: /curlconverter\/dist\/src\/shell\/Parser\.js$/,
        replacement: path.resolve(__dirname, 'node_modules/curlconverter/dist/src/shell/webParser.js'),
      },
    ]
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils-vendor': ['uuid', 'file-saver', 'jszip'],
          'ui-vendor': ['lucide-react', 'react-syntax-highlighter', 'react-markdown'],
          'framer-vendor': ['framer-motion'],
        },
      },
    },
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  optimizeDeps: {
    include: ['curlconverter', 'web-tree-sitter', 'postman-collection'],
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/vitest.setup.ts',
    server: {
      deps: {
        inline: ['svgo', 'svg2vectordrawable'],
      },
    },
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*', 'e2e/**'],
  },
})
