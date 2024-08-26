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

  config.cors = {
    origin: 'http://101.34.89.199', // 或者指定允许访问的源
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true // 允许携带Cookie
  }

  /**
   * egg-mongoose 配置
   */
  config.mongoose = {
    client: {
      url: 'mongodb://sonve.asia:27017/sv_database',
      options: {
        user: 'sv_database',
        pass: 'Sonve_5817'
      }
    }
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
      bucket: 'sv-kodo', // 空间名称
      baseUrl: 'http://sitga4tm1.hn-bkt.clouddn.com/' // 用于拼接已上传文件的完整地址，后缀'/'不能丢
    }
  }

  /**
   * 集群配置
   * @description 可更改 端口号、host 等
   */
  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0'
    }
  }

  // 自定义配置
  const userConfig = {}

  return {
    ...config,
    ...userConfig
  }
}
