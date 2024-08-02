'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class SysLogService extends Service {
  /**
   * 查询 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data._id - id
   * @property {String} data.log_type - 类型：login登录日志，operation操作日志
   * @property {String} data.operator_ip - IP
   * @property {String} data.operator_location - 地理位置
   * @property {String} data.login_type - 登录方式（仅限登录日志）
   * @property {String} data.request_method - 请求方式（自动转换大写）
   * @property {String} data.request_url - 请求地址
   * @property {String} data.request_status - 请求状态（自动转换数字）
   * @property {String} data.operator_username - 操作人员用户名
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async logList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['logList'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 参数校验
    if (!isTruthy(data.log_type, 'zero')) ctx.throw(400, { msg: 'log_type 必填' })

    // 数据库连接
    const db = app.model.SysLog

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data._id)) conditions._id = data._id
    if (isTruthy(data.log_type)) conditions.log_type = data.log_type
    if (isTruthy(data.operator_ip)) conditions.operator_ip = data.operator_ip // IP
    if (isTruthy(data.operator_location)) conditions.operator_location = { $regex: data.operator_location, $options: 'i' } // 地理位置 模糊查询
    if (data.log_type == 'login' && isTruthy(data.login_type)) conditions.login_type = data.login_type // 登录方式（仅限登录日志）
    if (isTruthy(data.request_method)) conditions.request_method = data.request_method.toUpperCase() // 请求方式（自动转换大写）
    if (isTruthy(data.request_url)) conditions.request_url = { $regex: data.request_url, $options: 'i' } // 请求地址 模糊查询
    if (isTruthy(data.request_status)) conditions.request_status = Number(data.request_status) // 请求状态（自动转换数字）
    if (isTruthy(data.operator_username)) conditions['operator_info.username'] = { $regex: data.operator_username, $options: 'i' } // 操作人员用户名 模糊查询

    // 查询操作
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ created_date: -1 })

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
      msg: '日志列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages
    }
  }

  /**
   * 新增 post - 权限 open
   * @description 仅服户端调用
   * @param {Object} data - 请求参数
   * @property {String} data.log_type - 类型
   */
  async logAdd(data) {
    const { ctx, app } = this

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.log_type)) ctx.throw(400, { msg: 'log_type 必填' })

    // 数据库连接
    const db = app.model.SysLog

    // 直接新增
    const res = await db.create(data)

    return {
      data: res,
      msg: '日志新增成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data._id - id
   */
  async logDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['logDelete'])

    // 参数处理
    data = Object.assign(
      {
        _id: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data._id)) ctx.throw(400, { msg: '_id 必填' })

    // 数据库连接
    const db = app.model.SysLog

    // 查询条件处理
    const conditions = { _id: data._id }

    // 直接删除
    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: '日志删除成功'
    }
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量删除项
   */
  async logBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['logBatchDelete'])

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

    // 数据库连接
    const db = app.model.SysLog
    // 主键
    const primaryKey = '_id'

    // 分批处理删除操作，避免单次操作处理过多数据
    const batchSize = app.config.batchDeleteSize || 1000 // 分批数量 app.config.batchDeleteSize 在 config.default.js 中配置
    let deletedCount = 0

    // 执行批量删除
    for (let i = 0; i < data.list.length; i += batchSize) {
      const batchKeys = data.list.slice(i, i + batchSize)
      const deleteRes = await db.deleteMany({ [primaryKey]: { $in: batchKeys } })
      deletedCount += deleteRes.deletedCount
    }

    // 其他处理
    if (deletedCount == 0) ctx.throw(400, { msg: '无有效数据项删除' })

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }

  /**
   * 清空 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.log_type - 类型：login登录日志，operation操作日志
   */
  async logClear(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['logClear'])

    // 参数校验
    if (!isTruthy(data.log_type, 'zero')) ctx.throw(400, { msg: 'log_type 必填' })

    // 数据库连接
    const db = app.model.SysLog

    // 查询条件处理
    const conditions = { log_type: data.log_type }

    // 清空指定类型日志
    const res = await db.deleteMany(conditions)

    return {
      data: res,
      msg: '日志清空成功'
    }
  }
}

module.exports = SysLogService
