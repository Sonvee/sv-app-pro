const libqqwry = require('lib-qqwry')
const qqwry = libqqwry() // 初始化IP库解析器
qqwry.speed() // 启用急速模式

/**
 * 根据IP查找地区
 * @param {String} ip 要查找的ip地址
 * @tutorial https://github.com/cnwhy/lib-qqwry
 */
function useIpToRegion(ip) {
  const search = qqwry.searchIP(ip)
  return search.Country
}

module.exports = useIpToRegion
