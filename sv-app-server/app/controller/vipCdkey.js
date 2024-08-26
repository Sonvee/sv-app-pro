'use strict';

const Controller = require('egg').Controller;

class VipCdkeyController extends Controller {
  async cdkeyList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyList(data);
    ctx.result(res);
  }

  async cdkeyAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyAdd(data);
    ctx.result(res);
  }

  async cdkeyUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyUpdate(data);
    ctx.result(res);
  }

  async cdkeyDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyDelete(data);
    ctx.result(res);
  }

  async cdkeyClear() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyClear(data);
    ctx.result(res);
  }

  async cdkeyBatchDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyBatchDelete(data);
    ctx.result(res);
  }

  async cdkeyActive() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipCdkey.cdkeyActive(data);
    ctx.result(res);
  }
}

module.exports = VipCdkeyController;
