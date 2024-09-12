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

  async benefitExcelTemplate() {
    const { ctx, service } = this
    const res = await service.vipBenefit.benefitExcelTemplate()
    ctx.result(res)
  }

  async benefitImport() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitImport({ data, files })
    ctx.result(res)
  }

  async benefitExport() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.vipBenefit.benefitExport(data)
    ctx.result(res)
  }
}

module.exports = VipBenefitController
