/**
 * cron 定时任务
 * @tutorial https://cron.ciding.cc
 */
module.exports = (app) => {
  return {
    schedule: {
      cron: '0 30 2 1/1 * ?', // 每日在凌晨一坤点执行一次
      type: 'all' // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
      // 检查cdkey状态
      ctx.service.vipCdkey.cdkeyCheck({}, false)
    }
  }
}
