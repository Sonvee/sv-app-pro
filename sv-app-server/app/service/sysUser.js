'use strict'

const Service = require('egg').Service
const crypto = require('crypto')
const { isTruthy } = require('../utils')
const useRegExp = require('../utils/regexp')

class SysUserService extends Service {
  /**
   * 查询 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data._id - id
   * @property {String} data.username - 用户名
   * @property {String} data.nickname - 昵称
   * @property {String} data.phone - 手机号
   * @property {String} data.email - 邮箱
   * @property {String} data.login_ip - 登录IP
   * @property {String} data.login_platform - 登录平台
   * @property {String} data.register_ip - 注册IP
   * @property {String} data.register_platform - 注册平台
   * @property {Number} data.status - 状态
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async userList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['userList'])

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 错误参数处理
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data._id)) conditions._id = data._id
    if (isTruthy(data.username)) conditions.username = data.username
    if (isTruthy(data.nickname)) conditions.nickname = { $regex: data.nickname, $options: 'i' } // 模糊查询
    if (isTruthy(data.phone)) conditions.phone = data.phone
    if (isTruthy(data.email)) conditions.email = data.email
    if (isTruthy(data.login_ip)) conditions.login_ip = data.login_ip
    if (isTruthy(data.login_platform)) conditions.login_platform = data.login_platform
    if (isTruthy(data.register_ip)) conditions.register_ip = data.register_ip
    if (isTruthy(data.register_platform)) conditions.register_platform = data.register_platform
    if (isTruthy(data.status, 'zero')) conditions.status = Number(data.status)

    // 筛选字段：0 隐藏，1 显示
    const projection = {
      password: 0,
      realname_auth: 0,
      token: 0,
      third_party: 0,
      updated_date: 0,
      wx_unionid: 0,
      created_date: 0,
      wx_openid: 0
    }

    // 查询操作
    let query = db.find(conditions, projection)

    // 排序：1升序，-1降序
    query = query.sort({ created_date: -1 }) // 按照创建时间倒序

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
      msg: '获取用户列表成功',
      total: count,
      pagenum,
      pagesize,
      pages
    }
  }

  /**
   * 获取用户自身信息 get - 权限 needlogin
   * @description 直接从token中获取用户_id
   */
  async userSelf() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('needlogin')

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = { _id: ctx.userInfo._id }

    const self = await db.findOne(conditions)
    if (!self) ctx.throw(400, { msg: '用户不存在' })

