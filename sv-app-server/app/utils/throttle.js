/**
 * 节流阀
 * @param {String} ctx - eggjs上下文
 * @param {String} key - 节流阀key，格式约定【前缀:唯一标识(若干标识以:隔开):throttle】
 * @param {String} time - 节流时长（秒）
 * @return
 */
async function useThrottle({ ctx, key, time }) {
  // 节流检测
  const existingThrottle = await ctx.app.redis.get(key);
  if (existingThrottle) {
    return ctx.throw(429, { msg: `请耐心等待${time}秒` });
  }
  // 通过节流阀
  await ctx.app.redis.set(key, 1, 'EX', time);
}

module.exports = useThrottle;
