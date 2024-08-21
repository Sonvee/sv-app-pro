'use strict'

const Controller = require('egg').Controller

class VipBenefitController extends Controller {
  async benefitList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitList(data)
    ctx.result(res)
  }

  async benefitAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitAdd(data)
    ctx.result(res)
  }

  async benefitUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitUpdate(data)
    ctx.result(res)
  }

  async benefitDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitDelete(data)
    ctx.result(res)
  }

  async benefitBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitBatchAdd(data)
    ctx.result(res)
  }

  async benefitBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = VipBenefitController