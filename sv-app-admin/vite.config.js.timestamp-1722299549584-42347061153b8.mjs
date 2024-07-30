// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/node_modules/.pnpm/vite@5.3.4_sass@1.77.8/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.4_vue@3.4.33/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import { createHtmlPlugin } from "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.3.4/node_modules/vite-plugin-html/dist/index.mjs";
import AutoImport from "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/node_modules/.pnpm/unplugin-vue-components@0.27.3_vue@3.4.33/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/node_modules/.pnpm/unplugin-vue-components@0.27.3_vue@3.4.33/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/10513/Desktop/svapp/sv-app-pro/sv-app-admin/vite.config.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
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
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      // 允许IP访问
      host: "0.0.0.0",
      // 应用端口 (默认:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        [env.VITE_API_URL]: {
          changeOrigin: true,
          target: env.VITE_API_PROXY,
          // 接口基础地址
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_API_URL), "")
        }
      }
    },
    esbuild: {
      pure: env.VITE_DROP_CONSOLE == "true" ? ["console.log", "debugger"] : []
    },
    build: {
      outDir: "dist",
      minify: "esbuild",
      sourcemap: false
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxMDUxM1xcXFxEZXNrdG9wXFxcXHN2YXBwXFxcXHN2LWFwcC1wcm9cXFxcc3YtYXBwLWFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxMDUxM1xcXFxEZXNrdG9wXFxcXHN2YXBwXFxcXHN2LWFwcC1wcm9cXFxcc3YtYXBwLWFkbWluXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8xMDUxMy9EZXNrdG9wL3N2YXBwL3N2LWFwcC1wcm8vc3YtYXBwLWFkbWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiBlbnYuVklURV9QVUJMSUNfUEFUSCxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV1cclxuICAgICAgfSksXHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV1cclxuICAgICAgfSksXHJcbiAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcclxuICAgICAgICBpbmplY3Q6IHtcclxuICAgICAgICAgIGRhdGE6IHsgdGl0bGU6IGVudi5WSVRFX0dMT0JfQVBQX1RJVExFIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gXHU1MTQxXHU4QkI4SVBcdThCQkZcdTk1RUVcclxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICAvLyBcdTVFOTRcdTc1MjhcdTdBRUZcdTUzRTMgKFx1OUVEOFx1OEJBNDozMDAwKVxyXG4gICAgICBwb3J0OiBOdW1iZXIoZW52LlZJVEVfQVBQX1BPUlQpLFxyXG4gICAgICAvLyBcdThGRDBcdTg4NENcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTZENEZcdTg5QzhcdTU2NjhcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICBbZW52LlZJVEVfQVBJX1VSTF06IHtcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQVBJX1BST1hZLCAvLyBcdTYzQTVcdTUzRTNcdTU3RkFcdTc4NDBcdTU3MzBcdTU3NDBcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cCgnXicgKyBlbnYuVklURV9BUElfVVJMKSwgJycpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZXNidWlsZDoge1xyXG4gICAgICBwdXJlOiBlbnYuVklURV9EUk9QX0NPTlNPTEUgPT0gJ3RydWUnID8gWydjb25zb2xlLmxvZycsICdkZWJ1Z2dlciddIDogW11cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgICAgbWluaWZ5OiAnZXNidWlsZCcsXHJcbiAgICAgIHNvdXJjZW1hcDogZmFsc2VcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFYsU0FBUyxjQUFjLGVBQWU7QUFDbFksT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFNBQVMsd0JBQXdCO0FBQ2pDLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBTnlMLElBQU0sMkNBQTJDO0FBUzlRLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFFdkMsU0FBTztBQUFBLElBQ0wsTUFBTSxJQUFJO0FBQUEsSUFDVixTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsTUFDRCxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxVQUNOLE1BQU0sRUFBRSxPQUFPLElBQUksb0JBQW9CO0FBQUEsUUFDekM7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUE7QUFBQSxNQUVOLE1BQU0sT0FBTyxJQUFJLGFBQWE7QUFBQTtBQUFBLE1BRTlCLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLENBQUMsSUFBSSxZQUFZLEdBQUc7QUFBQSxVQUNsQixjQUFjO0FBQUEsVUFDZCxRQUFRLElBQUk7QUFBQTtBQUFBLFVBQ1osU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLElBQUksWUFBWSxHQUFHLEVBQUU7QUFBQSxRQUN4RTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNLElBQUkscUJBQXFCLFNBQVMsQ0FBQyxlQUFlLFVBQVUsSUFBSSxDQUFDO0FBQUEsSUFDekU7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
