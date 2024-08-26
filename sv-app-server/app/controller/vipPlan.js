'use strict';

const Controller = require('egg').Controller;

class VipPlanController extends Controller {
  async planList() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipPlan.planList(data);
    ctx.result(res);
  }

  async planAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipPlan.planAdd(data);
    ctx.result(res);
  }

  async planUpdate() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipPlan.planUpdate(data);
    ctx.result(res);
  }

  async planDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipPlan.planDelete(data);
    ctx.result(res);
  }

  async planBatchAdd() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipPlan.planBatchAdd(data);
    ctx.result(res);
  }

  async planBatchDelete() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.vipPlan.planBatchDelete(data);
    ctx.result(res);
  }
}

module.exports = VipPlanController;
