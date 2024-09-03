'use strict'

const Controller = require('egg').Controller

class SysCacheController extends Controller {
  async cacheKeyList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysCache.cacheKeyList(data)
    ctx.result(res)
  }

  async cacheValueByKey() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysCache.cacheValueByKey(data)
    ctx.result(res)
  }

  async cacheDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysCache.cacheDelete(data)
    ctx.result(res)
  }
}

module.exports = SysCacheController
