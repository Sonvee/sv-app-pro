'use strict';

const Controller = require('egg').Controller;

class AppReleaseController extends Controller {
  async releaseList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appRelease.releaseList(data)
    ctx.result(res)
  }

  async releaseAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appRelease.releaseAdd(data)
    ctx.result(res)
  }

  async releaseUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appRelease.releaseUpdate(data)
    ctx.result(res)
  }

  async releaseDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appRelease.releaseDelete(data)
    ctx.result(res)
  }

  async releaseBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appRelease.releaseBatchAdd(data)
    ctx.result(res)
  }

  async releaseBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.appRelease.releaseBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = AppReleaseController;
