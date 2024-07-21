'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class SysRoleService extends Service {
  /**
   * 查询 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array|String} data.role_id - id
   * @property {String} data.role_name - 名称
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   * @param {Boolean} limit - 是否开启权限约束 默认开启
   */
  async roleList(data, limit = true) {
    const { ctx, app } = this

    // 权限校验
    if (limit) ctx.checkAuthority('permission', ['roleList'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 数据库连接
    const db = app.model.SysRole

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.role_id, 'arr')) {
      if (Array.isArray(data.role_id)) {
        conditions.role_id = { $in: data.role_id }
      } else {
        conditions.role_id = data.role_id
      }
    }
    if (isTruthy(data.role_name)) conditions.role_name = { $regex: data.role_name, $options: 'i' } // 模糊查询

    // 聚合联表查询操作
    let query = db.aggregate([
      { $match: conditions },
      {
        // 联表
        $lookup: {
          from: 'sys_permissions', // 这里需要是集合名，不是模型名
          localField: 'permissions', // 这里的字段名需要和Schema中指定键名匹配
          foreignField: 'permission_id', // 这里的字段名需要和Schema中指定键的ref匹配
          as: 'permissions_detail', // 自定义输出字段名
          pipeline: [
            {
              // 联表指定字段：0 不显示，1 显示
              $project: {
                created_date: 0,
                updated_date: 0
              }
            }
          ]
        }
      },
      { $sort: { sort: 1 } } // 排序：1升序，-1降序
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
   * 根据角色查询权限 - 权限 open
   * @param {Array|String} role 角色列表
   */
  async findPermissionByRole(role) {
    const { ctx, app } = this

    // 参数类型转换
    if (typeof role === 'string') role = [role]

    // 错误参数处理
    if (typeof role !== 'string' && !Array.isArray(role)) ctx.throw(400, { msg: 'role 参数类型有误' })

    // 查询操作
    const { data: listdata } = await this.roleList({ role_id: role }, false) // 由于roleList设有权限，需要手动关闭约束
    // 获取所有权限并去重
    const allPermissions = listdata.flatMap((item) => item.permissions)
    const uniquePermissions = [...new Set(allPermissions)]

    return {
      data: uniquePermissions,
      msg: '查询成功'
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.role_id - id
   * @property {String} data.role_name - 名称
   * @property {Array} data.permissions - 权限
   * @property {Number} data.sort - 排序
   * @property {String} data.remark - 备注
   */
  async roleAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['roleAdd'])

    // 参数处理
    data = Object.assign(
      {
        role_id: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.role_id)) ctx.throw(400, { msg: 'role_id 必填' })
    if (!isTruthy(data.role_name)) ctx.throw(400, { msg: 'role_name 必填' })

    // 数据库连接
    const db = app.model.SysRole

    // 查询条件处理
    const conditions = { role_id: data.role_id }

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
   * @property {String} data.role_id - id
   * @property {String} data.role_name - 名称
   * @property {Array} data.permissions - 权限
   * @property {Number} data.sort - 排序
   * @property {String} data.remark - 备注
   */
  async roleUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['roleUpdate'])

    // 参数处理
    data = Object.assign(
      {
        role_id: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.role_id)) ctx.throw(400, { msg: 'role_id 必填' })

    // 数据库连接
    const db = app.model.SysRole

    // 查询条件处理
    const conditions = { role_id: data.role_id }

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
   * @property {String} data.role_id - id
   */
  async roleDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['roleDelete'])

    // 参数处理
    data = Object.assign(
      {
        role_id: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.role_id)) ctx.throw(400, { msg: 'role_id 必填' })

    // 数据库连接
    const db = app.model.SysRole

    // 查询条件处理
    const conditions = { role_id: data.role_id }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '删除项不存在' })

    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: '删除成功'
    }
  }

  /**
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认false
   */
  async roleBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['roleBatchAdd'])

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
    const db = app.model.SysRole

    // 主键
    const primaryKey = 'role_id'

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
  async roleBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['roleBatchDelete'])

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
    const db = app.model.SysRole
    // 主键
    const primaryKey = 'role_id'

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

module.exports = SysRoleService
