import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path';
// import config from './src/config/index.js'

export default defineConfig(({ mode }) => {
  return {
    base: './',
    plugins: [
      uni(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      }
    },
    server: {
      host: '0.0.0.0',
      port: '3030',
    },
  }
})