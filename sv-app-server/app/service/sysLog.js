'use strict'

const { isTruthy } = require('../utils')
const { batchDelete } = require('../utils/batch')
const useExcel = require('../utils/excel')

const Service = require('egg').Service

class SysLogService extends Service {
  /**
   * 查询 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.log_id - id
   * @property {String} data.log_type - 类型：login登录日志，operation操作日志
   * @property {String} data.operator_ip - IP
   * @property {String} data.operator_location - 地理位置
   * @property {String} data.login_type - 登录方式（仅限登录日志）
   * @property {String} data.request_method - 请求方式（自动转换大写）
   * @property {String} data.request_url - 请求地址
   * @property {String} data.request_status - 请求状态（自动转换数字）
   * @property {String} data.operator_username - 操作人员用户名
   * @property {Array} data.time_range - 操作时间范围
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async logList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:log:query'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 参数校验
    if (!isTruthy(data.log_type, 'zero')) ctx.throw(400, { msg: 'log_type 必填' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.log_id)) conditions.log_id = data.log_id
    if (isTruthy(data.log_type, 'zero')) conditions.log_type = data.log_type
    if (isTruthy(data.operator_ip)) conditions.operator_ip = data.operator_ip // IP
    if (isTruthy(data.operator_location)) conditions.operator_location = { $regex: data.operator_location, $options: 'i' } // 地理位置 模糊查询
    if (data.log_type == 'login' && isTruthy(data.login_type, 'zero')) conditions.login_type = data.login_type // 登录方式（仅限登录日志）
    if (isTruthy(data.request_method)) conditions.request_method = data.request_method.toUpperCase() // 请求方式（自动转换大写）
    if (isTruthy(data.request_url)) conditions.request_url = { $regex: data.request_url, $options: 'i' } // 请求地址 模糊查询
    if (isTruthy(data.request_status, 'zero')) conditions.request_status = Number(data.request_status) // 请求状态（自动转换数字）
    if (isTruthy(data.operator_username)) conditions['operator_info.username'] = { $regex: data.operator_username, $options: 'i' } // 操作人员用户名 模糊查询
    if (isTruthy(data.time_range, 'arr')) conditions.created_date = { $gte: data.time_range[0], $lte: data.time_range[1] } // 时间范围

    // 数据库连接
    const db = app.model.SysLog

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

    // 开启lean（聚合查询无需开启）
    query = query.lean()

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

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    delete data.log_id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.log_type, 'zero')) ctx.throw(400, { msg: 'log_type 必填' })

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
   * @property {String} data.log_id - id
   */
  async logDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:log:delete'])

    // 参数校验
    if (!isTruthy(data.log_id)) ctx.throw(400, { msg: 'log_id 必填' })

    // 查询条件处理
    const conditions = { log_id: data.log_id }

    // 数据库连接
    const db = app.model.SysLog

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
    ctx.checkAuthority('permission', ['sys:log:batchdelete'])

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
    const primaryKey = 'log_id'

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }

  /**
   * 清空 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.log_type - 类型：login登录日志，operation操作日志
   * @property {Array} data.time_range - 操作时间范围
   * @param {Boolean} limit - 是否开启权限约束 默认开启
   */
  async logClear(data, limit = true) {
    const { ctx, app } = this

    // 权限校验
    if (limit) ctx.checkAuthority('permission', ['sys:log:clear'])

    // 参数校验
    if (!isTruthy(data.log_type, 'zero')) ctx.throw(400, { msg: 'log_type 必填' })

    // 查询条件处理
    const conditions = { log_type: data.log_type }

    // 参数校验
    if (isTruthy(data.time_range, 'arr')) conditions.created_date = { $gte: data.time_range[0], $lte: data.time_range[1] } // 时间范围

    // 数据库连接
    const db = app.model.SysLog

    // 清空指定类型日志
    const res = await db.deleteMany(conditions)

    return {
      data: res,
      msg: '日志清空成功'
    }
  }

  /**
   * excel导出 post - 权限 permission
   * @param {Object} data 请求参数
   */
  async logExport(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:log:excel'])

    const listRes = await this.logList(data)

    // 表头列（顺序严格）
    let columns = []

    if (data.log_type == 'login') {
      // 登录日志
      columns = [
        { header: '日志ID', key: 'log_id', width: 30 },
        { header: '登录方式', key: 'login_type', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '操作人员', key: 'operator_info.username', width: 30 },
        { header: 'IP', key: 'operator_ip', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '归属地', key: 'operator_location', width: 40 },
        { header: 'API', key: 'request_url', width: 40 },
        { header: '请求信息', key: 'request_msg', width: 40 },
        { header: '请求方式', key: 'request_method', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '请求状态', key: 'request_status', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '请求耗时 (ms)', key: 'costtime', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '浏览器', key: 'userAgent.browser.name', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '操作系统', key: 'userAgent.os.name', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: 'ua', key: 'userAgent.ua', width: 120 },
        { header: '操作时间', key: 'created_date', width: 30, style: { alignment: { horizontal: 'center' } }, type: 'timestamp' }
      ]
    } else if (data.log_type == 'operation') {
      // 操作日志
      columns = [
        { header: '日志ID', key: 'log_id', width: 30 },
        { header: '操作人员', key: 'operator_info.username', width: 30 },
        { header: 'IP', key: 'operator_ip', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '归属地', key: 'operator_location', width: 40 },
        { header: 'API', key: 'request_url', width: 40 },
        { header: '请求信息', key: 'request_msg', width: 40 },
        { header: '请求方式', key: 'request_method', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '请求状态', key: 'request_status', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '请求耗时 (ms)', key: 'costtime', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '浏览器', key: 'userAgent.browser.name', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: '操作系统', key: 'userAgent.os.name', width: 20, style: { alignment: { horizontal: 'center' } } },
        { header: 'ua', key: 'userAgent.ua', width: 120 },
        { header: '操作时间', key: 'created_date', width: 30, style: { alignment: { horizontal: 'center' } }, type: 'timestamp' }
      ]
    }

    // 填充数据
    const tableData = listRes.data

    try {
      const options = { columns, data: tableData, fileName: 'log_list' }
      const buffer = await useExcel().createWorkSheet(ctx, options)

      return {
        type: 'buffer', // 注明类型为二进制文件
        data: buffer
      }
    } catch (error) {
      ctx.throw(500, { msg: '导出文件失败', errMsg: error.message })
    }
  }
}

module.exports = SysLogService
