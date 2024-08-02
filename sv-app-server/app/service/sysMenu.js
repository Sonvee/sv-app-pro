'use strict'

const { isTruthy, removeNode } = require('../utils')

const Service = require('egg').Service

class SysMenuService extends Service {
  /**
   * 菜单权限处理器
   * @param {Array} list 获取的菜单列表
   * @returns {Array} 处理后的菜单列表
   */
  menuPermissionHandler(list) {
    const { ctx, app } = this
    let result = list
    // 菜单权限过滤
    const roles = ctx.userInfo.role
    const permissions = ctx.userInfo.permission
    if (!roles.includes('admin')) {
      let removeMenu = []
      removeMenu = list.filter((menu) => {
        if (!isTruthy(menu.permissions, 'arr')) {
          // 开放型菜单不做处理直接返回
          return false
        }
        // 获取所有不符合权限的菜单对象
        return menu.permissions.some((item) => !permissions.includes(item))
      })
      // 获取所有不符合权限的菜单name
      removeMenu = removeMenu.map((item) => item.name)
      // 删除权限不符合的节点与其子节点
      const { nodes } = removeNode(list, removeMenu)
      result = nodes
    }
    return result
  }

  /**
   * 查询 post - 权限 needlogin
   * @param {Object} data - 请求参数
   * @property {String} data.title - 路由标题
   */
  async menuList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('needlogin')

    // 数据库连接
    const db = app.model.SysMenu

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.name)) conditions.name = data.name
    if (isTruthy(data.title)) conditions['meta.title'] = { $regex: data.title, $options: 'i' } // 模糊查询

    // 查询操作
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ sort: 1 })

    // 处理查询结果
    let res = await query.exec()

    // 菜单权限过滤
    res = this.menuPermissionHandler(res)

    return {
      data: res,
      msg: '列表获取成功'
    }
  }

  /**
   * 菜单列表（redis缓存） get - 权限 needlogin
   * @description redis缓存中是菜单全列表，再根据权限自动过滤，在源menuList更新时需要及时更新redis缓存
   */
  async authMenuList() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('needlogin')

    let menuRedis = await app.redis.get('menu:admin:menulist')
    let menuList = []

    if (menuRedis) {
      // 权限过滤
      menuList = this.menuPermissionHandler(JSON.parse(menuRedis))
      return {
        data: menuList,
        msg: '菜单获取成功'
      }
    } else {
      // 获取全菜单列表
      const menuRes = await this.menuList({})
      // 缓存全菜单列表
      await app.redis.set('menu:admin:menulist', JSON.stringify(menuRes.data))
      // 权限过滤
      menuList = this.menuPermissionHandler(menuRes.data)
      return {
        data: menuList,
        msg: '列表获取成功'
      }
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.name - 路由 name
   * @property {String} data.path - 路由访问路径
   * @property {String} data.component - 视图文件路径
   * @property {String} data.parent_name - 父级路由 name
   * @property {Number} data.sort - 菜单排序
   * @property {String} data.redirect - 路由重定向地址
   * @property {Array} data.permission - 权限
   * @property {Object} data.meta - 路由元信息 详见model/sysMenu
   */
  async menuAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['menuAdd'])

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.name)) ctx.throw(400, { msg: 'name 必填' })
    if (!isTruthy(data.path)) ctx.throw(400, { msg: 'path 必填' })

    // 数据库连接
    const db = app.model.SysMenu

    // 查询条件处理
    const conditions = { name: data.name }

    const one = await db.findOne(conditions)
    if (one) ctx.throw(400, { msg: '新增项已存在' })

    const res = await db.create(data)

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      data: res,
      msg: '新增成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data._id - 主键_id
   * @property {String} data.name - 路由 name 注：父级name更新，子级parent_name同步更新
   * @property {String} data.path - 路由访问路径
   * @property {String} data.component - 视图文件路径
   * @property {String} data.parent_name - 父级路由 name
   * @property {Number} data.sort - 菜单排序
   * @property {String} data.redirect - 路由重定向地址
   * @property {Array} data.permission - 权限
   * @property {Object} data.meta - 路由元信息
   */
  async menuUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['menuUpdate'])

    // 参数处理
    data = Object.assign(
      {
        _id: '' // 需要使用_id作为主键
      },
      data
    )

    // 参数校验
    if (!isTruthy(data._id)) ctx.throw(400, { msg: '_id 必填' })

    // 数据库连接
    const db = app.model.SysMenu

    // 查询条件处理
    const conditions = { _id: data._id }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新项不存在' })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    // 父级name更新，子级parent_name同步更新
    if (data.name !== one.name) {
      await db.updateMany({ parent_name: one.name }, { $set: { parent_name: data.name } })
    }

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      data: res,
      msg: '更新成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @param {String} data.name - 路由 name 注：父级name删除，子级同步删除
   */
  async menuDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['menuDelete'])

    // 参数处理
    data = Object.assign(
      {
        name: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.name)) ctx.throw(400, { msg: 'name 必填' })

    // 数据库连接
    const db = app.model.SysMenu

    // 查询条件处理
    const conditions = { name: data.name }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '删除项不存在或已被删除' })

    /* 
    // 需要先查询菜单全量
    const query = db.find()
    // 处理查询结果
    const menuList = await query.exec()
    // 获取所有删除节点
    const { removedNames } = removeNode(menuList, [one.name])
    // 父级name删除，所有子级同步删除
    let res = await db.deleteMany({ name: { $in: removedNames } }) 
    */

    // 不做子节点同步删除，只做单点删除，父级删除后 子级会流落（无父级节点会自动挂载至根节点）
    let res = await db.deleteOne({ name: one.name })

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      data: res,
      msg: '删除成功'
    }
  }

  /**
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @param {Array} data.list - 批量新增项
   * @param {Boolean} data.cover - 是否覆盖 默认false
   */
  async menuBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['menuBatchAdd'])

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
    const db = app.model.SysMenu

    // 主键
    const primaryKey = 'name'

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

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      data: res,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
      tip
    }
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @param {Array} data.list - 批量删除项
   */
  async menuBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['menuBatchDelete'])

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
    const db = app.model.SysMenu
    // 主键
    const primaryKey = 'name'

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

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }
}

module.exports = SysMenuService
