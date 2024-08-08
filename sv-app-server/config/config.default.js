/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
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
    },
    domainWhiteList: [] // 跨域白名单
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
  config.middleware = ['security', 'logger', 'result', 'authorization']

  /**
   * token 校验规则
   */
  config.authorization = {
    enable: true,
    match(ctx) {
      // 取ctx.url中?之前的基础路径
      const routeURL = ctx.url.split('?')[0]

      // 1. 过滤是否404
      const apiRoutes = ctx.router.stack?.map((item) => item.path)
      if (!apiRoutes.includes(routeURL)) {
        return false
      }

      // 2. 白名单免token校验
      const white = [
        '/api/auth/getCaptcha',
        '/api/auth/emailCaptcha',
        '/api/user/login',
        '/api/user/loginByEmailer',
        '/api/user/loginByWechat',
        '/api/user/register',
        '/api/user/hasAdmin',
        '/api/user/findPermissionByRole',
        '/api/sys/menuList',
        '/api/sys/authMenuList'
      ]
      if (white.includes(routeURL)) {
        return false
      }

      // 3. 黑名单强制token校验
      const black = ['/api/test']
      if (black.includes(routeURL)) {
        return true
      }

      // 4. 通用正则校验，新路径前缀需在此出添加，否则会报404
      const reg = /^\/api\/(user|sys|file|app|cache)(\/.*)?/
      return reg.test(routeURL)
    }
  }

  /**
   * egg-mongoose 配置
   */
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg_mongo',
    options: {}
  }

  /**
   * 文件上传
   */
  config.multipart = {
    mode: 'file',
    fileSize: '10mb'
    // fileExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  }

  /**
   * 七牛云 oss
   * @tutorial https://github.com/alex-my/egg-full-qiniu
   */
  config.fullQiniu = {
    default: {
      ak: 'cPls9b0slj64ENnlZ91Bn0OyfB4_xFidmRSH9BT4',
      sk: 'VXzyhoNA3ZfCOA3xe3b7FpXU1SGucWKN57NgiL6J',
      useCdnDomain: true,
      isLog: true
    },
    app: true,
    agent: false,
    // 单实例
    // 通过 app.fullQiniu 直接使用实例
    client: {
      zone: 'Zone_z2', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
      bucket: 'sv-app-oss', // 空间名称
      baseUrl: 'http://sgyrcxiab.hn-bkt.clouddn.com/' // 用于拼接已上传文件的完整地址，后缀'/'不能丢
    }
  }

  /**
   * egg-redis 配置
   * @tutorial https://www.cnblogs.com/ruozhisi/p/12199311.html Redis密码修改
   */
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '1949100115', // Redis password
      db: 0
    }
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
   * 集群配置
   * @description 可更改 端口号、host 等
   */
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '192.168.1.209'
      // hostname: '192.168.6.112'
    }
  }

  /**
   * 微信相关参数
   */
  config.wechat = {
    appid: 'wx417856313e7d8aff',
    appsecret: '13f2907fa847db3360cb1bfd8747608d'
  }

  // 自定义配置
  const userConfig = {
    maxRequestThreshold: 60, // 每秒请求阈值，超过该值将会被自动封锁ip
    batchAddSize: 1000, // 分批处理新增数
    batchDeleteSize: 1000 // 分批处理删除数
  }

  return {
    ...config,
    ...userConfig
  }
}
