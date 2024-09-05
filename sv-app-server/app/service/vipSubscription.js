'use strict'

const { isTruthy } = require('../utils')
const { batchDelete, batchAdd } = require('../utils/batch')

const Service = require('egg').Service

class VipSubscriptionService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @param {Object} projection - 字段筛选 可选
   * @property {String} data.subscription_id - id
   * @property {String} data.subscription_plan - 套餐id
   * @property {String} data.user_id - 用户id
   * @property {Number} data.status - 状态
   * @property {Number} data.type - 订阅类型
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async subscriptionList(data, projection) {
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
    if (isTruthy(data.subscription_id)) conditions.subscription_id = data.subscription_id
    if (isTruthy(data.user_id)) conditions.user_id = data.user_id
    if (isTruthy(data.subscription_plan)) conditions.subscription_plan = data.subscription_plan
    if (isTruthy(data.status, 'zero')) conditions.status = data.status
    if (isTruthy(data.type, 'zero')) conditions.type = data.type

    // 数据库连接
    const db = app.model.VipSubscription

    // 聚合联表查询操作
    let query = db.aggregate()
    query = query.match(conditions)
    query = query.lookup({
      from: 'vip_plans', // 这里需要是集合名，不是模型名
      localField: 'subscription_plan', // 这里的字段名需要和Schema中指定键名匹配
      foreignField: 'plan_id', // 这里的字段名需要和Schema中指定键的ref匹配
      as: 'subscription_plan_detail', // 自定义输出字段名
      pipeline: [
        {
          // 联表指定字段：0 不显示，1 显示
          $project: {
            _id: 0,
            plan_id: 1,
            plan_name: 1,
            valid_day: 1,
            benefits: 1
          }
        }
      ]
    })
    query = query.unwind({
      path: '$subscription_plan_detail', // 数组严禁使用unwind，会展开为单个对象
      preserveNullAndEmptyArrays: true // 必须开启，否则其他为空的数据项将不会被查询
    })
    query = query.lookup({
      from: 'sys_users', // 这里需要是集合名，不是模型名
      localField: 'user_id', // 这里的字段名需要和Schema中指定键名匹配
      foreignField: 'user_id', // 这里的字段名需要和Schema中指定键的ref匹配
      as: 'user_id_detail', // 自定义输出字段名
      pipeline: [
        {
          // 联表指定字段：0 不显示，1 显示
          $project: {
            _id: 0,
            user_id: 1,
            username: 1,
            nickname: 1,
            phone: 1,
            email: 1
          }
        }
      ]
    })
    query = query.unwind({
      path: '$user_detail', // 数组严禁使用unwind，会展开为单个对象
      preserveNullAndEmptyArrays: true // 必须开启，否则其他为空的数据项将不会被查询
    })

    // 筛选字段
    if (projection) query = query.project(projection)

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
      msg: '订阅列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages
    }
  }

  /**
   * 新增 post - 权限 self
   * @param {Object} data - 请求参数
   * @property {String} data.user_id - 用户id
   * @property {String} data.subscription_plan - 套餐id
   */
  async subscriptionAdd(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.user_id)

    // 参数校验
    if (!isTruthy(data.subscription_plan)) ctx.throw(400, { msg: 'subscription_plan 必填' })

    // 套餐查询
    const onePlan = await app.model.VipPlan.findOne({ plan_id: data.subscription_plan })
    if (!onePlan) ctx.throw(400, { msg: '套餐不存在' })

    // 数据库连接
    const db = app.model.VipSubscription

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
   * @property {String} data.subscription_id - id
   */
  async subscriptionUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:subscription:update'])

    // 参数校验
    if (!isTruthy(data.subscription_id)) ctx.throw(400, { msg: 'subscription_id 必填' })

    // 查询条件处理
    const conditions = { subscription_id: data.subscription_id }

    // 数据库连接
    const db = app.model.VipSubscription

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
   * @property {String} data.subscription_id - id
   */
  async subscriptionDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:subscription:delete'])

    // 参数校验
    if (!isTruthy(data.subscription_id)) ctx.throw(400, { msg: 'subscription_id 必填' })

    // 查询条件处理
    const conditions = { subscription_id: data.subscription_id }

    // 数据库连接
    const db = app.model.VipSubscription

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
  async subscriptionBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['vip:subscription:batchdelete'])

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
    const db = app.model.VipSubscription

    // 主键
    const primaryKey = 'subscription_id'

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }

  /**
   * 批量更新 - 非api接口 仅提供内部调用
   * @param {Object} data - 请求参数
   * @property {Array} data.list 批量更新项
   */
  async planBatchUpdate(data) {
    const { ctx, app } = this

    // 参数处理
    data = Object.assign(
      {
        list: [],
        cover: true
      },
      data
    )

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' })
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' })

    // 数据库连接
    const db = app.model.VipSubscription

    // 主键
    const primaryKey = 'subscription_id'

    // 批量更新（覆盖）
    const res = await batchAdd(ctx, db, data, primaryKey)

    return {
      data: res?.data,
      msg: '批量更新成功',
      tip: res?.tip
    }
  }

  /**
   * 获取会员订阅明细 post - 权限 self
   * @param {Object} data - 请求参数
   * @property {Array} data.user_id - 用户uid
   */
  async subscriptionInfo(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.user_id)

    // 字段筛选
    const projection = {
      _id: 0,
      user_id_detail: 0,
      created_date: 0,
      updated_date: 0
    }
    // 查询用户订阅情况
    const subRes = await this.subscriptionList({ user_id: data.user_id, pagesize: -1 }, projection)
    const mySubscription = subRes.data || []

    const result = this.vipVerify(mySubscription, (e) => {
      this.subscriptionUpdate({ subscription_id: e.subscription_id, status: 2 }) // 失效处理
    })

    // 批量更新用户订阅列表
    if (isTruthy(result?.subscription, 'arr')) {
      this.planBatchUpdate({ list: result?.subscription })
    }

    return {
      data: result,
      msg: '订阅信息获取成功'
    }
  }

  /**
   * 会员验证处理 - 非api接口 仅提供内部调用
   * @param {Array} list 订阅列表
   * @param {Function} decb 失效回调
   * @returns {Object} result - 处理结果
   * @property {Boolean} result.vip - 是否为会员
   * @property {Array} result.subscription - 订阅列表
   * @property {Object} result.current - 当前正生效的订阅
   * @property {Number} result.expire - 过期时间戳
   */
  vipVerify(list, decb) {
    let result = { vip: false }
    const now = Date.now() // 当前时间戳

    // 过滤订阅列表，0-待生效 1-生效中 2-已失效
    let filteredList = list.filter((sub) => [0, 1].includes(sub.status))
    if (!filteredList.length) return result // 无订阅

    // 根据有效天数及状态排序订阅列表优先级
    filteredList.sort((a, b) => {
      // 首先降序比较 valid_day
      if (b.subscription_plan_detail.valid_day !== a.subscription_plan_detail.valid_day) {
        return b.subscription_plan_detail.valid_day - a.subscription_plan_detail.valid_day
      }
      // 如果 valid_day 相同，则降序比较 status，确保天数相同的情况下，正在生效的优先级更高
      return b.status - a.status
    })

    // 优先级最高项
    const first = filteredList[0]

    // 检查是否有正在生效的项
    const findStatus1Index = filteredList.findIndex((item) => item.status === 1)
    if (findStatus1Index !== -1) {
      // 有正在生效的项

      // 对当前正在生效的项进行判断是否过期
      if (filteredList[findStatus1Index].start_date + filteredList[findStatus1Index].duration_time < now) {
        // 如果过期，那么这一项状态需改为2，表示失效了
        filteredList[findStatus1Index].status = 2
        // 失效回调处理，一般需要修改数据库中该订阅项状态
        if (decb) decb(filteredList[findStatus1Index])
        // 然后递归自己，参数为新的列表filteredList
        return this.vipVerify(filteredList)
      }

      // 特别是正在生效的项不是优先级最高的订阅的情况
      if (findStatus1Index !== 0) {
        // 此时需要暂停这个订阅
        filteredList[findStatus1Index].status = 0
        // 重新计算该订阅剩余时间
        const hadspend = now - filteredList[findStatus1Index].start_date // 已经消耗的时长
        filteredList[findStatus1Index].duration_time -= hadspend // 更新剩余时长

        // 然后让优先级最高的生效
        first.status = 1
        first.start_date = first.subscription_date
      }
    } else {
      // 没有正在生效的项

      // 优先级最高项更新为正在生效
      first.status = 1
      first.start_date = first.subscription_date
    }

    // 依次更新除了当前生效最高级的订阅以外，剩下所有订阅的start_date
    for (let i = 1; i < filteredList.length; i++) {
      filteredList[i].start_date = filteredList[i - 1].start_date + filteredList[i - 1].duration_time
    }

    result.vip = true
    result.subscription = filteredList
    result.current = first
    // 整个订阅列表的过期时间即为最后一个订阅的过期时间
    result.expire = filteredList[filteredList.length - 1].start_date + filteredList[filteredList.length - 1].duration_time

    return result
  }
}

module.exports = VipSubscriptionService
