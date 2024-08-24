'use strict'

const { isTruthy } = require('../utils')
const { batchDelete } = require('../utils/batch')

const Service = require('egg').Service

class AppFeedbackService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.feedback_id - id
   * @property {String} data.name - 名称
   * @property {String} data.title - 标题
   * @property {Number} data.type - 类型
   * @property {Number} data.status - 状态
   * @property {String} data.created_by - 创建者
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async feedbackList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 参数校验
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.feedback_id)) conditions.feedback_id = data.feedback_id
    if (isTruthy(data.type, 'zero')) conditions.type = data.type
    if (isTruthy(data.status, 'zero')) conditions.status = data.status
    if (isTruthy(data.created_by)) conditions.created_by = data.created_by
    if (isTruthy(data.name)) conditions.name = { $regex: data.name, $options: 'i' } // 模糊查询
    if (isTruthy(data.title)) conditions.title = { $regex: data.title, $options: 'i' } // 模糊查询

    // 数据库连接
    const db = app.model.AppFeedback

    // 查询
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ created_date: -1 }) // 按照创建时间倒序

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
      msg: '列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.title - 标题
   * @property {Number} data.type - 类型
   * @property {Number} data.status - 状态
   */
  async feedbackAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['app:feedback:add'])

    delete data.feedback_id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.title)) ctx.throw(400, { msg: 'title 必填' })
    if (!isTruthy(data.type, 'zero')) ctx.throw(400, { msg: 'type 必填' })
    if (!isTruthy(data.status, 'zero')) ctx.throw(400, { msg: 'status 必填' })

    // 数据库连接
    const db = app.model.AppFeedback

    // 新增
    const res = await db.create(data)

    return {
      data: res,
      msg: '新增成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.feedback_id - id
   */
  async feedbackUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['app:feedback:update'])

    // 参数校验
    if (!isTruthy(data.feedback_id)) ctx.throw(400, { msg: 'feedback_id 必填' })
    if (!isTruthy(data.title)) ctx.throw(400, { msg: 'title 必填' })
    if (!isTruthy(data.type, 'zero')) ctx.throw(400, { msg: 'type 必填' })
    if (!isTruthy(data.status, 'zero')) ctx.throw(400, { msg: 'status 必填' })

    // 查询条件处理
    const conditions = { feedback_id: data.feedback_id }

    // 数据库连接
    const db = app.model.AppFeedback

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新项不存在' })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    return {
      data: res,
      msg: '更新成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.feedback_id - id
   */
  async feedbackDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['app:feedback:delete'])

    // 参数校验
    if (!isTruthy(data.feedback_id)) ctx.throw(400, { msg: 'feedback_id 必填' })

    // 查询条件处理
    const conditions = { feedback_id: data.feedback_id }

    // 数据库连接
    const db = app.model.AppFeedback

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '删除项不存在或已被删除' })

    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: '删除成功'
    }
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   */
  async feedbackBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['app:feedback:batchdelete'])

    // 参数处理
    data = Object.assign(
      {
        list: [] // 需要删除的记录的ID列表
      },
      data
    )

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' })
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' })

    // 数据库连接
    const db = app.model.AppFeedback

    // 主键
    const primaryKey = 'feedback_id'

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }
}

module.exports = AppFeedbackService
