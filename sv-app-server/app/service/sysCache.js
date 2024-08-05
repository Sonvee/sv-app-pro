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
    ctx.checkAuthority('permission', ['cacheKeyList'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 参数校验
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 获取所有键
    const keys = await app.redis.keys('*')

    return {
      data: keys
    }
  }

  /**
   * 查询redis值 post - 权限 permission
   * @param {Object} data
   */
  async cacheValueByKey(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cacheValueByKey'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 参数校验
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 获取所有键
    const keys = await app.redis.keys('*')

    return {
      data: values
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.key - key
   */
  async cacheDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cacheDelete'])

    // 参数校验
    if (!isTruthy(data.key)) ctx.throw(400, { msg: 'key 必填' })

    return {}
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量删除项key
   */
  async cacheBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cacheBatchDelete'])

    // 参数处理
    data = Object.assign(
      {
        list: [] // 需要删除的记录的ID列表
      },
      data
    )

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' })
    if (!isTruthy(data.list)) ctx.throw(400, { msg: 'list 为空' })

    return {}
  }
}

module.exports = SysCacheService
