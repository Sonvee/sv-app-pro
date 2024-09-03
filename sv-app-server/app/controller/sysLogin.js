'use strict'

const Controller = require('egg').Controller

class SysLoginController extends Controller {
  async login() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLogin.login(data)
    ctx.result(res)
  }

  async loginByEmailer() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLogin.loginByEmailer(data)
    ctx.result(res)
  }

  async loginByWechat() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLogin.loginByWechat(data)
    ctx.result(res)
  }

  async logout() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLogin.logout(data)
    ctx.result(res)
  }

  async register() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLogin.register(data)
    ctx.result(res)
  }

  async hasAdmin() {
    const { ctx, service } = this
    const res = await service.sysLogin.hasAdmin()
    ctx.result(res)
  }

  async refreshToken() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysLogin.refreshToken(data)
    ctx.result(res)
  }

  async verifyToken() {
    const { ctx, service } = this
    const { header } = ctx.request
    const token = header.authorization.slice(7) || '' // Bearer的长度 + 1空格 = 7
    const res = await service.sysLogin.verifyToken(token)
    ctx.result(res)
  }
}

module.exports = SysLoginController
