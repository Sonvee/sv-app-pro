import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path';
import config from './src/config/index.js'

export default defineConfig(({ mode }) => {
	return {
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
			proxy: {
				'/api': {
					target: config.api_url, // 接口基础地址
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},
	}
})