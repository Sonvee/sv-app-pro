'use strict'

const Controller = require('egg').Controller

class SysAuthController extends Controller {
  async getCaptcha() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysAuth.getCaptcha(data)
    ctx.result(res)
  }

  async emailCaptcha() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysAuth.emailCaptcha(data)
    ctx.result(res)
  }
}

module.exports = SysAuthController
