import manifest from '../manifest.json'

// const base_url = 'http://192.168.1.209:7001' // 基础路径
const base_url = 'http://192.168.6.115:7001' // 基础路径

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