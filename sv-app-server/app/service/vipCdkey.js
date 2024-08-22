'use strict'

const dayjs = require('dayjs')
const { isTruthy } = require('../utils')
const { createCdkey } = require('../utils/cdkey')

const Service = require('egg').Service

class VipCdkeyService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.cdkey - 激活码
   * @property {String} data.cdkey_plan - 绑定套餐
   * @property {Number} data.status - 状态
   * @property {Array} data.valid_range - 有效期范围
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async cdkeyList(data) {
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
    if (isTruthy(data.cdkey)) conditions.cdkey = data.cdkey
    if (isTruthy(data.cdkey_plan)) conditions.cdkey_plan = data.cdkey_plan
    if (isTruthy(data.status, 'zero')) conditions.status = data.status
    if (isTruthy(data.valid_range, 'arr')) conditions.valid_range = { $gte: data.valid_range[0], $lte: data.valid_range[1] } // 时间范围

    // 数据库连接
    const db = app.model.VipCdkey

    // 聚合联表查询操作
    let query = db.aggregate([
      { $match: conditions },
      {
        // 联表
        $lookup: {
          from: 'vip_plans', // 这里需要是集合名，不是模型名
          localField: 'cdkey_plan', // 这里的字段名需要和Schema中指定键名匹配
          foreignField: 'plan_id', // 这里的字段名需要和Schema中指定键的ref匹配
          as: 'cdkey_plan_detail', // 自定义输出字段名
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
          path: '$cdkey_plan_detail',
          preserveNullAndEmptyArrays: true // 必须开启，否则其他为空的数据项将不会被查询
        }
      },
      { $sort: { valid_date: -1, created_date: -1 } } // 排序：1升序，-1降序
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
   * @property {String} data.cdkey - 激活码
   * @property {String} data.cdkey_plan - 绑定套餐
   * @property {Date} data.valid_date - 有效期至
   * @property {Number} data.num - 生成个数
   */
  async cdkeyAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cdkeyAdd'])

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.cdkey_plan)) ctx.throw(400, { msg: 'cdkey_plan 必填' })
    if (!isTruthy(data.valid_date)) ctx.throw(400, { msg: 'valid_date 必填' })

    // 判断生成个数是否为正整数
    const isPositiveInteger = (num) => {
      return Number.isInteger(+num) && +num > 0
    }
    if (!isPositiveInteger(data.num)) ctx.throw(400, { msg: '生成个数需为正整数' })

    // 自动生成激活码
    let cdkeyList = []
    for (let i = 0; i < data.num; i++) {
      cdkeyList.push({
        cdkey: createCdkey(),
        description: data?.description,
        cdkey_plan: data.cdkey_plan,
        valid_date: data.valid_date,
        status: 0
      })
    }

    // 数据库连接
    const db = app.model.VipCdkey

    // 使用 insertMany 批量插入数据
    const res = await db.insertMany(cdkeyList)

    return {
      data: res,
      msg: '激活码新增成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.cdkey - 激活码
   * @property {String} data.cdkey_plan - 绑定套餐
   */
  async cdkeyUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cdkeyUpdate'])

    // 参数校验
    if (!isTruthy(data.cdkey)) ctx.throw(400, { msg: 'cdkey 必填' })
    if (!isTruthy(data.cdkey_plan)) ctx.throw(400, { msg: 'cdkey_plan 必填' })

    // 查询条件处理
    const conditions = { cdkey: data.cdkey }

    // 数据库连接
    const db = app.model.VipCdkey

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
   * @property {String} data.cdkey - 激活码
   */
  async cdkeyDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cdkeyDelete'])

    // 参数校验
    if (!isTruthy(data.cdkey)) ctx.throw(400, { msg: 'cdkey 必填' })

    // 查询条件处理
    const conditions = { cdkey: data.cdkey }

    // 数据库连接
    const db = app.model.VipCdkey

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
   * 清除cdkey post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.status - 激活码
   */
  async cdkeyClear(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cdkeyClear'])

    // 参数校验
    if (!isTruthy(data.status, 'zero')) ctx.throw(400, { msg: 'status 必填' })

    // 查询条件处理
    const conditions = { status: data.status }

    // 数据库连接
    const db = app.model.VipCdkey

    // 查询
    const many = await db.find(conditions)
    if (!isTruthy(many, 'arrobj')) ctx.throw(400, { msg: '无匹配的清除项' })
    let res = await db.deleteMany(conditions)

    return {
      data: res,
      msg: '清除成功'
    }
  }

  /**
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认true
   */
  async cdkeyBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cdkeyBatchAdd'])

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
    const db = app.model.VipCdkey

    // 主键
    const primaryKey = 'cdkey'

    // 过滤掉主键缺失无效的项
    data.list = data.list.filter((item) => item[primaryKey])

    // 结果处理
    let res, tip
    if (data.cover) {
      // 覆盖模式：使用 upsert 更新或插入数据
      res = await Promise.all(
        data.list.map(async (item) => {
          try {
            return await db.findOneAndUpdate({ [primaryKey]: item[primaryKey] }, item, { upsert: true, new: true })
          } catch (error) {
            ctx.logger.warn(`Error updating or inserting item ${item[primaryKey]}:`, error)
            return null // 返回一个表示失败的特殊值
          }
        })
      )
    } else {
      // 增量模式：使用 insertMany 插入数据
      const existingIds = data.list.map((item) => item[primaryKey])
      const batchSize = app.config.batchAddSize || 1000 // 分批数量 app.config.batchAddSize 在 config.default.js 中配置
      const existingKeys = []

      // 分批处理，避免 $in 操作符中的元素过多，
      for (let i = 0; i < existingIds.length; i += batchSize) {
        const batchKeys = existingIds.slice(i, i + batchSize)
        const batchExistingItems = await db.find({ [primaryKey]: { $in: batchKeys } })
        existingKeys.push(...batchExistingItems.map((item) => item[primaryKey]))
      }

      if (existingKeys.length > 0) {
        tip = `已跳过存在项：${existingKeys.toString()}`
      }

      // 过滤掉已存在的记录
      const filteredItems = data.list.filter((item) => !existingKeys.includes(item[primaryKey]))

      try {
        res = await db.insertMany(filteredItems)
      } catch (error) {
        ctx.logger.error('Error during insertMany operation:', error)
        return ctx.throw(500, { msg: '服务器内部错误' })
      }
    }

    return {
      data: res,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
      tip
    }
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   */
  async cdkeyBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['cdkeyBatchDelete'])

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
    const db = app.model.VipCdkey

    // 主键
    const primaryKey = 'cdkey'

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
   * 激活cdkey post - 权限 self_id
   * @param {*} data
   */
  async cdkeyActive(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self_id', data.user_id)

    // 参数校验
    if (!isTruthy(data.cdkey)) ctx.throw(400, { msg: 'cdkey 必填' })

    // 查询条件处理
    const conditions = { cdkey: data.cdkey }

    const db = app.model.VipCdkey

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: 'CDKEY 不存在' })

    // 1. 获取当前用户信息
    const userdb = app.model.SysUser
    const oneUser = await userdb.findOne({ _id: data.user_id })
    if (!oneUser) ctx.throw(400, { msg: '用户不存在' })

    // 2. 判断cdkey是否正常 0:待使用 1:已使用 2:已失效
    const cdkeyRes = await this.cdkeyList({ cdkey: data.cdkey })
    const findCdkey = cdkeyRes.data[0]
    if (findCdkey.status !== 0) ctx.throw(400, { msg: 'cdkey 已使用或已失效' })

    // 3. 查询cdkey绑定的套餐
    const valid_day = findCdkey?.cdkey_plan_detail?.valid_day || 0 // 套餐有效天数
    const valid_time = valid_day * 24 * 60 * 60 * 1000 // 套餐有效毫秒数

    // 4. cdkey标记已使用
    await db.findOneAndUpdate({ cdkey: data.cdkey }, { status: 1 }, { new: true })

    // 5. 添加订阅记录

    return {
      msg: 'CDKEY 激活成功'
    }
  }
}

module.exports = VipCdkeyService
