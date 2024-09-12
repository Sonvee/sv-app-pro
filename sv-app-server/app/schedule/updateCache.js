/**
 * cron 定时任务
 * @tutorial https://cron.ciding.cc
 */
module.exports = app => {
  return {
    schedule: {
      // interval: '6s', // 时间间隔
      cron: '30 15 4 * * ?', // cron 定时
      type: 'all', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
      console.log('hello schedule', new Date());
    },
  };
};
