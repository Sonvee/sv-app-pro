'use strict'

const Controller = require('egg').Controller

class TestDemoController extends Controller {
  async testList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testDemo.testList(data)
    ctx.result(res)
  }

  async testAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testDemo.testAdd(data)
    ctx.result(res)
  }

  async testUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testDemo.testUpdate(data)
    ctx.result(res)
  }

  async testDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testDemo.testDelete(data)
    ctx.result(res)
  }

  async testBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testDemo.testBatchAdd(data)
    ctx.result(res)
  }

  async testBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.testDemo.testBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = TestDemoController
