'use strict'

const Controller = require('egg').Controller

class SysLogController extends Controller {
  async logList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLog.logList(data)
    ctx.result(res)
  }

  async logDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLog.logDelete(data)
    ctx.result(res)
  }

  async logBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLog.logBatchDelete(data)
    ctx.result(res)
  }

  async logClear() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLog.logClear(data)
    ctx.result(res)
  }

  async logExport() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLog.logExport(data)
    ctx.result(res)
  }
}

module.exports = SysLogController
