'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class FileService extends Service {
  /**
   * 头像上传 post - 权限 needlogin
   * @description 前端需要使用FormData进行请求，请求头'Content-Type': 'multipart/form-data'
   * @param {Array<File>} files 用户上传的文件
   */
  async avatarUpload(files) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('needlogin')

    const userid = ctx.userInfo._id
    if (!userid) ctx.throw(400, { msg: '用户信息错误' })

    const file = files[0]
    // 文件key = 要存储的文件夹路径 + 唯一的文件名
    const fileKey = `userfiles/${userid}/avatar/${Date.now()}-${file.filename}`

    let fileRes = await app.fullQiniu.uploadFile(fileKey, file.filepath)

    if (!fileRes.ok) ctx.throw(400, { msg: '上传失败', errMsg: fileRes })

    // 删除不必要字段
    delete fileRes.ok

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
   * @returns
   */
  async avatarDelete(data) {
    const { ctx, app } = this

    // 参数处理
    data = Object.assign(
      {
        username: '',
        key: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: 'username 必填' })
    if (!isTruthy(data.key)) ctx.throw(400, { msg: 'key 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.username)

    let deleteRes = await app.fullQiniu.delete(data.key)

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
   * @property {String} data._id 要删除的用户 _id
   */
  async userfilesDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('admin')

    if (!isTruthy(data._id)) ctx.throw(400, { msg: '用户 _id 必填' })

    let listRes = await app.fullQiniu.listPrefix({
      prefix: `userfiles/${data._id}/`
    })
    const keys = listRes.items.map((item) => item.key)
    let batchDeleteRes = await app.fullQiniu.batchDelete(keys)

    return {
      data: {
        list: listRes.items,
        batchDelete: batchDeleteRes.list
      }
    }
  }
}

module.exports = FileService
