'use strict'

const { isTruthy } = require('../utils')
const { batchDelete, batchAddX } = require('../utils/batch')
const useExcel = require('../utils/excel')

const Service = require('egg').Service

class SysDictitemService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.dict_type - 字典类型
   * @property {String} data.label - 键
   * @property {String} data.value - 值
   * @property {Number} data.status - 状态
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async dictitemList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 参数校验
    if (!isTruthy(data.dict_type)) ctx.throw(400, { msg: 'dict_type 必填' })

    // dict_type正确性校验
    const hasDict = await app.model.SysDict.findOne({ dict_id: data.dict_type })
    if (!hasDict) ctx.throw(400, { msg: `${data.dict_type} 不存在` })

    // 查询条件处理
    const conditions = { dict_type: data.dict_type }

    // 查询条件
    if (isTruthy(data.dict_type)) conditions.dict_type = data.dict_type
    if (isTruthy(data.label)) conditions.label = { $regex: data.label, $options: 'i' } // 模糊查询
    if (isTruthy(data.value)) conditions.value = { $regex: data.value, $options: 'i' } // 模糊查询
    if (isTruthy(data.status, 'zero')) conditions.status = data.status

    // 数据库连接
    const db = app.model.SysDictitem

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

    // redis缓存
    if (data.pagesize == -1 && isTruthy(data.dict_type)) {
      await app.redis.set(`dict:${data.dict_type}`, JSON.stringify(res))
    }

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
   * Redis查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.dict_type - 字典类型
   */
  async dictitemListByRedis(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.dict_type)) ctx.throw(400, { msg: 'dict_type 必填' })

    const dictRedis = await app.redis.get(`dict:${data.dict_type}`)

    // 直接从Redis中取
    if (dictRedis) {
      return {
        data: JSON.parse(dictRedis),
        msg: 'Redis字典列表获取成功'
      }
    }

    // 请求列表
    // 先查询字典状态
    const onedict = await app.model.SysDict.findOne({ dict_id: data.dict_type })
    if (!onedict) ctx.throw(400, { msg: `字典 ${data.dict_type} 不存在` })
    if (onedict.status != 1) ctx.throw(400, { msg: `字典 ${data.dict_type} 状态异常` })

    data.pagesize = -1
    data.status = 1
    const dictitemRes = await this.dictitemList(data)
    return {
      data: dictitemRes.data,
      msg: '字典列表获取成功'
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.dict_type - 字典类型
   * @property {String} data.label - 键
   * @property {String} data.value - 值
   * @property {String} data.remark - 备注
   * @property {Number} data.sort - 排序
   */
  async dictitemAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:add'])

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.dict_type)) ctx.throw(400, { msg: 'dict_type 必填' })
    if (!isTruthy(data.label)) ctx.throw(400, { msg: 'label 必填' })
    if (!isTruthy(data.value)) ctx.throw(400, { msg: 'value 必填' })

    // 绑定校验
    const hasDict = await app.model.SysDict.findOne({ dict_id: data.dict_type })
    if (!hasDict) ctx.throw(400, { msg: `${data.dict_type} 不存在` })

    // 数据库连接
    const db = app.model.SysDictitem

    // 新增
    const res = await db.create(data)

    // 删除redis缓存
    app.redis.del(`dict:${data.dict_type}`)

    return {
      data: res,
      msg: '新增成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.dictitem_id - 字典项id
   * @property {String} data.label - 键
   * @property {String} data.value - 值
   * @property {String} data.remark - 备注
   * @property {Number} data.sort - 排序
   */
  async dictitemUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:update'])

    // 参数校验
    if (!isTruthy(data.dictitem_id)) ctx.throw(400, { msg: 'dictitem_id 必填' })

    // 查询条件处理
    const conditions = { dictitem_id: data.dictitem_id }

    // 数据库连接
    const db = app.model.SysDictitem

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新项不存在' })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    // 删除redis缓存
    app.redis.del(`dict:${one.dict_type}`)

    return {
      data: res,
      msg: '更新成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.dictitem_id - 字典项id
   */
  async dictitemDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:delete'])

    // 参数校验
    if (!isTruthy(data.dictitem_id)) ctx.throw(400, { msg: 'dictitem_id 必填' })

    // 查询条件处理
    const conditions = { dictitem_id: data.dictitem_id }

    // 数据库连接
    const db = app.model.SysDictitem

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '删除项不存在或已被删除' })

    const res = await db.deleteOne(conditions)

    // 删除redis缓存
    app.redis.del(`dict:${one.dict_type}`)

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
  async dictitemBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:batchadd'])

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
    const db = app.model.SysDictitem

    // 主键
    const primaryKey = 'dictitem_id'
    // 副键
    const secondaryKey = 'dict_type'
    // 次键
    const tertiaryKey = 'label'

    const res = await batchAddX(ctx, db, data, primaryKey, secondaryKey, tertiaryKey)

    // 清空这些字典类型缓存，以重新更新
    res.existingTypes?.forEach((item) => {
      app.redis.del(`dict:${item}`)
    })

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
  async dictitemBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:batchdelete'])

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
    const db = app.model.SysDictitem

    // 主键
    const primaryKey = 'dictitem_id'

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
  async dictitemExcelTemplate() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:excel'])

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '字典类型', key: 'dict_type', width: 40 },
      { header: '字典项键', key: 'label', width: 40 },
      { header: '字典项值', key: 'value', width: 40 },
      { header: '标签样式', key: 'action_style', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = [
      { sort: 0, dict_type: 'dict_sys_request_status', label: '200', value: '200', action_style: 'success', status: 1, remark: 'request:ok' },
      { sort: 1, dict_type: 'dict_sys_request_status', label: '400', value: '400', action_style: 'danger', status: 1, remark: 'Bad Request' }
    ]

    try {
      const options = { columns, data: tableData, fileName: 'dictitem_excel_template' }
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
  async dictitemImport({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:excel'])

    // 参数校验
    if (!isTruthy(files, 'arrobj')) ctx.throw(400, { msg: 'files 为空' })

    // 表头（严格对应列匹配）：column对应列，name对应名称，field对应字段键名，type对应类型（只标注number、boolean、timestamp，其他按字符串处理）
    const header = [
      { column: 'A', name: '序号', field: 'sort', type: 'number' },
      { column: 'B', name: '字典类型', field: 'dict_type' },
      { column: 'C', name: '字典项键', field: 'label' },
      { column: 'D', name: '字典项值', field: 'value' },
      { column: 'E', name: '标签样式', field: 'action_style' },
      { column: 'F', name: '状态', field: 'status', type: 'number' },
      { column: 'G', name: '备注', field: 'remark' }
    ]
    // 解析成JSON数据
    const jsondata = await useExcel().readExcelFilesToJson(files, header)

    // 导入数据
    const addParams = {
      list: jsondata,
      cover: isTruthy(data.cover, 'strbo') // 经过formdata处理后会自动转为字符串，需要解析一下
    }
    const impRes = await this.dictitemBatchAdd(addParams)

    return impRes
  }

  /**
   * excel导出 post - 权限 permission
   * @param {Object} data 请求参数
   */
  async dictitemExport(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:dictitem:excel'])

    const listRes = await this.dictitemList(data)

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '字典类型', key: 'dict_type', width: 40 },
      { header: '字典项键', key: 'label', width: 40 },
      { header: '字典项值', key: 'value', width: 40 },
      { header: '标签样式', key: 'action_style', width: 20, style: { alignment: { horizontal: 'center' } } },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = listRes.data

    try {
      const options = { columns, data: tableData, fileName: 'dictitem_list' }
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

module.exports = SysDictitemService