    return {
      data: self,
      msg: '获取信息成功'
    }
  }

  /**
   * 用户全信息更新（非客户端调用） post - 权限 admin
   * 该接口可自由修改指定用户信息(除username)，慎用。若只需修改部分简单信息，请使用 userUpdateSimple(可修改username)
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名 作为主键 不可更改
   * @property {any} - 更多详见model
   */
  async userUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('admin')

    // 参数处理
    data = Object.assign(
      {
        username: '',
        status: 1,
        gender: 0,
        score: 0
      },
      data
    )

    data.status = Number(data.status)
    data.gender = Number(data.gender)
    data.score = Number(data.score)

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: 'username 必填' })

    // 数据库连接
    const db = app.model.SysUser

    // 角色校验
    if (data.role?.indexOf('admin') > -1) {
      // 除自己外如果还存在admin则不能再设admin角色
      const administrator = await db.findOne({ role: { $in: ['admin'] } })
      if (administrator && administrator.username !== data.username) {
        return ctx.throw(400, { msg: '已存在admin，无法再创建admin角色' })
      }
    }

    // 查询条件处理
    const conditions = { username: data.username }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新项不存在' })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    return {
      data: res,
      msg: '更新成功'
    }
  }

  /**
   * 用户简单信息更新 post - 权限 self_id
   * @description 修改信息之后必须再请求刷新token
   * @param {Object} data - 请求参数
   * @property {String} data._id - id主键
   * @property {String} data.username - 用户名
   * @property {String} data.nickname - 昵称
   * @property {Object} data.avatar - 头像
   * @property {String} data.phone - 手机号
   * @property {String} data.email - 邮箱
   * @property {Number} data.gender - 性别
   * @property {Date} data.birthday - 生日
   * @property {String} data.comment - 备注
   * @property {Array} data.tags - 备注
   */
  async userUpdateSimple(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('self_id', data._id)

    // 参数校验
    if (!isTruthy(data._id)) ctx.throw(400, { msg: '_id 必填' })

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = { _id: data._id }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新项不存在' })

    // 用户名合法性校验
    if (isTruthy(data.username)) {
      const usernameRegExp = useRegExp('username')
      if (!usernameRegExp.regexp.test(data.username)) ctx.throw(400, { msg: usernameRegExp.msg })

      // 是否重复
      const userExist = await db.findOne({ username: data.username })
      if (userExist) ctx.throw(400, { msg: '用户名已存在' })
    }

    // 筛选字段：0 隐藏，1 显示
    const projection = {
      username: 1,
      nickname: 1,
      avatar: 1,
      phone: 1,
      email: 1,
      gender: 1,
      birthday: 1,
      comment: 1,
      tags: 1
    }

    // 更新项筛选
    let updatedata = {}
    // 只做projection中数据项更新，其他属性更新无效
    Object.keys(projection).forEach((item) => {
      if (isTruthy(data[item], 'zero')) {
        updatedata[item] = data[item]
      }
    })

    const res = await db.findOneAndUpdate(conditions, { $set: updatedata }, { new: true, projection })

    return {
      data: res,
      msg: '更新成功'
    }
  }

  /**
   * 修改密码 post - 权限 self_id
   * @param {Object} data - 请求参数
   * @property {String} data._id - 用户名
   * @property {String} data.old_password - 旧密码
   * @property {String} data.new_password - 新密码
   */
  async changePassword(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('self_id', data._id)

    // 参数校验
    if (!isTruthy(data._id)) ctx.throw(400, { msg: '_id 必填' })

    // 参数处理
    data = Object.assign(
      {
        old_password: '',
        new_password: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.old_password)) ctx.throw(400, { msg: 'old_password 必填' })
    if (!isTruthy(data.new_password)) ctx.throw(400, { msg: 'new_password 必填' })

    // 密码合法性校验
    const passwordRegExp = useRegExp('password')
    if (!passwordRegExp.regexp.test(data.new_password)) ctx.throw(400, { msg: passwordRegExp.msg })

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = { _id: data._id }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '用户不存在' })

    // 旧密码正确性校验
    data.old_password = crypto.createHash('sha256').update(data.old_password).digest('hex')
    if (data.old_password !== one.password) ctx.throw(400, { msg: '旧密码错误' })

    // 新密码加密
    data.new_password = crypto.createHash('sha256').update(data.new_password).digest('hex')

    const res = await db.findOneAndUpdate(conditions, { password: data.new_password }, { new: true })

    return {
      msg: '更新成功'
    }
  }

  /**
   * 修改状态 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名
   * @property {Number} data.status - 状态 0：注销，1：正常，2：封禁
   */
  async changeStatus(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['changeStatus'])

    // 参数处理
    data = Object.assign(
      {
        username: ''
      },
      data
    )
    data.status = Number(data.status)

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: 'username 必填' })
    if (!isTruthy(data.status, 'zero')) ctx.throw(400, { msg: 'status 必填' })

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = { username: data.username }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '用户不存在' })

    const res = await db.findOneAndUpdate(conditions, { status: data.status }, { new: true })

    return {
      msg: '更新成功'
    }
  }

  /**
   * 主动注销 post - 权限 self
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名
   */
  async userDeactivate(data) {
    const { ctx, app } = this

    // 参数处理
    data = Object.assign(
      {
        username: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: 'username 必填' })

    // 权限校验
    ctx.checkAuthority('self', data.username)

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = { username: data.username }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '用户不存在' })

    const res = await db.findOneAndUpdate(conditions, { status: 0 }, { new: true })

    return {
      msg: `${data.username} 注销成功`
    }
  }

  /**
   * 删除 post - 权限 admin
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名
   */
  async userDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('role', ['admin'])

    // 参数处理
    data = Object.assign(
      {
        username: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: 'username 必填' })

    // 数据库连接
    const db = app.model.SysUser

    // 查询条件处理
    const conditions = { username: data.username }

    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '删除项不存在' })

    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: '删除成功'
    }
  }
}

module.exports = SysUserService
