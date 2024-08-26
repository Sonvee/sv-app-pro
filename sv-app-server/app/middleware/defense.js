const useLimit = require('../utils/limit');

/**
 * 安全防护层
 * 1. 防刷机制，超过阈值自动封锁IP
 * @param options
 * @param app
 */
module.exports = (options, app) => {
  return async function security(ctx, next) {
    // 洋葱圈模型 - 前执行操作

    // 限流阀
    await useLimit({ ctx, key: 'limit:ipforbidden', threshold: app.config.maxRequestThreshold });

    // 正常访问
    await next();

    // 洋葱圈模型 - 后执行操作
    // 无操作
  };
};
