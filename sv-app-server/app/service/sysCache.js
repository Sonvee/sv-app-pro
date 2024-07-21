'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class SysCacheService extends Service {
  /**
   * 查询redis缓存 get - 权限 permission
   * @param {Object} data
   */
  async cacheList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cacheList'])

    return {}
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

    // 参数处理
    data = Object.assign(
      {
        key: ''
      },
      data
    )

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
