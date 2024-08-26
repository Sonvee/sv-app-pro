'use strict';

const Controller = require('egg').Controller;

class SysDictController extends Controller {
  async dictList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysDict.dictList(data);
    ctx.result(res);
  }

  async dictAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysDict.dictAdd(data);
    ctx.result(res);
  }

  async dictUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysDict.dictUpdate(data);
    ctx.result(res);
  }

  async dictDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysDict.dictDelete(data);
    ctx.result(res);
  }

  async dictBatchAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysDict.dictBatchAdd(data);
    ctx.result(res);
  }

  async dictBatchDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.sysDict.dictBatchDelete(data);
    ctx.result(res);
  }
}

module.exports = SysDictController;
