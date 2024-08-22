/**
 * 创建cdkey
 * @param {Number} segments 分组数
 * @param {Number} segmentLength 每组字符数
 * @param {String} flag 分组标志
 * @return {String} cdkey
 */
function createCdkey(segments = 5, segmentLength = 5, flag = '-') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  const cdkey = Array(segments)
    .fill(null)
    .flatMap(() => [[...Array(segmentLength)].map(() => chars[Math.floor(Math.random() * chars.length)]).join(''), flag])
    .slice(0, -1) // 去掉最后一个破折号
  return cdkey.join('')
}

/**
 * cdkey校验
 * @param {string} cdkey 要校验的cdkey
 * @param {Number} segments 分组数
 * @param {Number} segmentLength 每组字符数
 * @param {String} flag 分组标志
 * @return {boolean} 是否校验成功
 */
function validCdkey(cdkey, segments = 5, segmentLength = 5, flag = '-') {
  const regexPattern = new RegExp(`^(?:[A-Za-z0-9]{${segmentLength}}\\${flag}){${segments - 1}}[A-Za-z0-9]{${segmentLength}}$`)
  return regexPattern.test(cdkey)
}

module.exports = {
  createCdkey,
  validCdkey
}
