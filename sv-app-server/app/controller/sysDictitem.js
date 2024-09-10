'use strict'

const Controller = require('egg').Controller

class SysDictitemController extends Controller {
  async dictitemList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemList(data)
    ctx.result(res)
  }

  async dictitemListByRedis() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemListByRedis(data)
    ctx.result(res)
  }

  async dictitemAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemAdd(data)
    ctx.result(res)
  }

  async dictitemUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemUpdate(data)
    ctx.result(res)
  }

  async dictitemDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemDelete(data)
    ctx.result(res)
  }

  async dictitemBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemBatchAdd(data)
    ctx.result(res)
  }

  async dictitemBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemBatchDelete(data)
    ctx.result(res)
  }

  async dictitemExcelTemplate() {
    const { ctx, service } = this
    const res = await service.sysDictitem.dictitemExcelTemplate()
    ctx.result(res)
  }

  async dictitemImport() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemImport({ data, files })
    ctx.result(res)
  }

  async dictitemExport() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysDictitem.dictitemExport(data)
    ctx.result(res)
  }
}

module.exports = SysDictitemController
