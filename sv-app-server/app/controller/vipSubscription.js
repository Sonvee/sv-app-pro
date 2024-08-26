'use strict';

const Controller = require('egg').Controller;

class VipPlanController extends Controller {
  async subscriptionList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipSubscription.subscriptionList(data);
    ctx.result(res);
  }

  async subscriptionAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipSubscription.subscriptionAdd(data);
    ctx.result(res);
  }

  async subscriptionUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipSubscription.subscriptionUpdate(data);
    ctx.result(res);
  }

  async subscriptionDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipSubscription.subscriptionDelete(data);
    ctx.result(res);
  }

  async subscriptionBatchDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipSubscription.subscriptionBatchDelete(data);
    ctx.result(res);
  }
}

module.exports = VipPlanController;
