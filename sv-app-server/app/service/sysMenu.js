'use strict'

const { isTruthy, removeNode } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')

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
    const roles = ctx.userInfo?.role || []
    const permissions = ctx.userInfo?.permission || []
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
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.name - 路由name
   * @property {String} data.title - 路由标题
   */
  async menuList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.name)) conditions.name = data.name
    if (isTruthy(data.title)) conditions['meta.title'] = { $regex: data.title, $options: 'i' } // 模糊查询

    // 数据库连接
    const db = app.model.SysMenu

    // 查询
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
   * 菜单列表（redis缓存） post - 权限 open
   * @description redis缓存中是菜单全列表，再根据权限自动过滤，在源menuList更新时需要及时更新redis缓存
   */
  async authMenuList() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    let menuRedis = await app.redis.get('menu:admin:menulist')
    let menuList = []

    if (menuRedis) {
      // 权限过滤
      menuList = this.menuPermissionHandler(JSON.parse(menuRedis))
    } else {
      // 获取全菜单列表
      const menuRes = await this.menuList({})
      // 缓存全菜单列表
      await app.redis.set('menu:admin:menulist', JSON.stringify(menuRes.data))
      // 权限过滤
      menuList = this.menuPermissionHandler(menuRes.data)
    }

    return {
      data: menuList,
      msg: '菜单获取成功'
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.menu_id - 主键 id
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
    ctx.checkAuthority('permission', ['sys:menu:add'])

    // 参数处理
    delete data.menu_id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.name)) ctx.throw(400, { msg: 'name 必填' })
    if (!isTruthy(data.path)) ctx.throw(400, { msg: 'path 必填' })

    // 查询条件处理
    const conditions = { name: data.name }

    // 数据库连接
    const db = app.model.SysMenu

    // 查询
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
   * @property {String} data.menu_id - 主键 id
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
    ctx.checkAuthority('permission', ['sys:menu:update'])

    // 参数校验
    if (!isTruthy(data.menu_id)) ctx.throw(400, { msg: 'menu_id 必填' })
    if (!isTruthy(data.name)) ctx.throw(400, { msg: 'name 必填' })
    if (!isTruthy(data.path)) ctx.throw(400, { msg: 'path 必填' })

    // 查询条件处理
    const conditions = { menu_id: data.menu_id }

    // 数据库连接
    const db = app.model.SysMenu

    // 查询
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
   * @param {String} data.name - 路由 name
   */
  async menuDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:menu:delete'])

    // 参数校验
    if (!isTruthy(data.name)) ctx.throw(400, { msg: 'name 必填' })

    // 查询条件处理
    const conditions = { name: data.name }

    // 数据库连接
    const db = app.model.SysMenu

    // 查询
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
    ctx.checkAuthority('permission', ['sys:menu:batchadd'])

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

    // 批量添加
    const res = await batchAdd(ctx, db, data, primaryKey)

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      data: res?.data,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
      tip: res?.tip
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
    ctx.checkAuthority('permission', ['sys:menu:batchdelete'])

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

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    // 删除redis缓存
    app.redis.del('menu:admin:menulist')

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }
}

module.exports = SysMenuService
