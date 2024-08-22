'use strict'

const Service = require('egg').Service
const crypto = require('crypto')
const { generateRandomCode, isTruthy, judgePlatform } = require('../utils')
const useRegExp = require('../utils/regexp')

class SysLoginService extends Service {
  /**
   * 登录成功处理 - 辅助函数
   * @param {Object} db - 数据库连接
   * @param {Object} conditions - 查询条件
   * @param {Object} one - 用户对象
   */
  async loginSuccess(db, conditions, one) {
    const { ctx, app } = this

    // 根据role获取权限列表
    const permissionRes = await ctx.service.sysRole.findPermissionByRole(one.role)

    // jwt数据
    const jwtData = {
      user_id: one.user_id,
      username: one.username,
      phone: one.phone,
      email: one.email,
      role: one.role,
      permission: permissionRes.data,
      status: one.status
    }

    // 更新token
    const token = app.jwt.sign(jwtData, app.config.jwt.secret, { expiresIn: app.config.jwt.expires })

    // 更新参数
    const updatedata = {
      token: token,
      login_date: Date.now(),
      login_ip: ctx.request.ip, // IP地址
      login_platform: judgePlatform(ctx)
    }

    // 移除部分无需返回字段
    const projection = {
      password: 0,
      token: 0, // token 已做出返回，此处返回用户信息时无需重复返回
      third_party: 0,
      wx_session_key: 0,
      realname_auth: 0,
      created_date: 0,
      updated_date: 0
    }

    // 查找更新数据
    const res = await db.findOneAndUpdate(conditions, updatedata, { new: true, projection })

    return { res, token }
  }

