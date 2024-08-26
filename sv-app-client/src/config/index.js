import manifest from '../manifest.json'

const base_url = 'http://0.0.0.0:7001' // 基础路径

const config = {
	name: manifest.name,
	appid: manifest.appid,
	description: manifest.description,
	version: manifest.versionName,
	base_url: base_url,
	api_url: `${base_url}/api`,
	logo_url: '/static/logo.png' // logo图标路径
}

export default config