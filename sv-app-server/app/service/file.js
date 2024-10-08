'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class FileService extends Service {
  /**
   * 单文件上传 - 非api接口 仅提供内部调用
   * @param {Array} files 上传的文件列表
   * @param {String} fieldname file请求时指定文件字段名
   * @param {String} keyBase 文件基础路径
   * @return 上传结果
   */
  async singleUpload(files, fieldname, keyBase) {
    const { ctx, app } = this

    // 指定文件读取
    const file = files.find((item) => item.fieldname == fieldname)
    const fileKey = keyBase + file.filename

    const fileRes = await app.fullQiniu.uploadFile(fileKey, file.filepath)
    if (!fileRes.ok) return ctx.throw(400, { msg: '上传失败', errMsg: fileRes })

    // 删除不必要字段
    delete fileRes.ok

    return fileRes
  }

  /**
   * 多文件上传 - 非api接口 仅提供内部调用
   * @param {Array} files 上传的文件列表
   * @param {String} fieldname file请求时指定文件字段名
   * @param {String} keyBase 文件基础路径
   * @return 上传结果
   */
  async multipleUpload(files, fieldname, keyBase) {
    const { ctx, app } = this

    // 指定文件读取
    const fileList = files.filter((item) => item.fieldname == fieldname)
    const filePromises = fileList.map((file) => {
      // 文件key = 要存储的文件夹路径 + 唯一的文件名
      const fileKey = keyBase + file.filename
      return app.fullQiniu.uploadFile(fileKey, file.filepath).then((fileRes) => {
        if (!fileRes.ok) {
          throw new Error(`文件 ${file.filename} 上传失败: ${fileRes.err}`)
        }
        return fileRes // 成功时返回结果
      })
    })

    try {
      const results = await Promise.all(filePromises)
      // 删除不必要字段
      results.forEach((item) => {
        delete item.ok
      })
      return results
    } catch (error) {
      return ctx.throw(400, { msg: error.message, errMsg: error.message })
    }
  }

  /**
   * 头像上传 post - 权限 needlogin
   * @description 前端需要使用FormData进行请求，请求头'Content-Type': 'multipart/form-data'
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数
   * @property {String} data.platform 平台：client | admin
   */
  async avatarUpload({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('needlogin')

    const userid = ctx.userInfo.user_id
    if (!userid) ctx.throw(400, { msg: '用户信息错误' })

    // 文件key = 要存储的文件夹路径 + 唯一的文件名
    const keyBase = `userfiles/${userid}/avatar/${Date.now()}-`

    const fileRes = await this.singleUpload(files, 'avatar', keyBase)

    // 客户端需立即更新用户头像数据
    if (data?.platform == 'client') {
      await ctx.service.sysUser.userUpdateSimple({
        user_id: userid,
        avatar: fileRes
      })
    }

    return {
      data: fileRes,
      msg: '上传成功'
    }
  }

  /**
   * 文件删除 post - 权限 self
   * @param {Object} data - 请求参数
   * @property {String} data.username 当前用户
   * @property {String} data.key 要删除的文件key
   * @return
   */
  async myfileDelete(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })
    if (!isTruthy(data.key)) ctx.throw(400, { msg: 'key 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.user_id)

    const deleteRes = await app.fullQiniu.delete(data.key)

    if (!deleteRes.ok) ctx.throw(400, { msg: '删除失败', errMsg: deleteRes })

    return {
      data: deleteRes,
      msg: '删除成功'
    }
  }

  /**
   * 删除用户文件 post - 权限 admin
   * @description 高危操作，仅限超级管理员权限
   * @param {Object} data - 请求参数
   * @property {String} data.user_id 要删除的用户id
   */
  async userfilesDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('admin')

    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    const listRes = await app.fullQiniu.listPrefix({
      prefix: `userfiles/${data.user_id}/`
    })
    const keys = listRes.items.map((item) => item.key)
    const batchDeleteRes = await app.fullQiniu.batchDelete(keys)

    return {
      data: {
        list: listRes.items,
        batchDelete: batchDeleteRes.list
      }
    }
  }

  /**
   * 版本资源包上传 post - 权限 permission
   * @description 前端需要使用FormData进行请求，请求头'Content-Type': 'multipart/form-data'
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数
   * @property {String} data.version 版本号
   */
  async releaseUpload({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['file:release:upload'])

    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })

    const keyBase = `release/${data.version}/`

    const fileRes = await this.singleUpload(files, 'file', keyBase)

    return {
      data: fileRes,
      msg: '上传成功'
    }
  }

  /**
   * 版本截图上传 post - 权限 permission
   * @description 前端需要使用FormData进行请求，请求头'Content-Type': 'multipart/form-data'
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数
   * @property {String} data.version 版本号
   */
  async releaseImageUpload({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['file:release:upload'])

    // 参数校验
    if (!isTruthy(data.version)) ctx.throw(400, { msg: 'version 必填' })

    // 基础路径
    const keyBase = `release/${data.version}/images/`

    const fileRes = await this.multipleUpload(files, 'files', keyBase)

    return {
      data: fileRes,
      msg: '上传成功'
    }
  }

  /**
   * 反馈截图上传 post - 权限 self
   * @description 前端需要使用FormData进行请求，请求头'Content-Type': 'multipart/form-data'
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数
   * @property {String} data.type 反馈类型
   */
  async feedbackImageUpload({ data, files }) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.user_id)

    // 参数校验
    if (!isTruthy(data.type)) ctx.throw(400, { msg: 'type 必填' })

    // 基础路径
    const keyBase = `feedback/${data.type}/${data.user_id}/`

    const fileRes = await this.multipleUpload(files, 'files', keyBase)

    return {
      data: fileRes,
      msg: '上传成功'
    }
  }

  /**
   * 富文本中图片上传 post - 权限 open
   * @description 前端需要使用FormData进行请求，请求头'Content-Type': 'multipart/form-data'
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数
   */
  async editorImgUpload({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 基础路径
    const keyBase = `editor/`

    const fileRes = await this.singleUpload(files, 'file', keyBase)

    return {
      data: fileRes,
      msg: '上传成功'
    }
  }
}

module.exports = FileService
