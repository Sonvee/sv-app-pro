import manifest from '../manifest.json'

// const base_url = 'http://app.server.sonve.asia:7001' // 生产环境
// const base_url = 'http://192.168.1.209:7001' // 开发环境 内网
const base_url = 'http://192.168.6.111:7001' // 开发环境 内网

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