'use strict'

const Controller = require('egg').Controller

class appNoticeController extends Controller {
  async noticeList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeList(data)
    ctx.result(res)
  }

  async noticeInTime() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeInTime(data)
    ctx.result(res)
  }

  async noticeAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeAdd(data)
    ctx.result(res)
  }

  async noticeUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeUpdate(data)
    ctx.result(res)
  }

  async noticeDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeDelete(data)
    ctx.result(res)
  }

  async noticeBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeBatchAdd(data)
    ctx.result(res)
  }

  async noticeBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appNotice.noticeBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = appNoticeController
