/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 * @tutorial https://eggjs.github.io/zh/guide/config.html
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  /**
   * @description 开启前置代理模式
   * @tutorial https://www.eggjs.org/zh-CN/tutorials/proxy
   */
  config.proxy = true

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1715823498639_1073'

  config.security = {
    csrf: {
      enable: false
    }
  }

  /**
   * egg-jwt 配置
   */
  config.jwt = {
    secret: 'sonve_1949_10_01', // 自定义token的加密条件字符串
    expires: '7d' // 过期时长 d：天
  }

  /**
   * 中间件执行顺序：洋葱圈模型
   * @tutorial https://www.eggjs.org/zh-CN/intro/egg-and-koa#middleware
   */
  config.middleware = ['defense', 'logger', 'result', 'authorization']

  /**
   * 中间件配置
   */
  config.defense = {
    enable: false // 关闭防御中间件
  }

  /**
   * 文件上传
   */
  config.multipart = {
    mode: 'file',
    fileSize: '100mb',
    fileExtensions: ['.apk', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.xlsx', '.xls']
  }

  /**
   * 邮箱验证 nodemailer 配置
   * @description 需先开启发送者邮箱的 POP3/SMYP 服务
   */
  config.nodemailer = {
    default: {
      host: 'smtp.qq.com', // QQ邮箱的SMTP地址
      port: 465, // 邮箱的端口号一般都使用465
      auth: {
        user: '3300317910@qq.com', // 邮箱地址
        pass: 'wtageylkobtgcjej' // 授权码
      }
    },
    expires: 60 // 过期时长（分钟）
  }

  /**
   * 微信相关参数
   */
  config.wechat = {
    appid: 'wx417856313e7d8aff',
    appsecret: '13f2907fa847db3360cb1bfd8747608d'
  }

  /**
   * 百度统计api
   * @tutorial https://tongji.baidu.com/api/manual/Chapter2/openapi.html
   */
  config.baiduAnalytics = {
    api_key: 'GfFfqrkUiFg5UilWEIs2CVEHpRZvqqxa',
    secret_key: '2yn7KHX9uzwr8ngBVCtlJeBJsVOUdXt0'
  }

  // 自定义配置
  const userConfig = {
    maxRequestThreshold: 60 // 每秒请求阈值，超过该值将会被自动封锁ip
  }

  return {
    ...config,
    ...userConfig
  }
}
