'use strict'

const { isTruthy, removeNode } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')
const useExcel = require('../utils/excel')

const Service = require('egg').Service

class SysMenuService extends Service {
  /**
   * 菜单权限处理器
   * @param {Array} list 获取的菜单列表
   * @return {Array} 处理后的菜单列表
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

    /**
     * 开启 Lean
     * @tutorial https://mongoosejs.com/docs/tutorials/lean.html
     * @tutorial https://runebook.dev/zh/docs/mongoose/tutorials/lean
     */
    query = query.lean()

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

    const menuRedis = await app.redis.get('menu:admin:menulist')
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
    const res = await db.deleteOne({ name: one.name })

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

    let msg = data.cover ? '批量覆盖添加成功' : '批量增量添加成功'
    if (!isTruthy(res?.data, 'arrobj')) msg += ' - 无有效数据项添加'

    return {
      data: res?.data,
      msg: msg,
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

  /**
   * excel模板下载 get - 权限 permission
   */
  async menuExcelTemplate() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:menu:excel'])

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '路由标识', key: 'name', width: 20 },
      { header: '父级路由标识', key: 'parent_name', width: 20 },
      { header: '图标', key: 'meta.icon', width: 40 },
      { header: '路由标题', key: 'meta.title', width: 30 },
      { header: '路由访问路径', key: 'path', width: 40 },
      { header: '视图文件路径', key: 'component', width: 40 },
      { header: '路由重定向地址', key: 'redirect', width: 40 },
      { header: '外链地址', key: 'meta.isLink', width: 40 },
      { header: '高亮菜单', key: 'meta.activeMenu', width: 40 },
      { header: '是否缓存', key: 'meta.isKeepAlive', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否隐藏', key: 'meta.isHide', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否子详情页面', key: 'meta.isSub', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否全屏', key: 'meta.isFull', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否固定', key: 'meta.isAffix', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否无需登录', key: 'meta.isOpen', width: 20, style: { alignment: { horizontal: 'center' } } }
    ]

    // 填充数据
    const tableData = [
      {
        name: 'home',
        path: '/home',
        component: '/home/index',
        parent_name: '',
        sort: 0,
        redirect: '',
        meta: {
          isOpen: false,
          icon: 'uni-icons-home-filled',
          title: '首页',
          isLink: '',
          activeMenu: '',
          isHide: false,
          isSub: false,
          isFull: false,
          isAffix: true,
          isKeepAlive: true
        }
      },
      {
        name: 'system',
        path: '/system',
        component: '',
        parent_name: '',
        sort: 500,
        redirect: '/system/user',
        meta: {
          isOpen: false,
          icon: 'admin-icons-fl-xitong',
          title: '系统模块',
          isLink: '',
          activeMenu: '',
          isHide: false,
          isSub: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        name: 'menu',
        path: '/system/menu',
        component: '/system/menu/index',
        parent_name: 'system',
        sort: 540,
        redirect: '',
        meta: {
          isOpen: false,
          icon: 'admin-icons-manager-menu',
          title: '菜单管理',
          isLink: '',
          activeMenu: '',
          isHide: false,
          isSub: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]

    try {
      const options = { columns, data: tableData, fileName: 'menu_excel_template' }
      const buffer = await useExcel().createWorkSheet(ctx, options)

      return {
        type: 'buffer', // 注明类型为二进制文件
        data: buffer
      }
    } catch (error) {
      ctx.throw(500, { msg: '下载模板失败', errMsg: error.message })
    }
  }

  /**
   * excel导入 post - 权限 permission
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数（经过FormData上传处理的参数像Boolean等类型会被自动转为字符串，需手动解析）
   */
  async menuImport({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:menu:excel'])

    // 参数校验
    if (!isTruthy(files, 'arrobj')) ctx.throw(400, { msg: 'files 为空' })

    // 表头（严格对应列匹配）：column对应列，name对应名称，field对应字段键名，type对应类型（只标注number、boolean、timestamp，其他按字符串处理）
    const header = [
      { column: 'A', name: '序号', field: 'sort', type: 'number' },
      { column: 'B', name: '路由标识', field: 'name' },
      { column: 'C', name: '父级路由标识', field: 'parent_name' },
      { column: 'D', name: '图标', field: 'meta.icon' },
      { column: 'E', name: '路由标题', field: 'meta.title' },
      { column: 'F', name: '路由访问路径', field: 'path' },
      { column: 'G', name: '视图文件路径', field: 'component' },
      { column: 'H', name: '路由重定向地址', field: 'redirect' },
      { column: 'I', name: '外链地址', field: 'meta.isLink' },
      { column: 'J', name: '高亮菜单', field: 'meta.activeMenu' },
      { column: 'K', name: '是否缓存', field: 'meta.isKeepAlive', type: 'boolean' },
      { column: 'L', name: '是否隐藏', field: 'meta.isHide', type: 'boolean' },
      { column: 'M', name: '是否子详情页面', field: 'meta.isSub', type: 'boolean' },
      { column: 'N', name: '是否全屏', field: 'meta.isFull', type: 'boolean' },
      { column: 'O', name: '是否固定', field: 'meta.isAffix', type: 'boolean' },
      { column: 'P', name: '是否无需登录', field: 'meta.isOpen', type: 'boolean' }
    ]
    // 解析成JSON数据
    const jsondata = await useExcel().readExcelFilesToJson(files, header)

    // 导入数据
    const addParams = {
      list: jsondata,
      cover: isTruthy(data.cover, 'strbo') // 经过formdata处理后会自动转为字符串，需要解析一下
    }
    const impRes = await this.menuBatchAdd(addParams)

    return impRes
  }

  /**
   * excel导出 post - 权限 permission
   * @param {Object} data 请求参数
   */
  async menuExport(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:menu:excel'])

    const listRes = await this.menuList(data)

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '路由标识', key: 'name', width: 20 },
      { header: '父级路由标识', key: 'parent_name', width: 20 },
      { header: '图标', key: 'meta.icon', width: 40 },
      { header: '路由标题', key: 'meta.title', width: 30 },
      { header: '路由访问路径', key: 'path', width: 40 },
      { header: '视图文件路径', key: 'component', width: 40 },
      { header: '路由重定向地址', key: 'redirect', width: 40 },
      { header: '外链地址', key: 'meta.isLink', width: 40 },
      { header: '高亮菜单', key: 'meta.activeMenu', width: 40 },
      { header: '是否缓存', key: 'meta.isKeepAlive', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否隐藏', key: 'meta.isHide', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否子详情页面', key: 'meta.isSub', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否全屏', key: 'meta.isFull', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否固定', key: 'meta.isAffix', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '是否无需登录', key: 'meta.isOpen', width: 20, style: { alignment: { horizontal: 'center' } } }
    ]

    // 填充数据
    const tableData = listRes.data

    try {
      const options = { columns, data: tableData, fileName: 'menu_list' }
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

module.exports = SysMenuService
