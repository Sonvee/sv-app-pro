'use strict'

const { isTruthy } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')

const Service = require('egg').Service

class VipPlanService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.plan_id - id
   * @property {String} data.plan_name - 名称
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async planList(data) {
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
    if (isTruthy(data.plan_id)) conditions.plan_id = data.plan_id
    if (isTruthy(data.plan_name)) conditions.plan_name = { $regex: data.plan_name, $options: 'i' } // 模糊查询

    // 数据库连接
    const db = app.model.VipPlan

    // 聚合联表查询操作
    let query = db.aggregate()
    query = query.match(conditions)
    query = query.lookup({
      from: 'vip_benefits', // 这里需要是集合名，不是模型名
      localField: 'benefits', // 这里的字段名需要和Schema中指定键名匹配
      foreignField: 'benefit_id', // 这里的字段名需要和Schema中指定键的ref匹配
      as: 'benefits_detail', // 自定义输出字段名
      pipeline: [
        {
          // 联表指定字段：0 不显示，1 显示
          $project: {
            _id: 0,
            benefit_id: 1,
            benefit_name: 1,
            icon: 1,
            sort: 1
          }
        },
        {
          $sort: { sort: 1 } // 按照sort字段升序排列
        }
      ]
    })

    // 排序：1升序，-1降序
    query = query.sort({ sort: 1 })

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
   * @property {String} data.plan_id - id
   */
  async planAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:plan:add'])

    // 参数校验
    if (!isTruthy(data.plan_id)) ctx.throw(400, { msg: 'plan_id 必填' })

    // 查询条件处理
    const conditions = { plan_id: data.plan_id }

    // 数据库连接
    const db = app.model.VipPlan

    // 查询
    const one = await db.findOne(conditions)
    if (one) ctx.throw(400, { msg: '新增项已存在' })

    const res = await db.create(data)

    return {
      data: res,
      msg: '新增成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.plan_id - id
   */
  async planUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:plan:update'])

    // 参数校验
    if (!isTruthy(data.plan_id)) ctx.throw(400, { msg: 'plan_id 必填' })

    // 查询条件处理
    const conditions = { plan_id: data.plan_id }

    // 数据库连接
    const db = app.model.VipPlan

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
   * 自增更新 - 非api接口 仅提供内部调用
   * @param {Object} data - 请求参数
   * @property {String} data.plan_id - id
   */
  async planInc(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.plan_id)) ctx.throw(400, { msg: 'plan_id 必填' })

    // 查询条件处理
    const conditions = { plan_id: data.plan_id }

    // 数据库连接
    const db = app.model.VipPlan

    const res = await db.findOneAndUpdate(conditions, { $inc: { subscribed_count: 1 } }, { new: true })

    return {
      data: res,
      msg: '自增更新成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.plan_id - id
   */
  async planDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:plan:delete'])

    // 参数校验
    if (!isTruthy(data.plan_id)) ctx.throw(400, { msg: 'plan_id 必填' })

    // 查询条件处理
    const conditions = { plan_id: data.plan_id }

    // 数据库连接
    const db = app.model.VipPlan

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
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认false
   */
  async planBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:plan:batchadd'])

    // 参数处理
    data = Object.assign(
      {
        list: [],
        cover: false // 是否覆盖
      },
      data
    )

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' })
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' })

    // 数据库连接
    const db = app.model.VipPlan

    // 主键
    const primaryKey = 'plan_id'

    // 批量添加
    const res = await batchAdd(ctx, db, data, primaryKey)

    return {
      data: res?.data,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
      tip: res?.tip
    }
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   */
  async planBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:plan:batchdelete'])

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
    const db = app.model.VipPlan

    // 主键
    const primaryKey = 'plan_id'

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }
}

module.exports = VipPlanService
