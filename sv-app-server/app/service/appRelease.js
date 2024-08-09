'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class AppReleaseService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {String} data.type - 应用类型 android ios mpweixin ...
   * @property {Array} data.release_range - 发布日期范围
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async releaseList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.version)) conditions.version = { $regex: data.version, $options: 'i' } // 模糊查询
    if (isTruthy(data.type)) conditions.type = data.type
    if (isTruthy(data.release_range, 'arr')) conditions.release_date = { $gte: data.release_range[0], $lte: data.release_range[1] } // 时间范围

    // 数据库连接
    const db = app.model.AppRelease

    // 查询
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ version: -1, release_date: -1 })

    // 分页
    if (pagesize > 0) {
      query = query.skip(pagesize * (pagenum - 1)).limit(pagesize)
    }

    // 计数
    const count = await db.countDocuments(conditions)

    // 页数
    const pages = pagesize > 0 ? Math.ceil(count / pagesize) : count > 0 ? 1 : 0

    // 处理查询结果
    const res = await query.exec()

    return {
      data: res,
      msg: '版本列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages
    }
  }

  /**
   * 查询最新版本 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.type - 应用类型
   */
  async releaseLatest(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数校验
    if (!isTruthy(data.type)) ctx.throw(400, { msg: 'type 必填' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.type)) conditions.type = data.type

    // 数据库连接
    const db = app.model.AppRelease

    // 查询
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ version: -1, release_date: -1 })

    // 处理查询结果
    const res = await query.exec()
    if (!isTruthy(res, 'arr')) ctx.throw(400, { msg: `无最新 ${data.type} 版本资源` })

    return {
      data: res[0],
      msg: `最新 ${data.type} 版本获取成功`
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {String} data.type - 应用类型
   */
  async releaseAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseAdd'])

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })
    if (!isTruthy(data.type)) ctx.throw(400, { msg: 'type 必填' })

    // 查询条件处理
    const conditions = { version: data.version, type: data.type }

    // 数据库连接
    const db = app.model.AppRelease

    // 查询
    const one = await db.findOne(conditions)
    if (one) ctx.throw(400, { msg: `${data.type} ${data.version} 版本已存在` })

    const res = await db.create(data)

    return {
      data: res,
      msg: `${data.type} ${data.version} 版本发布成功`
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {String} data.type - 应用类型
   * @property {any} 更多请前往model/appRelease.js
   */
  async releaseUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseUpdate'])

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })
    if (!isTruthy(data.type)) ctx.throw(400, { msg: 'type 必填' })

    // 查询条件处理
    const conditions = { version: data.version, type: data.type }

    // 数据库连接
    const db = app.model.AppRelease

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: `${data.type} ${data.version} 版本不存在` })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    return {
      data: res,
      msg: `${data.type} ${data.version} 版本更新成功`
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {String} data.type - 应用类型
   */
  async releaseDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseDelete'])

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })
    if (!isTruthy(data.type)) ctx.throw(400, { msg: 'type 必填' })

    // 查询条件处理
    const conditions = { version: data.version, type: data.type }

    // 数据库连接
    const db = app.model.AppRelease

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: `${data.type} ${data.version} 版本不存在或已被删除` })

    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: `${data.type} ${data.version} 版本删除成功`
    }
  }
}

module.exports = AppReleaseService
