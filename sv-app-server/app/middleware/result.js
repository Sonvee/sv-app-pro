const codeMap = {
  200: 'request:ok',
  400: 'Bad Request',
  401: 'token过期或无效',
  403: '403 Forbidden',
  404: '404 Not Found',
  405: 'Method Not Allowed',
  429: 'Too Many Requests',
  500: '服务器错误',
  503: '服务不可用',
  unknown: '未知错误'
}

/**
 * 统一结果处理
 * @param {Object} params - 参数
 * @property {String} params.code - http状态码
 * @property {String} params.msg - 处理消息
 * @property {Boolean} params.success - 是否成功
 * @property {String} params.querytime - 请求时间
 * @property {any} params.x - 其他自定义参数
 * @return {Object} 结果
 */
function resHandler(params) {
  const res = Object.assign(
    {
      code: 200
    },
    params
  )

  // 二进制文件直接返回
  if (res.type == 'buffer' || res.type == 'blob') return res.data

  if (!res.msg) {
    res.msg = codeMap[res.code]
  }
  res.success = String(res.code).startsWith('2') || String(res.code).startsWith('0')
  res.querytime = Date.now()

  return res
}

module.exports = (options, app) => {
  return async function result(ctx, next) {
    // 洋葱圈模型 - 前执行操作
    const starttime = Date.now() // 记录开始时间
    try {
      ctx.result = (params) => {
        ctx.body = resHandler(params)
      }

      await next()

      // 洋葱圈模型 - 后执行操作

      // 正常返回的情况下，记录耗时
      if (ctx.body) {
        const endtime = Date.now() // 记录结束时间
        const costtime = endtime - starttime // 计算耗时
        // 记录耗时
        ctx.body.costtime = costtime
      }
    } catch (error) {
      let { status: code = 400, name, message, msg } = error

      switch (error.name) {
        case 'JsonWebTokenError':
        case 'TokenExpiredError':
        case 'UnauthorizedError':
          code = 401
          break
        default:
          break
      }

      const endtime = Date.now() // 记录结束时间
      const costtime = endtime - starttime // 计算耗时

      app.logger.error('error ==>> ', error, '| code ==>>', code, '| name ==>>', name, '| message ==>>', message, '| msg ==>>', msg)

      ctx.body = resHandler({
        code,
        msg,
        errMsg: error.errMsg || {
          name,
          message
        },
        costtime // 记录耗时
      })
    }
  }
}
