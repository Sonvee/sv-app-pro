'use strict'

const { isTruthy } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')
const useExcel = require('../utils/excel')

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
    if (limit) ctx.checkAuthority('permission', ['sys:role:query'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.role_id, 'arr')) conditions.role_id = Array.isArray(data.role_id) ? { $in: data.role_id } : data.role_id // 支持多选
    if (isTruthy(data.role_name)) conditions.role_name = { $regex: data.role_name, $options: 'i' } // 模糊查询

    // 数据库连接
    const db = app.model.SysRole

    // 聚合联表查询
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

    // 聚合查询无需开启Lean

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

    // 权限校验
    ctx.checkAuthority('open')

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
    ctx.checkAuthority('permission', ['sys:role:add'])

    // 参数校验
    if (!isTruthy(data.role_id)) ctx.throw(400, { msg: 'role_id 必填' })
    if (!isTruthy(data.role_name)) ctx.throw(400, { msg: 'role_name 必填' })

    // 查询条件处理
    const conditions = { role_id: data.role_id }

    // 数据库连接
    const db = app.model.SysRole

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
   * @property {String} data.role_id - id
   * @property {String} data.role_name - 名称
   * @property {Array} data.permissions - 权限
   * @property {Number} data.sort - 排序
   * @property {String} data.remark - 备注
   */
  async roleUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:update'])

    // 参数校验
    if (!isTruthy(data.role_id)) ctx.throw(400, { msg: 'role_id 必填' })

    // 查询条件处理
    const conditions = { role_id: data.role_id }

    // 数据库连接
    const db = app.model.SysRole

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
   * @property {String} data.role_id - id
   */
  async roleDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:delete'])

    // 参数校验
    if (!isTruthy(data.role_id)) ctx.throw(400, { msg: 'role_id 必填' })

    // 查询条件处理
    const conditions = { role_id: data.role_id }

    // 数据库连接
    const db = app.model.SysRole

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
   * @property {Array} data.list - 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认false
   */
  async roleBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:batchadd'])

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

    // 批量添加
    const res = await batchAdd(ctx, db, data, primaryKey)

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
   * @property {Array} data.list - 批量删除项
   */
  async roleBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:batchdelete'])

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

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    return {
      msg: '批量删除成功',
      tip: `共删除${deletedCount}条记录`
    }
  }

  /**
   * excel模板下载 get - 权限 permission
   */
  async roleExcelTemplate() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:excel'])

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '角色ID', key: 'role_id', width: 40 },
      { header: '角色名称', key: 'role_name', width: 40 },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = [
      { sort: 0, role_id: 'admin', role_name: '超级管理员', status: 1, remark: '超级管理员拥有所有权限' },
      { sort: 1, role_id: 'master', role_name: '管理员', status: 1, remark: '管理员备注' }
    ]

    try {
      const options = { columns, data: tableData, fileName: 'role_excel_template' }
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
  async roleImport({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:excel'])

    // 参数校验
    if (!isTruthy(files, 'arrobj')) ctx.throw(400, { msg: 'files 为空' })

    // 表头（严格对应列匹配）：column对应列，name对应名称，field对应字段键名，type对应类型（只标注number、boolean，其他按字符串处理）
    const header = [
      { column: 'A', name: '序号', field: 'sort', type: 'number' },
      { column: 'B', name: '角色ID', field: 'role_id' },
      { column: 'C', name: '角色名称', field: 'role_name' },
      { column: 'D', name: '状态', field: 'status', type: 'number' },
      { column: 'E', name: '备注', field: 'remark' }
    ]
    // 解析成JSON数据
    const jsondata = await useExcel().readExcelFilesToJson(files, header)

    // 导入数据
    const addParams = {
      list: jsondata,
      cover: isTruthy(data.cover, 'strbo') // 经过formdata处理后会自动转为字符串，需要解析一下
    }
    const impRes = await this.roleBatchAdd(addParams)

    return impRes
  }

  /**
   * excel导出 post - 权限 permission
   * @param {Object} data 请求参数
   */
  async roleExport(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:role:excel'])

    const listRes = await this.roleList(data)

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '角色ID', key: 'role_id', width: 40 },
      { header: '角色名称', key: 'role_name', width: 40 },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = listRes.data

    try {
      const options = { columns, data: tableData, fileName: 'role_list' }
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

module.exports = SysRoleService
