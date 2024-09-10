/**
 * 限流阀
 * @param {String} ctx - eggjs上下文
 * @param {String} key - 限流阀key，格式约定【limit:唯一标识(若干标识以:隔开)】
 * @param {Number} threshold - 限流阀阈值，超过此值将自动封锁ip
 * @param {Number} unlock - 自动解锁时长（秒），为假值则视为永久封锁
 * @return
 */
async function useLimit({ ctx, key, threshold, unlock }) {
  const ip = ctx.request.ip
  const ipBanKey = `${key}:${ip}` // 自动为key添加id，以更小颗粒度控制
  const timeKey = `${key}:${ip}:${Math.floor(Date.now() / 1000)}`

  // 获取IP禁止列表
  const ipForbidden = await ctx.app.redis.get(ipBanKey)

  // 判断IP是否被封禁
  if (ipForbidden) {
    // 禁止访问
    ctx.throw(403, 'IP 禁止访问')
    return
  }

  // 允许访问
  // 每秒访问次数超出阈值，则封禁ip

  let requestCount = await ctx.app.redis.get(timeKey)
  if (!requestCount) {
    requestCount = 0
  }
  // 增加请求计数
  await ctx.app.redis.set(timeKey, Number(requestCount) + 1, 'EX', 3) // 3秒后自动删除

  // 检查是否超出阈值
  const maxThreshold = threshold || 60 // 默认60次/s
  if (Number(requestCount) + 1 > maxThreshold) {
    // 封禁IP
    if (unlock) {
      await ctx.app.redis.set(ipBanKey, 1, 'EX', unlock) // 缓存个1表示已封禁
    } else {
      await ctx.app.redis.set(ipBanKey, 1) // 不设解锁时长则视为永久封禁
    }

    // 访问超出阈值报错
    ctx.throw(429, 'Too Many Requests')
    return
  }
}

module.exports = useLimit
