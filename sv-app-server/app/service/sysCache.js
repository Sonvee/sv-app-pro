'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class SysCacheService extends Service {
  /**
   * 查询redis键 get - 权限 permission
   * @param {Object} data
   */
  async cacheKeyList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:cache:query'])

    // 获取所有键
    const keys = await app.redis.keys('*')

    return {
      data: keys
    }
  }

  /**
   * 查询redis值 post - 权限 permission
   * @param {Object} data
   * @property {String} data.key redis缓存键名
   */
  async cacheValueByKey(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:cache:query'])

    // 参数校验
    if (!isTruthy(data.key)) ctx.throw(400, { msg: 'key 必填' })

    let value = await app.redis.get(data.key)

    try {
      value = JSON.parse(value)
    } catch (parseError) {
      // 如果解析失败，则保留原始字符串
    }

    return {
      data: value,
      msg: '缓存列表获取成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.key - redis缓存键名
   */
  async cacheDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:cache:delete'])

    // 参数校验
    if (!isTruthy(data.key)) ctx.throw(400, { msg: 'key 必填' })

    const one = await app.redis.del(data.key)
    if (!one) ctx.throw(400, { msg: '缓存不存在或已被删除' })

    return {
      data: one,
      msg: `删除缓存 ${data.key} 成功`
    }
  }
}

module.exports = SysCacheService
