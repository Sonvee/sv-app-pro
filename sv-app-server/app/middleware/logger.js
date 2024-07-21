const { uaHandler } = require('../utils')
const libqqwry = require('lib-qqwry')
const useRegExp = require('../utils/regexp')
const qqwry = libqqwry() // 初始化IP库解析器
qqwry.speed() // 启用急速模式

/**
 * 日志记录器
 */
module.exports = (options, app) => {
  return async function logger(ctx, next) {
    // 洋葱圈模型 - 前执行操作
    // 无操作

    await next()

    // 洋葱圈模型 - 后执行操作

    // 返回体都没有就直接结束操作
    if (!ctx.body) return

    // 非日志过滤：指定的api不会触发日志添加
    const nologfilter = [
      '/api/auth/getCaptcha',
      '/api/auth/emailCaptcha',
      '/api/user/hasAdmin',
      '/api/user/verifyToken',
      '/api/user/refreshToken',
      '/api/user/findPermissionByRole',
      '/api/sys/menuList',
      '/api/sys/dictitemListByRedis',
      '/api/sys/logList',
      '/api/sys/logDelete',
      '/api/sys/logBatchDelete',
      '/api/sys/logClear'
    ]
    if (nologfilter.includes(ctx.request.url)) return

    // 日志数据创建
    const logdata = {}

    // 日志类型：login 登录日志（登录、登出、注册），operation 操作日志
    if (ctx.request.url?.includes('login') || ctx.request.url?.includes('logout') || ctx.request.url?.includes('register')) {
      logdata.log_type = 'login'
    } else {
      logdata.log_type = 'operation'
    }

    // 请求耗时
    logdata.costtime = ctx.body.costtime

    // IP地址
    logdata.operator_ip = ctx.request.ip
    logdata.operator_location = qqwry.searchIP(ctx.request.ip).Country

    // 请求相关
    logdata.request_method = ctx.request.method
    logdata.request_url = ctx.request.url
    logdata.request_params = ctx.request.body

    logdata.request_status = ctx.body.code
    logdata.request_msg = ctx.body.msg
    logdata.request_err = ctx.body.errMsg // 报错详情 非显式展示

    // 操作人员信息
    logdata.operator_info = ctx.userInfo // 注：免token接口无用户信息

    // login时需过滤请求参数
    if (logdata.request_url === '/api/user/login') {
      if (logdata.request_params.username && logdata.request_params.password) {
        // 过滤用户密码
        delete logdata.request_params.password
        // 重置操作人员信息
        logdata.operator_info = { username: logdata.request_params.username }

        // 登录方式：仅登录日志
        // 判断登录方式：account账号密码/phone手机号登录/email邮箱登录
        if (useRegExp('phone').regexp.test(logdata.request_params.username)) {
          logdata.login_type = 'phone'
        } else if (useRegExp('email').regexp.test(logdata.request_params.username)) {
          logdata.login_type = 'email'
        } else {
          logdata.login_type = 'account'
        }
      }
    } else if (logdata.request_url === '/api/user/loginByEmailer') {
      // 重置操作人员信息
      logdata.operator_info = { email: logdata.request_params.email }
      // 邮箱验证码登录
      logdata.login_type = 'emailer'
    } else if (logdata.request_url === '/api/user/loginByWechat') {
      // 重置操作人员信息
      logdata.operator_info = { username: '微信登录无法获取操作人员信息' }
      // 邮箱验证码登录
      logdata.login_type = 'wechat'
    } else if (logdata.request_url === '/api/user/register') {
      // 重置操作人员信息
      logdata.operator_info = { username: logdata.request_params.username }
      // 登录方式：注册
      logdata.login_type = 'register'
    } else if (logdata.request_url === '/api/user/logout') {
      // 登录方式：登出
      logdata.login_type = 'logout'
    }

    // ua解析
    logdata.userAgent = uaHandler(ctx)

    // 生成日志
    ctx.service.sysLog.logAdd(logdata)
  }
}
