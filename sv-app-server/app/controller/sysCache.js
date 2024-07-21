'use strict'

const Controller = require('egg').Controller

class SysCacheController extends Controller {
  async cacheList() {
    const { ctx, service } = this
    const data = ctx.request.query
    const res = await service.sysCache.cacheList(data)
    ctx.result(res)
  }

  async cacheDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysCache.cacheDelete(data)
    ctx.result(res)
  }

  async cacheBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysCache.cacheBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = SysCacheController
