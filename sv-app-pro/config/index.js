import manifest from '@/manifest.json'

const base_url = 'http://192.168.1.209:7001' // 基础路径
// const base_url = 'http://192.168.6.117:7001' // 基础路径
const base_cdn = 'http://sff40j8ij.hn-bkt.clouddn.com' // oss路径

const config = {
  name: manifest.name,
  appid: manifest.appid,
  description: manifest.description,
  version: manifest.versionName,
  base_url: base_url,
  base_cdn: base_cdn,
  api_url: `${base_url}/api`,
  logo_url: '/static/logo.png' // logo图标路径
}

export default config