  /**
   * 登录 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名：此处可为用户名/手机号/邮箱
   * @property {String} data.password - 密码
   * @property {String} data.captcha - 验证码
   */
  async login(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    data = Object.assign(
      {
        username: '',
        password: '',
        captcha: ''
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: '请输入账号' })
    if (!isTruthy(data.password)) ctx.throw(400, { msg: '请输入密码' })
    if (!isTruthy(data.captcha)) ctx.throw(400, { msg: '请输入验证码' })

    // 验证码
    const ip = ctx.request.ip // IP地址
    const captcha_login = await app.redis.get(`captcha:${ip}:login:code`)
    if (!isTruthy(captcha_login)) ctx.throw(400, { msg: '验证码已失效，请刷新' })
    if (data.captcha.toLowerCase() != captcha_login.toLowerCase()) ctx.throw(400, { msg: '验证码错误' })

    // 查询条件处理
    const conditions = {}

    // 判断登录方式：用户名/手机号/邮箱
    if (useRegExp('phone').regexp.test(data.username)) {
      conditions.phone = data.username
    } else if (useRegExp('email').regexp.test(data.username)) {
      conditions.email = data.username
    } else {
      conditions.username = data.username
    }

    // 数据库连接
    const db = app.model.SysUser

    let one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '用户不存在' })

    // 密码校验
    data.password = crypto.createHash('sha256').update(data.password).digest('hex')
    if (data.password !== one.password) ctx.throw(400, { msg: '密码错误' })

    // 状态校验
    if (one.status !== 1) ctx.throw(400, { msg: '账号状态异常，请联系管理员' })

    // 通过校验，可以正常登录了
    const loginSuccessRes = await this.loginSuccess(db, conditions, one)

    return {
      data: loginSuccessRes.res,
      token: loginSuccessRes.token,
      msg: '登录成功'
    }
  }

  /**
   * 邮箱验证码登录 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.email - 邮箱
   * @property {String} data.captcha - 邮箱验证码
   */
  async loginByEmailer(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数校验
    if (!isTruthy(data.email)) ctx.throw(400, { msg: '请输入邮箱' })
    if (!isTruthy(data.captcha)) ctx.throw(400, { msg: '请输入验证码' })

    // 邮箱合法性校验
    const emailRegExp = useRegExp('email')
    if (!emailRegExp.regexp.test(data.email)) ctx.throw(400, { msg: emailRegExp.msg })

    // 验证码
    const captcha_login = await app.redis.get(`emailcaptcha:${data.email}:login:code`)
    if (!isTruthy(captcha_login)) ctx.throw(400, { msg: '邮箱验证码已失效，请刷新' })
    if (data.captcha.toLowerCase() != captcha_login.toLowerCase()) ctx.throw(400, { msg: '邮箱验证码错误' })

    // 查询条件处理
    const conditions = { email: data.email }

    // 数据库连接
    const db = app.model.SysUser

    // 查询
    let one = await db.findOne(conditions)

    // 第一次登录，自动创建用户
    if (!one) {
      // 初始化用户数据
      const userInfo = {
        username: `user_${generateRandomCode(8)}`,
        email: data.email, // 初始化 email
        role: ['user'],
        status: 1,
        gender: 0,
        score: 0,
        my_invite_code: generateRandomCode(10), // 10位随机码
        register_ip: ctx.request.ip, // IP地址
        register_date: Date.now(),
        register_platform: judgePlatform(ctx)
      }

      // 注册用户
      await db.create(userInfo)

      // 注册之后重新查询用户数据
      one = await db.findOne(conditions)
    }

    // 状态校验
    if (one.status !== 1) ctx.throw(400, { msg: '账号状态异常，请联系管理员' })

    // 正常登录
    const loginSuccessRes = await this.loginSuccess(db, conditions, one)

    // 删除redis缓存
    app.redis.del(`emailcaptcha:${data.email}:login:code`)

    return {
      data: loginSuccessRes.res,
      token: loginSuccessRes.token,
      msg: '登录成功'
    }
  }

  /**
   * 微信登录 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.code - 微信小程序临时登录凭证 code
   */
  async loginByWechat(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数校验
    if (!isTruthy(data.code)) ctx.throw(400, { msg: 'code 必填' })

    const wxurl = 'https://api.weixin.qq.com/sns/jscode2session'
    const wxRes = await ctx.curl(wxurl, {
      method: 'GET',
      dataType: 'json',
      timeout: 60000,
      data: {
        appid: app.config.wechat.appid,
        secret: app.config.wechat.appsecret,
        js_code: data.code,
        grant_type: 'authorization_code'
      }
    })

    // 授权失败
    if (wxRes.data.errmsg) {
      return {
        code: wxRes.data.errcode,
        msg: wxRes.data.errmsg
      }
    }

    /**
     * 授权成功
     * @param session_key 会话密钥
     * @param openid 用户唯一标识
     * @param unionid 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回
     * @description 将 session_key 与 openid 关联，生成自定义登录态
     */
    const { session_key, openid, unionid } = wxRes.data

    // 查询条件处理
    const conditions = { wx_openid: openid }

    // 数据库连接
    const db = app.model.SysUser

    // 查询
    let one = await db.findOne(conditions)

    // 第一次登录，自动创建用户
    if (!one) {
      // 初始化用户数据
      const userInfo = {
        username: `user_${generateRandomCode(8)}`,
        wx_openid: openid, // 初始化 wx_openid
        wx_unionid: unionid, // 初始化 wx_unionid
        wx_session_key: session_key, // 初始化 wx_session_key
        role: ['user'],
        status: 1,
        gender: 0,
        score: 0,
        my_invite_code: generateRandomCode(10), // 10位随机码
        register_ip: ctx.request.ip, // IP地址
        register_date: Date.now(),
        register_platform: judgePlatform(ctx)
      }

      // 注册用户
      await db.create(userInfo)

      // 注册之后重新查询用户数据
      one = await db.findOne(conditions)
    }

    // 状态校验
    if (one.status !== 1) ctx.throw(400, { msg: '账号状态异常，请联系管理员' })

    // 正常登录
    const loginSuccessRes = await this.loginSuccess(db, conditions, one)

    return {
      data: loginSuccessRes.res,
      token: loginSuccessRes.token,
      msg: '登录成功'
    }
  }

  /**
   * 退出登录 post - 权限 self_id
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名
   */
  async logout(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self_id', data.user_id)

    // 查询条件处理
    const conditions = { user_id: data.user_id }

    // 数据库连接
    const db = app.model.SysUser

    // 清空token
    const res = await db.findOneAndUpdate(conditions, { token: '' }, { new: true })

    return {
      msg: '退出登录'
    }
  }

  /**
   * 注册 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.username - 用户名
   * @property {String} data.password - 密码
   * @property {String} data.captcha - 验证码
   * @property {Array} data.role - 角色 默认user，超级管理员默认admin，注册时只能是user/admin，后续可自行调整
   */
  async register(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    data = Object.assign(
      {
        username: '',
        password: '',
        captcha: '',
        role: ['user']
      },
      data
    )

    // 参数校验
    if (!isTruthy(data.username)) ctx.throw(400, { msg: '请输入账号' })
    if (!isTruthy(data.password)) ctx.throw(400, { msg: '请输入密码' })
    if (!isTruthy(data.captcha)) ctx.throw(400, { msg: '请输入验证码' })

    // 参数校验
    // 用户名合法性校验
    const usernameRegExp = useRegExp('username')
    if (!usernameRegExp.regexp.test(data.username)) ctx.throw(400, { msg: usernameRegExp.msg })
    // 密码合法性校验
    const passwordRegExp = useRegExp('password')
    if (!passwordRegExp.regexp.test(data.password)) ctx.throw(400, { msg: passwordRegExp.msg })

    // 验证码
    const ip = ctx.request.ip // IP地址
    const captcha_register = await app.redis.get(`captcha:${ip}:register:code`)
    if (!isTruthy(captcha_register)) ctx.throw(400, { msg: '验证码已失效，请刷新' })
    if (data.captcha.toLowerCase() != captcha_register.toLowerCase()) ctx.throw(400, { msg: '验证码错误' })

    // 注册时角色只能是user/admin
    if (data.role[0] !== 'user' && data.role[0] !== 'admin') ctx.throw(400, { msg: 'role 传参错误' })

    // 查询条件处理
    const conditions = { username: data.username }

    // 数据库连接
    const db = app.model.SysUser

    // 注册管理员账号时需要校验，不允许重复注册admin
    if (data.role[0] == 'admin') {
      const administrator = await db.findOne({ role: { $in: ['admin'] } })
      if (administrator) ctx.throw(400, { msg: '管理员账号已存在' })
    }

    // 查询
    const one = await db.findOne(conditions)
    if (one) ctx.throw(400, { msg: '用户名已存在' })

    // 密码加密
    data.password = crypto.createHash('sha256').update(data.password).digest('hex')

    // 账号数据初始化
    data.status = 1
    data.gender = 0
    data.score = 0
    data.my_invite_code = generateRandomCode(10) // 10位随机码
    data.register_ip = ip
    data.register_date = Date.now()
    data.register_platform = judgePlatform(ctx)

    // 注册用户
    const res = await db.create(data)

    // 注册成功之后自动登录
    const loginSuccessRes = await this.loginSuccess(db, conditions, res)

    return {
      data: loginSuccessRes.res,
      token: loginSuccessRes.token,
      msg: '注册成功'
    }
  }

  /**
   * 是否存在admin账号 get - 权限 open
   */
  async hasAdmin() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 查询条件处理
    const conditions = { role: { $in: ['admin'] } }

    // 数据库连接
    const db = app.model.SysUser

    // 查询
    const administrator = await db.findOne(conditions)

    return {
      data: !!administrator,
      msg: !!administrator ? '已存在admin账号' : '尚无admin账号'
    }
  }

  /**
   * 刷新token post - 权限 self
   * @param {Object} data - 请求参数
   * @property {String} data.user_id - 用户UID
   */
  async refreshToken(data) {
    const { ctx, app } = this

    // 参数校验
    if (!isTruthy(data.user_id)) ctx.throw(400, { msg: 'user_id 必填' })

    // 权限校验
    ctx.checkAuthority('self_id', data.user_id)

    // 查询条件处理
    const conditions = { user_id: data.user_id }

    // 数据库连接
    const db = app.model.SysUser

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(401, { msg: '用户不存在' })

    // 根据role获取权限列表
    const permissionRes = await ctx.service.sysRole.findPermissionByRole(one.role)

    // jwt数据
    const jwtData = {
      user_id: one.user_id,
      username: one.username,
      phone: one.phone,
      email: one.email,
      role: one.role,
      permission: permissionRes.data,
      status: one.status
    }

    // 更新token
    const token = app.jwt.sign(jwtData, app.config.jwt.secret, { expiresIn: app.config.jwt.expires })

    const res = await db.findOneAndUpdate(conditions, { token: token }, { new: true })

    return {
      token,
      verify: jwtData,
      msg: 'token更新成功'
    }
  }

  /**
   * 解析token get - 权限 open
   * @param {String} token - token
   */
  verifyToken(token) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数校验
    if (!token) ctx.throw(400, { msg: 'token 不能为空' })

    const tokenInfo = app.jwt.verify(token, app.config.jwt.secret)

    return {
      data: tokenInfo,
      msg: 'token解析成功'
    }
  }
}

module.exports = SysLoginService
