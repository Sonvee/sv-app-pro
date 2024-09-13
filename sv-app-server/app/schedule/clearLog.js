const dayjs = require('dayjs')

/**
 * cron 定时任务
 * @tutorial https://cron.ciding.cc
 */
module.exports = (app) => {
  return {
    schedule: {
      // interval: '3s', // 时间间隔
      cron: '30 15 4 1/1 * ?', // 每日在凌晨4点15分20秒执行一次
      type: 'all' // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
      // 清空操作日志
      const threeDaysAgo = dayjs().subtract(3, 'day').startOf('day').valueOf() // 前三天0点时间戳
      ctx.service.sysLog.logClear({ log_type: 'operation', time_range: [0, threeDaysAgo] }, false)
    }
  }
}
