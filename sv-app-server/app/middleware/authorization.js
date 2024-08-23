const { arrayIncludesSubarray } = require('../utils')

/**
 * 鉴权
 */
module.exports = (options, app) => {
  return async function authorization(ctx, next) {
    // 洋葱圈模型 - 前执行操作
    const { header } = ctx.request
    const token = header.authorization?.slice(7) || '' // Bearer的长度 + 1个空格 = 7

    let userInfo, error
    try {
      userInfo = await app.jwt.verify(token, app.config.jwt.secret)
    } catch (err) {
      error = err
    } finally {
      if (userInfo) {
        ctx.userInfo = userInfo
        // 用户状态判断
        if (userInfo?.status !== 1) {
          // 用户异常
          ctx.throw(403, '用户状态异常')
          return
        }
      }

      /**
       * 角色权限校验
       * @param {String} mode
       * @property {String} mode.open - 开放型接口，无需做权限校验
       * @property {String} mode.needlogin - 需要登录（检验token是否有效）
       * @property {String} mode.self - 必须账号本人操作
       * @property {String} mode.permission - 用户拥有指定权限
       * @property {String} mode.role - 用户拥有指定角色
       * @property {String} mode.admin - 必须为超级管理员
       * @param {String|Array} flag 对比校验值，当mode为self时flag为字符串，当mode为role或permission时flag为数组
       * @returns {Boolean} 校验结果
       */
      ctx.checkAuthority = (mode, flag) => {
        // 超级管理员拥有所有权限
        if (userInfo?.role?.includes('admin')) {
          return true
        }
        // 校验结果
        let result = false
        switch (mode) {
          case 'open':
            // 放行
            result = true
            break
          case 'needlogin':
            result = !!userInfo
            if (error) throw error
            if (!result) ctx.throw(401, '请先登录!')
            break
          case 'self':
            result = userInfo?.user_id === flag
            if (error) throw error
            if (!result) ctx.throw(403, '非本人操作!')
            break
          case 'role':
            result = arrayIncludesSubarray(userInfo?.role, flag)
            if (error) throw error
            if (!result) ctx.throw(403, `非 ${flag.toString()} 角色，禁止访问`)
            break
          case 'permission':
            result = arrayIncludesSubarray(userInfo?.permission, flag)
            if (error) throw error
            if (!result) ctx.throw(403, `无 ${flag.toString()} 权限，禁止访问`)
            break
          case 'admin':
            result = userInfo?.role.includes('admin')
            if (error) throw error
            if (!result) ctx.throw(403, '权限不足，禁止访问')
            break
          default:
            result = false
            if (error) throw error
            ctx.throw(403, 'checkAuthority无效，请检查')
            break
        }
        return result
      }
    }

    await next()

    // 洋葱圈模型 - 后执行操作
    // 无操作
  }
}
