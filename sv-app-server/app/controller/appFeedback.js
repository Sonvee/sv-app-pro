'use strict'

const Controller = require('egg').Controller

class AppFeedbackController extends Controller {
  async feedbackList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appFeedback.feedbackList(data)
    ctx.result(res)
  }

  async feedbackAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appFeedback.feedbackAdd(data)
    ctx.result(res)
  }

  async feedbackUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appFeedback.feedbackUpdate(data)
    ctx.result(res)
  }

  async feedbackDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appFeedback.feedbackDelete(data)
    ctx.result(res)
  }

  async feedbackBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appFeedback.feedbackBatchAdd(data)
    ctx.result(res)
  }

  async feedbackBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appFeedback.feedbackBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = AppFeedbackController