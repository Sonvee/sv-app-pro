'use strict'

const { isTruthy } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')
const useExcel = require('../utils/excel')

const Service = require('egg').Service

class SysPermissionService extends Service {
  /**
   * 查询 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.permission_id - id
   * @property {String} data.permission_name - 名称
   * @property {Number} data.status - 状态
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async permissionList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:query'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.permission_id)) conditions.permission_id = data.permission_id
    if (isTruthy(data.permission_name)) conditions.permission_name = { $regex: data.permission_name, $options: 'i' } // 模糊查询
    if (isTruthy(data.status, 'zero')) conditions.status = data.status

    // 数据库连接
    const db = app.model.SysPermission

    // 查询
    let query = db.find(conditions)

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

    // 开启lean（聚合查询无需开启）
    query = query.lean()

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
   * @property {String} data.permission_id - id
   * @property {String} data.permission_name - 名称
   * @property {Number} data.sort - 排序
   * @property {String} data.remark - 备注
   */
  async permissionAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:add'])

    // 参数校验
    if (!isTruthy(data.permission_id)) ctx.throw(400, { msg: 'permission_id 必填' })
    if (!isTruthy(data.permission_name)) ctx.throw(400, { msg: 'permission_name 必填' })

    // 查询条件处理
    const conditions = { permission_id: data.permission_id }

    // 数据库连接
    const db = app.model.SysPermission

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
   * @property {String} data.permission_id - id
   * @property {String} data.permission_name - 名称
   * @property {Number} data.sort - 排序
   */
  async permissionUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:update'])

    // 参数校验
    if (!isTruthy(data.permission_id)) ctx.throw(400, { msg: 'permission_id 必填' })

    // 查询条件处理
    const conditions = { permission_id: data.permission_id }

    // 数据库连接
    const db = app.model.SysPermission

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
   * @property {String} data.permission_id - id
   */
  async permissionDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:delete'])

    // 参数校验
    if (!isTruthy(data.permission_id)) ctx.throw(400, { msg: 'permission_id 必填' })

    // 查询条件处理
    const conditions = { permission_id: data.permission_id }

    // 数据库连接
    const db = app.model.SysPermission

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
  async permissionBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:batchadd'])

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
    const db = app.model.SysPermission

    // 主键
    const primaryKey = 'permission_id'

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
  async permissionBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:batchdelete'])

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
    const db = app.model.SysPermission

    // 主键
    const primaryKey = 'permission_id'

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
  async permissionExcelTemplate() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:excel'])

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '权限ID', key: 'permission_id', width: 40 },
      { header: '权限名称', key: 'permission_name', width: 40 },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = [
      { sort: 0, permission_id: 'sys:user:query', permission_name: '用户查询', status: 1, remark: '备注1' },
      { sort: 1, permission_id: 'sys:role:query', permission_name: '角色查询', status: 1, remark: '备注2' }
    ]

    try {
      const options = { columns, data: tableData, fileName: 'permission_excel_template' }
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
  async permissionImport({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:excel'])

    // 参数校验
    if (!isTruthy(files, 'arrobj')) ctx.throw(400, { msg: 'files 为空' })

    // 表头（严格对应列匹配）：column对应列，name对应名称，field对应字段键名，type对应类型（只标注number、boolean、timestamp，其他按字符串处理）
    const header = [
      { column: 'A', name: '序号', field: 'sort', type: 'number' },
      { column: 'B', name: '权限ID', field: 'permission_id' },
      { column: 'C', name: '权限名称', field: 'permission_name' },
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
    const impRes = await this.permissionBatchAdd(addParams)

    return impRes
  }

  /**
   * excel导出 post - 权限 permission
   * @param {Object} data 请求参数
   */
  async permissionExport(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:permission:excel'])

    const listRes = await this.permissionList(data)

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '权限ID', key: 'permission_id', width: 40 },
      { header: '权限名称', key: 'permission_name', width: 40 },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = listRes.data

    try {
      const options = { columns, data: tableData, fileName: 'permission_list' }
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

module.exports = SysPermissionService
