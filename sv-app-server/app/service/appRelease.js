'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class AppReleaseService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {Array} data.release_range - 发布日期范围
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async releaseList(data) {
    const { ctx, app } = this

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 数据库连接
    const db = app.model.AppRelease

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.version)) conditions.version = data.version
    if (isTruthy(data.release_range, 'arr')) conditions.release_date = { $gte: data.release_range[0], $lte: data.release_range[1] } // 时间范围

    // 查询操作
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ version: -1 })

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
   * 查询 get - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   */
  async releaseLatest(data) {
    const { ctx, app } = this

    // 数据库连接
    const db = app.model.AppRelease

    // 查询操作
    let query = db.findOne()

    // 排序：1升序，-1降序
    query = query.sort({ version: -1 })

    // 处理查询结果
    const res = await query.exec()

    return {
      data: res,
      msg: '最新版本获取成功'
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {String} data.file - 版本文件
   */
  async releaseAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseAdd'])

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })
    if (!isTruthy(data.file, 'obj')) ctx.throw(400, { msg: 'file 必填' })

    // 数据库连接
    const db = app.model.AppRelease

    // 查询条件处理
    const conditions = { version: data.version }

    const one = await db.findOne(conditions)
    if (one) ctx.throw(400, { msg: '版本已存在' })

    const res = await db.create(data)

    return {
      data: res,
      msg: '版本发布成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   * @property {String} data.file - 版本文件
   * @property {String} data.description - 版本描述
   * @property {Boolean} data.is_mandatory - 是否强制更新
   * @property {Date} data.release_date - 发布日期
   */
  async releaseUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseUpdate'])

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })

    // 数据库连接
    const db = app.model.AppRelease

    // 查询条件处理
    const conditions = { version: data.version }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新版本不存在' })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    return {
      data: res,
      msg: '版本更新成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.version - 版本
   */
  async releaseDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseDelete'])

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })

    // 数据库连接
    const db = app.model.AppRelease

    // 查询条件处理
    const conditions = { version: data.version }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '版本不存在或已被删除' })

    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: '版本删除成功'
    }
  }

  /**
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认false
   */
  async releaseBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseBatchAdd'])

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
    const db = app.model.AppRelease

    // 主键
    const primaryKey = 'version'

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
   * @property {Array} data.list - 批量删除项
   */
  async releaseBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['releaseBatchDelete'])

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
    const db = app.model.AppRelease
    // 主键
    const primaryKey = 'version'

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
}

module.exports = AppReleaseService
