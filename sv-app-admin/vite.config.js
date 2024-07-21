import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: { title: env.VITE_GLOB_APP_TITLE }
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      // 允许IP访问
      host: '0.0.0.0',
      // 应用端口 (默认:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /** 代理前缀为 /api 的请求  */
        [env.VITE_API_URL]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_API_PROXY,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_API_URL), '')
        }
      }
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE == 'true' ? ['console.log', 'debugger'] : []
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: false
    }
  }
})
