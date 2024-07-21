'use strict'

const Controller = require('egg').Controller

class SysNoticeController extends Controller {
  async noticeList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysNotice.noticeList(data)
    ctx.result(res)
  }

  async noticeAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysNotice.noticeAdd(data)
    ctx.result(res)
  }

  async noticeUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysNotice.noticeUpdate(data)
    ctx.result(res)
  }

  async noticeDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysNotice.noticeDelete(data)
    ctx.result(res)
  }

  async noticeBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysNotice.noticeBatchAdd(data)
    ctx.result(res)
  }

  async noticeBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysNotice.noticeBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = SysNoticeController
