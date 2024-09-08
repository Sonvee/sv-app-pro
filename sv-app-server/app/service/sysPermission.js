'use strict'

const { isTruthy } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')
const ExcelJS = require('exceljs')

const Service = require('egg').Service

class SysPermissionService extends Service {
  /**
   * 查询 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.permission_id - id
   * @property {String} data.permission_name - 名称
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

    return {
      data: res?.data,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
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

    // 创建一个新的工作簿对象
    const workbook = new ExcelJS.Workbook()
    // 添加一个新的工作表
    const worksheet = workbook.addWorksheet('Sheet 1')
    // 添加表头
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'Message', key: 'message', width: 50 }
    ]
    // 填充数据
    const data = [
      { id: 1, name: 'John Doe', message: 'Hello World' }
      // 更多数据...
    ]
    data.forEach((rowData) => {
      worksheet.addRow(rowData)
    })
    // 设置响应类型为Excel文件
    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition,download-filename')
    // 设置正确的Content-Disposition响应头
    const fileName = 'permission_excel_template'
    ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${fileName}.xlsx`)

    const buffer = await workbook.xlsx.writeBuffer()

    try {
      // 将工作簿内容写入Buffer
      const buffer = await workbook.xlsx.writeBuffer()
      return {
        type: 'buffer', // 注明类型为二进制文件
        data: buffer
      }
    } catch (error) {
      ctx.throw(500, { msg: '下载模板失败', errMsg: error })
    }
  }
}

module.exports = SysPermissionService
