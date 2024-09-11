'use strict'

const Controller = require('egg').Controller

class AppHelpController extends Controller {
  async helpList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpList(data)
    ctx.result(res)
  }

  async helpAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpAdd(data)
    ctx.result(res)
  }

  async helpUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpUpdate(data)
    ctx.result(res)
  }

  async helpDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpDelete(data)
    ctx.result(res)
  }

  async helpBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpBatchAdd(data)
    ctx.result(res)
  }

  async helpBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpBatchDelete(data)
    ctx.result(res)
  }

  async helpExcelTemplate() {
    const { ctx, service } = this
    const res = await service.appHelp.helpExcelTemplate()
    ctx.result(res)
  }

  async helpImport() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.appHelp.helpImport({ data, files })
    ctx.result(res)
  }

  async helpExport() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appHelp.helpExport(data)
    ctx.result(res)
  }
}

module.exports = AppHelpController
