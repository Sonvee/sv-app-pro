'use strict'

const Controller = require('egg').Controller

class FileController extends Controller {
  async avatarUpload() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.file.avatarUpload({ data, files })
    ctx.result(res)
  }

  async myfileDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.file.myfileDelete(data)
    ctx.result(res)
  }

  async userfilesDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.file.userfilesDelete(data)
    ctx.result(res)
  }

  async releaseUpload() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.file.releaseUpload({ data, files })
    ctx.result(res)
  }

  async releaseImageUpload() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.file.releaseImageUpload({ data, files })
    ctx.result(res)
  }

  async feedbackImageUpload() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.file.feedbackImageUpload({ data, files })
    ctx.result(res)
  }
}

module.exports = FileController
