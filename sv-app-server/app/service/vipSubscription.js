'use strict'

const { isTruthy } = require('../utils')
const { batchDelete } = require('../utils/batch')

const Service = require('egg').Service

class VipSubscriptionService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.subscription_id - id
   * @property {String} data.subscription_plan - 套餐id
   * @property {String} data.user_id - 用户id
   * @property {Number} data.status - 状态
   * @property {Number} data.type - 订阅类型
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async subscriptionList(data) {
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
    let query = db.aggregate([
      { $match: conditions },
      {
        // 联表
        $lookup: {
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
                valid_day: 1
              }
            }
          ]
        }
      },
      {
        // 数组严禁使用$unwind，会展开为单个对象
        $unwind: {
          path: '$subscription_plan_detail',
          preserveNullAndEmptyArrays: true // 必须开启，否则其他为空的数据项将不会被查询
        }
      },
      {
        // 联表
        $lookup: {
          from: 'sys_users', // 这里需要是集合名，不是模型名
          localField: 'user_id', // 这里的字段名需要和Schema中指定键名匹配
          foreignField: 'username', // 这里的字段名需要和Schema中指定键的ref匹配
          as: 'user_detail', // 自定义输出字段名
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
        }
      },
      {
        // 数组严禁使用$unwind，会展开为单个对象
        $unwind: {
          path: '$user_detail',
          preserveNullAndEmptyArrays: true // 必须开启，否则其他为空的数据项将不会被查询
        }
      },
      { $sort: { created_date: -1 } } // 排序：1升序，-1降序
    ])

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
   * @property {String} data.user_id - 用户id
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
   * 获取会员订阅明细
   * @param {Object} data - 请求参数
   * @property {Array} data.user_id - 用户uid
   */
  async subscriptionInfo(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.user_id)

    // const res = await this.subscriptionList({ pagesize: -1 })
    const list = [
      {
        subscription_id: '66d67effa0d6954219ff5b87', // 订阅id
        user_id: '66cd9ac53f5812ae3ceeedd4', // 用户id
        subscription_data: 1725333247907, // 订阅日期（时间戳 毫秒，并不一定代表从此刻开始计时，订阅开始的日期按照start_date计算得出）
        duration_time: 2592000000, // 套餐持续时长（毫秒）
        status: 0, // 0-待生效 1-生效中 2-已失效
        subscription_plan: 'vip_plan_month', // 套餐id
        subscription_plan_detail: {
          // 套餐详情
          plan_id: 'vip_plan_month',
          plan_name: '月卡',
          valid_day: 30
        }
      },
      {
        subscription_id: '66d67cf0394c5b5246e5f47f',
        user_id: '66cd9ac53f5812ae3ceeedd4',
        subscription_data: 1725332720692,
        duration_time: 604800000,
        status: 0,
        subscription_plan: 'vip_plan_week',
        subscription_plan_detail: {
          plan_id: 'vip_plan_week',
          plan_name: '周卡',
          valid_day: 7
        }
      },
      {
        subscription_id: '66ce7b3701f9b5eaeeff31dc',
        user_id: '66cd9ac53f5812ae3ceeedd4',
        subscription_data: 1724807991945,
        duration_time: 604800000,
        status: 0,
        subscription_plan: 'vip_plan_week',
        subscription_plan_detail: {
          plan_id: 'vip_plan_week',
          plan_name: '周卡',
          valid_day: 7
        }
      }
    ]

    const result = this.vipVerify(list, (e) => {
      // 失效处理
      // await db.findOneAndUpdate({ cdkey: data.cdkey }, { status: 2 }, { new: true }) // 标记失效状态
    })

    return {
      data: result
    }
  }

  /**
   * 会员验证处理
   * @param {Array} subscriptionList 订阅列表
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

    // 根据有效天数排序订阅列表优先级
    filteredList.sort((a, b) => b.subscription_plan_detail.valid_day - a.subscription_plan_detail.valid_day)

    // 优先级最高项
    const first = filteredList[0]

    // 检查是否有正在生效的项
    const findStatus1Index = filteredList.findIndex((item) => item.status === 1)
    if (findStatus1Index !== -1) {
      // 有正在生效的项

      // 如果正在生效的项都已经过期了
      if (filteredList[findStatus1Index].start_date + filteredList[findStatus1Index].duration_time < now) {
        // 那么这一项状态需改为2，表示失效了
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
        first.start_date = first.subscription_data

        // 依次更新除了当前生效最高级的订阅以外，剩下所有订阅的start_date
        for (let i = 1; i < filteredList.length; i++) {
          filteredList[i].start_date = filteredList[i - 1].start_date + filteredList[i - 1].duration_time
        }
      }
    } else {
      // 没有正在生效的项

      // 优先级最高项更新为正在生效
      first.status = 1
      first.start_date = first.subscription_data

      // 依次更新除了当前生效最高级的订阅以外，剩下所有订阅的start_date
      for (let i = 1; i < filteredList.length; i++) {
        filteredList[i].start_date = filteredList[i - 1].start_date + filteredList[i - 1].duration_time
      }
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
