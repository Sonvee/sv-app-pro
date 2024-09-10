const UAParser = require('ua-parser-js')

/**
 * ua解析
 * @param {*} ctx eggjs的ctx对象
 */
function uaHandler(ctx) {
  const uaParser = new UAParser(ctx.request.header['user-agent'])
  const ua = uaParser.getResult()
  return ua
}

/**
 * 判断用户当前访问平台：WeChat丨Android丨iOS | Windows | MacOS
 * @param {ctx} ctx EggJS上下文
 */
function judgePlatform(ctx) {
  const uaParser = new UAParser(ctx.request.header['user-agent'])
  const ua = uaParser.getResult()

  if (ua.browser.name == 'WeChat') {
    return 'WeChat'
  }
  return ua.os.name
}

const useUAParser = () => {
  return {
    uaHandler,
    judgePlatform
  }
}

module.exports = useUAParser
