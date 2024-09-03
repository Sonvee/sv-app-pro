'use strict'

const Controller = require('egg').Controller

class TestForeignController extends Controller {
  async testforeignList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testForeign.testforeignList(data)
    ctx.result(res)
  }

  async testforeignAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testForeign.testforeignAdd(data)
    ctx.result(res)
  }

  async testforeignUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testForeign.testforeignUpdate(data)
    ctx.result(res)
  }

  async testforeignDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testForeign.testforeignDelete(data)
    ctx.result(res)
  }

  async testforeignBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testForeign.testforeignBatchAdd(data)
    ctx.result(res)
  }

  async testforeignBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testForeign.testforeignBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = TestForeignController
